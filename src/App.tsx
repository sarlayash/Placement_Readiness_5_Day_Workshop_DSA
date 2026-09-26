import React, { useState, useEffect } from 'react';
import { GoogleUser, UserProgress } from './types';
import {
  loadGoogleUser,
  saveGoogleUser,
  loadUserProgress,
  saveUserProgress,
  generateCertificateId,
  INITIAL_PROGRESS,
} from './utils/storage';
import { calculateISTStatus, isDayUnlocked } from './utils/istTime';
import { TOPICS, DAILY_ASSESSMENTS } from './data/curriculum';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LeftSidebar } from './components/LeftSidebar';
import { RightSidebar } from './components/RightSidebar';
import { DayView } from './components/DayView';
import { GoogleAuthModal } from './components/GoogleAuthModal';
import { AssessmentModal } from './components/AssessmentModal';
import { ProctoredExamModal } from './components/ProctoredExamModal';
import { CertificateModal } from './components/CertificateModal';
import { BadgeGallery } from './components/BadgeGallery';
import { Lock, Unlock, Clock, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export function App() {
  // Authentication State (Strictly Google Login Only)
  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(() => loadGoogleUser());

  // Learning Progress State
  const [progress, setProgress] = useState<UserProgress>(() => loadUserProgress());

  // Layout Resizable Widths (Drag-expand options on left and right)
  const [leftWidth, setLeftWidth] = useState<number>(280);
  const [rightWidth, setRightWidth] = useState<number>(350);
  const [leftSidebarMobileOpen, setLeftSidebarMobileOpen] = useState<boolean>(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState<boolean>(false);

  // Active Selected Day (1 to 5)
  const [currentDay, setCurrentDay] = useState<number>(1);

  // IST Time & Lock Simulation State
  const [simulatedDate, setSimulatedDate] = useState<Date | null>(null);
  const [demoBypass, setDemoBypass] = useState<boolean>(false);
  const [istStatus, setIstStatus] = useState(() => calculateISTStatus(null, false));

  // Modals
  const [activeAssessment, setActiveAssessment] = useState<{
    day: number;
    type: 'pre' | 'post';
  } | null>(null);
  const [showProctoredExam, setShowProctoredExam] = useState<boolean>(false);
  const [showCertificate, setShowCertificate] = useState<boolean>(false);
  const [showBadgeGallery, setShowBadgeGallery] = useState<boolean>(false);

  // Update IST status clock every second
  useEffect(() => {
    const updateTime = () => {
      setIstStatus(calculateISTStatus(simulatedDate, demoBypass));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [simulatedDate, demoBypass]);

  // Persist user and progress updates
  useEffect(() => {
    saveGoogleUser(googleUser);
  }, [googleUser]);

  useEffect(() => {
    saveUserProgress(progress);
  }, [progress]);

  // Handle Google Sign-in
  const handleGoogleSignIn = (user: GoogleUser) => {
    setGoogleUser(user);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#ffffff', '#a3a3a3'],
    });
  };

  const handleSignOut = () => {
    setGoogleUser(null);
  };

  // Toggle problem completion
  const handleToggleQuestion = (questionId: string) => {
    setProgress((prev) => {
      const alreadyCompleted = prev.completedQuestionIds.includes(questionId);
      const updated = alreadyCompleted
        ? prev.completedQuestionIds.filter((id) => id !== questionId)
        : [...prev.completedQuestionIds, questionId];
      return {
        ...prev,
        completedQuestionIds: updated,
      };
    });
  };

  // Complete Pre or Post Assessment
  const handleAssessmentComplete = (scorePercentage: number, passed: boolean) => {
    if (!activeAssessment) return;
    const { day, type } = activeAssessment;

    setProgress((prev) => {
      const newProgress = { ...prev };
      if (type === 'pre') {
        newProgress.dayPreAssessmentPassed[day] = passed;
        newProgress.dayPreAssessmentScores[day] = scorePercentage;
      } else {
        newProgress.dayPostAssessmentPassed[day] = passed;
        newProgress.dayPostAssessmentScores[day] = scorePercentage;
        if (passed) {
          newProgress.badgesUnlocked[day] = true;
        }
      }
      return newProgress;
    });
  };

  // Complete Final Proctored Exam
  const handleFinalExamComplete = (scorePercentage: number, passed: boolean) => {
    setProgress((prev) => {
      const newProgress = { ...prev };
      newProgress.finalExamPassed = passed;
      newProgress.finalExamScore = scorePercentage;
      if (passed) {
        newProgress.badgesUnlocked[5] = true;
        newProgress.finalExamDate = new Date().toISOString();
        if (!newProgress.certificateId && googleUser) {
          newProgress.certificateId = generateCertificateId(googleUser.name);
        }
      }
      return newProgress;
    });
  };

  // Reset Progress (for fresh testing)
  const handleResetProgress = () => {
    if (window.confirm('Reset all progress, assessments, and badges for a fresh test run?')) {
      setProgress(INITIAL_PROGRESS);
      setCurrentDay(1);
    }
  };

  // Set simulated IST hour
  const handleSetSimulatedHour = (targetHour: number) => {
    const d = new Date();
    // Match IST target hour
    // IST = UTC + 5.5 hours, so UTC = targetHour - 5.5
    const utcHours = targetHour - 5.5;
    d.setUTCHours(Math.floor(utcHours), (utcHours % 1) * 60, 0, 0);
    setSimulatedDate(d);
  };

  const handleResetSimulatedTime = () => {
    setSimulatedDate(null);
  };

  // Filter topics for the active day (Part 1 and Part 2)
  const dayTopics = TOPICS.filter((t) => t.day === currentDay);

  // Check if current day is unlocked
  const dayLockState = isDayUnlocked(currentDay, progress.badgesUnlocked, istStatus, demoBypass);

  const totalQuestions = TOPICS.reduce((acc, t) => acc + t.questions.length, 0);
  const completedQuestions = progress.completedQuestionIds.length;
  const badgesEarned = Object.values(progress.badgesUnlocked).filter(Boolean).length;

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 selection:bg-indigo-500 selection:text-white">
      {/* 1. STRICT GOOGLE SIGN UP / LOGIN ONLY (Modal overlay if not authenticated) */}
      {!googleUser && <GoogleAuthModal onSignIn={handleGoogleSignIn} />}

      {/* 2. PROPER HEADER */}
      <Header
        user={googleUser}
        progress={progress}
        istStatus={istStatus}
        demoBypass={demoBypass}
        onToggleDemoBypass={() => setDemoBypass((prev) => !prev)}
        onSignOut={handleSignOut}
        onToggleLeftSidebar={() => setLeftSidebarMobileOpen((prev) => !prev)}
        onToggleRightSidebar={() => setRightSidebarOpen((prev) => !prev)}
        rightSidebarOpen={rightSidebarOpen}
        onOpenBadges={() => setShowBadgeGallery(true)}
        onOpenCertificate={() => setShowCertificate(true)}
      />

      {/* 3. MAIN WORKSPACE CONTAINER WITH LEFT AND RIGHT DRAGGABLE PANELS */}
      <div className="flex-1 flex relative bg-white">
        {/* Left Navigation Bar (with draggable resize handle) */}
        <LeftSidebar
          currentDay={currentDay}
          onSelectDay={(day) => setCurrentDay(day)}
          progress={progress}
          istStatus={istStatus}
          demoBypass={demoBypass}
          isOpenMobile={leftSidebarMobileOpen}
          onCloseMobile={() => setLeftSidebarMobileOpen(false)}
          width={leftWidth}
          onWidthChange={setLeftWidth}
          onOpenBadges={() => setShowBadgeGallery(true)}
          onOpenCertificate={() => setShowCertificate(true)}
          onOpenFinalExam={() => setShowProctoredExam(true)}
        />

        {/* Center Main Content Area */}
        <main
          style={{
            marginLeft: `${leftWidth}px`,
            marginRight: rightSidebarOpen ? `${rightWidth}px` : '0px',
          }}
          className="flex-1 p-4 md:p-8 transition-[margin] duration-150 ease-out max-lg:!ml-0 max-lg:!mr-0 bg-white"
        >
          {/* Locked Day Warning Banner if day is locked */}
          {!dayLockState.unlocked ? (
            <div className="max-w-2xl mx-auto my-12 p-8 rounded-3xl border border-slate-200 bg-slate-50/70 text-center space-y-4 shadow-sm">
              <div className="w-14 h-14 rounded-2xl border border-slate-300 bg-white flex items-center justify-center mx-auto text-amber-600 shadow-2xs">
                <Lock className="w-7 h-7" />
              </div>
              <h2 className="text-xl md:text-2xl font-black rainbow-text">Day {currentDay} is Currently Locked</h2>
              <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto font-medium">
                {dayLockState.reason}
              </p>
              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setDemoBypass(true)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs hover:opacity-90 transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Bypass Lock for Testing</span>
                </button>
                {currentDay > 1 && (
                  <button
                    type="button"
                    onClick={() => setCurrentDay((prev) => prev - 1)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:border-slate-300"
                  >
                    Go Back to Day {currentDay - 1}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <DayView
              day={currentDay}
              topics={dayTopics}
              progress={progress}
              istStatus={istStatus}
              demoBypass={demoBypass}
              onToggleQuestion={handleToggleQuestion}
              onOpenPreAssessment={() =>
                setActiveAssessment({ day: currentDay, type: 'pre' })
              }
              onOpenPostAssessment={() =>
                setActiveAssessment({ day: currentDay, type: 'post' })
              }
              onOpenFinalExam={() => setShowProctoredExam(true)}
              onOpenCertificate={() => setShowCertificate(true)}
              onOpenScratchpad={() => setRightSidebarOpen(true)}
            />
          )}
        </main>

        {/* Right Drawer (with draggable resize handle) */}
        <RightSidebar
          isOpen={rightSidebarOpen}
          onClose={() => setRightSidebarOpen(false)}
          width={rightWidth}
          onWidthChange={setRightWidth}
          istStatus={istStatus}
          demoBypass={demoBypass}
          onToggleDemoBypass={() => setDemoBypass((prev) => !prev)}
          onSetSimulatedHour={handleSetSimulatedHour}
          onResetSimulatedTime={handleResetSimulatedTime}
          progress={progress}
          onToggleQuestionCompletion={handleToggleQuestion}
        />
      </div>

      {/* 4. PROPER FOOTER */}
      <Footer
        completedCount={completedQuestions}
        totalQuestions={totalQuestions}
        badgesEarned={badgesEarned}
        onResetProgress={handleResetProgress}
      />

      {/* 5. MODALS & POPUPS */}
      {/* Daily Pre/Post Assessment Modal */}
      {activeAssessment && DAILY_ASSESSMENTS[activeAssessment.day] && (
        <AssessmentModal
          day={activeAssessment.day}
          type={activeAssessment.type}
          questions={
            activeAssessment.type === 'pre'
              ? DAILY_ASSESSMENTS[activeAssessment.day].preAssessment
              : DAILY_ASSESSMENTS[activeAssessment.day].postAssessment
          }
          onComplete={handleAssessmentComplete}
          onClose={() => setActiveAssessment(null)}
        />
      )}

      {/* Proctored Final Exam Modal */}
      {showProctoredExam && googleUser && (
        <ProctoredExamModal
          userName={googleUser.name}
          onComplete={handleFinalExamComplete}
          onClose={() => setShowProctoredExam(false)}
        />
      )}

      {/* Official Certificate Modal */}
      {showCertificate && googleUser && (
        <CertificateModal
          user={googleUser}
          progress={progress}
          onClose={() => setShowCertificate(false)}
        />
      )}

      {/* Daily Badges Gallery Modal */}
      {showBadgeGallery && (
        <BadgeGallery
          progress={progress}
          onClose={() => setShowBadgeGallery(false)}
        />
      )}
    </div>
  );
}
export default App;
