import React, { useState, useEffect } from 'react';
import { GoogleUser, UserProgress, Question } from './types';
import {
  loadGoogleUser,
  saveGoogleUser,
  loadUserProgress,
  saveUserProgress,
  generateCertificateId,
  INITIAL_PROGRESS,
} from './utils/storage';
import { calculateISTStatus } from './utils/istTime';
import { isDayUnlockedStrict, checkFinalExamEligibility } from './utils/prerequisites';
import { isOnline } from './utils/pwa';
import { TOPICS, DAILY_ASSESSMENTS } from './data/curriculum';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LeftSidebar } from './components/LeftSidebar';
import { DayView } from './components/DayView';
import { IDEWorkspace } from './components/IDEWorkspace';
import { InterviewTipsModal } from './components/InterviewTipsModal';
import { GoogleAuthModal } from './components/GoogleAuthModal';
import { AssessmentModal } from './components/AssessmentModal';
import { ProctoredExamModal } from './components/ProctoredExamModal';
import { CertificateModal } from './components/CertificateModal';
import { BadgeGallery } from './components/BadgeGallery';
import { SpinningWheelModal } from './components/SpinningWheelModal';
import { AptitudeSection } from './components/AptitudeSection';
import { PrerequisitesModal } from './components/PrerequisitesModal';
import { PWAInstallModal } from './components/PWAInstallModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import {
  calculateFeedbackStatus,
  sendDesktopNotification,
  hasNotifiedStage,
  markNotifiedStage,
  requestNotificationPermission,
} from './utils/feedback';
import { FeedbackReminderBanner } from './components/FeedbackReminderBanner';
import { DailyFeedbackModal } from './components/DailyFeedbackModal';
import { LevelZeroModal } from './components/LevelZeroModal';
import { Lock, Unlock, Clock, AlertCircle, Zap, Brain, LogIn, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export function App() {
  // Authentication State (Strictly Google Login Only)
  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(() => loadGoogleUser());
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  // Initial Onboarding: BEGIN WITH SPINNING WHEEL (for first-time / non-authenticated visitors)
  const [showSpinningWheel, setShowSpinningWheel] = useState<boolean>(() => !loadGoogleUser());

  // Learning Progress State
  const [progress, setProgress] = useState<UserProgress>(() => loadUserProgress());

  // Layout Resizable Widths & Collapsible States (Navy Blue Left Bar)
  const [leftWidth, setLeftWidth] = useState<number>(280);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [leftSidebarMobileOpen, setLeftSidebarMobileOpen] = useState<boolean>(false);

  // In-Browser IDE and Interview Playbook State
  const [activeIDEQuestion, setActiveIDEQuestion] = useState<Question | null>(null);
  const [showInterviewTips, setShowInterviewTips] = useState<boolean>(false);

  // Active Selected Day (1 to 5)
  const [currentDay, setCurrentDay] = useState<number>(1);

  // IST Time & Lock Simulation State
  const [simulatedDate, setSimulatedDate] = useState<Date | null>(null);
  const [demoBypass, setDemoBypass] = useState<boolean>(false);
  const [istStatus, setIstStatus] = useState(() => calculateISTStatus(null, false));

  // Network & PWA status
  const [isOnlineState, setIsOnlineState] = useState<boolean>(() => isOnline());
  const [showPWAInstallModal, setShowPWAInstallModal] = useState<boolean>(false);
  const [showPrerequisitesModal, setShowPrerequisitesModal] = useState<boolean>(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState<boolean>(false);
  const [mobileTab, setMobileTab] = useState<'syllabus' | 'aptitude'>('syllabus');

  // Modals
  const [activeAssessment, setActiveAssessment] = useState<{
    day: number;
    type: 'pre' | 'post';
  } | null>(null);
  const [showProctoredExam, setShowProctoredExam] = useState<boolean>(false);
  const [showCertificate, setShowCertificate] = useState<boolean>(false);
  const [showBadgeGallery, setShowBadgeGallery] = useState<boolean>(false);
  const [showLevelZeroModal, setShowLevelZeroModal] = useState<boolean>(false);

  // Online / offline listeners
  useEffect(() => {
    const handleOnline = () => setIsOnlineState(true);
    const handleOffline = () => setIsOnlineState(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

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
    setShowAuthModal(false);
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ffffff', '#a3a3a3', '#6366f1', '#f59e0b'],
    });
  };

  const handleSignOut = () => {
    setGoogleUser(null);
  };

  // Safe Action Guards for Auth-gated operations
  const requireAuth = (callback: () => void) => {
    if (!googleUser) {
      setShowAuthModal(true);
    } else {
      callback();
    }
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

  // Toggle Solved Program Learner Acknowledgement
  const handleToggleAcknowledgeProgram = (programId: string) => {
    setProgress((prev) => {
      const current = prev.acknowledgedSolvedProgramIds || [];
      const exists = current.includes(programId);
      const updated = exists
        ? current.filter((id) => id !== programId)
        : [...current, programId];
      return {
        ...prev,
        acknowledgedSolvedProgramIds: updated,
      };
    });
  };

  // Toggle Level 0 basic program completed acknowledgement
  const handleToggleLevelZeroProgram = (programId: string) => {
    setProgress((prev) => {
      const current = prev.levelZeroCompletedIds || [];
      const exists = current.includes(programId);
      const updated = exists
        ? current.filter((id) => id !== programId)
        : [...current, programId];
      return {
        ...prev,
        levelZeroCompletedIds: updated,
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

  // Filter topics for the active day (Part 1 and Part 2)
  const dayTopics = TOPICS.filter((t) => t.day === currentDay);

  // Check if current day is unlocked (Strict: Pre-test, Questions, 6 Solved Programs, Post-test & Badge)
  const dayLockState = isDayUnlockedStrict(currentDay, progress, istStatus, demoBypass);

  // Calculate Daily Feedback Window Status (2:30 PM - 3:30 PM IST with 30m, 10m, 5m reminders)
  const feedbackStatus = calculateFeedbackStatus(currentDay, progress, istStatus, demoBypass);

  // Automated notification dispatcher for 30m, 10m, 5m, and live window
  useEffect(() => {
    if (
      !progress.feedbackSubmitted?.[currentDay] &&
      (feedbackStatus.reminderStage === '30m' ||
        feedbackStatus.reminderStage === '10m' ||
        feedbackStatus.reminderStage === '5m' ||
        feedbackStatus.reminderStage === 'active')
    ) {
      if (!hasNotifiedStage(currentDay, feedbackStatus.reminderStage)) {
        markNotifiedStage(currentDay, feedbackStatus.reminderStage);
        sendDesktopNotification(
          `Placement Readiness: Day ${currentDay} Feedback Reminder`,
          feedbackStatus.reminderMessage
        );
      }
    }
  }, [
    currentDay,
    feedbackStatus.reminderStage,
    progress.feedbackSubmitted,
    feedbackStatus.reminderMessage,
  ]);

  // Acknowledge Daily Feedback Completion
  const handleAcknowledgeFeedback = (day: number) => {
    setProgress((prev) => {
      const submitted = { ...(prev.feedbackSubmitted || {}) };
      const timestamps = { ...(prev.feedbackSubmittedAt || {}) };
      submitted[day] = true;
      timestamps[day] = new Date().toISOString();
      return {
        ...prev,
        feedbackSubmitted: submitted,
        feedbackSubmittedAt: timestamps,
      };
    });
  };

  // Simulate IST Time for Testing Reminders (30m, 10m, 5m, active)
  const handleSimulateFeedbackTime = (hour: number, minute: number) => {
    const d = new Date();
    let utcHour = hour - 5;
    let utcMinute = minute - 30;
    if (utcMinute < 0) {
      utcMinute += 60;
      utcHour -= 1;
    }
    d.setUTCHours(utcHour, utcMinute, 0, 0);
    setSimulatedDate(d);
  };

  const handleResetSimulateFeedbackTime = () => {
    setSimulatedDate(null);
  };

  // Strict Final Exam Gatekeeper (Day 5 Proctored Exam requires 100% completion of Days 1 to 5)
  const handleOpenFinalExam = () => {
    requireAuth(() => {
      const eligibility = checkFinalExamEligibility(progress, demoBypass);
      if (!eligibility.isEligible) {
        setShowPrerequisitesModal(true);
      } else {
        setShowProctoredExam(true);
      }
    });
  };

  const totalQuestions = TOPICS.reduce((acc, t) => acc + t.questions.length, 0);
  const completedQuestions = progress.completedQuestionIds.length;
  const badgesEarned = Object.values(progress.badgesUnlocked).filter(Boolean).length;

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 selection:bg-indigo-500 selection:text-white pb-14 md:pb-0">
      {/* Daily Feedback Reminder Alert Banner (Active during 30m, 10m, 5m, and live window) */}
      <FeedbackReminderBanner
        status={feedbackStatus}
        onOpenModal={() => setShowFeedbackModal(true)}
        onRequestNotifications={requestNotificationPermission}
      />

      {/* 1. BEGIN WITH SPINNING WHEEL FOR 10 MCQS BONUS + NEGATIVE MARKS */}
      {showSpinningWheel && (
        <SpinningWheelModal
          onClose={() => setShowSpinningWheel(false)}
          onContinueToHome={() => setShowSpinningWheel(false)}
          onPromptLogin={() => {
            setShowSpinningWheel(false);
            setShowAuthModal(true);
          }}
        />
      )}

      {/* 2. GOOGLE AUTH MODAL (PROMPT WHEN USER REACHES GATED STEPS) */}
      {showAuthModal && (
        <GoogleAuthModal
          onSignIn={handleGoogleSignIn}
          onClose={() => setShowAuthModal(false)}
        />
      )}

      {/* 3. PROPER HEADER */}
      <Header
        user={googleUser}
        progress={progress}
        istStatus={istStatus}
        demoBypass={demoBypass}
        onToggleDemoBypass={() => setDemoBypass((prev) => !prev)}
        onSignOut={handleSignOut}
        onToggleLeftSidebar={() => setLeftSidebarMobileOpen((prev) => !prev)}
        onOpenBadges={() => setShowBadgeGallery(true)}
        onOpenCertificate={() => {
          requireAuth(() => setShowCertificate(true));
        }}
        onOpenIDE={() => setActiveIDEQuestion(dayTopics[0]?.questions[0] || TOPICS[0]?.questions[0] || null)}
        onOpenInterviewTips={() => setShowInterviewTips(true)}
        onOpenSpinningWheel={() => setShowSpinningWheel(true)}
        onOpenAptitude={() => {
          const el = document.getElementById('aptitude-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenLevelZero={() => setShowLevelZeroModal(true)}
        onPromptLogin={() => setShowAuthModal(true)}
        onOpenPWAInstall={() => setShowPWAInstallModal(true)}
        isOnline={isOnlineState}
        feedbackStatus={feedbackStatus}
        onOpenFeedback={() => setShowFeedbackModal(true)}
      />

      {/* 4. MAIN WORKSPACE CONTAINER WITH COLLAPSIBLE NAVY BLUE LEFT SIDEBAR */}
      <div className="flex-1 flex relative bg-white">
        {/* Left Navigation Bar (Navy Blue with Collapse/Expand and Draggable handle) */}
        <LeftSidebar
          currentDay={currentDay}
          onSelectDay={(day) => {
            if (day > 1 && !googleUser) {
              setShowAuthModal(true);
            } else {
              setCurrentDay(day);
            }
          }}
          progress={progress}
          istStatus={istStatus}
          demoBypass={demoBypass}
          isOpenMobile={leftSidebarMobileOpen}
          onCloseMobile={() => setLeftSidebarMobileOpen(false)}
          width={leftWidth}
          onWidthChange={setLeftWidth}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
          onOpenBadges={() => setShowBadgeGallery(true)}
          onOpenCertificate={() => {
            requireAuth(() => setShowCertificate(true));
          }}
          onOpenFinalExam={handleOpenFinalExam}
          onOpenInterviewTips={() => setShowInterviewTips(true)}
          onOpenIDE={() => setActiveIDEQuestion(dayTopics[0]?.questions[0] || TOPICS[0]?.questions[0] || null)}
          onOpenSpinningWheel={() => setShowSpinningWheel(true)}
          onOpenAptitude={() => {
            const el = document.getElementById('aptitude-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenLevelZero={() => setShowLevelZeroModal(true)}
          onOpenPWAInstall={() => setShowPWAInstallModal(true)}
          onOpenFeedback={() => setShowFeedbackModal(true)}
          feedbackStatus={feedbackStatus}
        />

        {/* Center Main Content Area */}
        <main
          style={{
            marginLeft: isSidebarCollapsed ? '76px' : `${leftWidth}px`,
          }}
          className="flex-1 p-4 md:p-8 transition-[margin] duration-200 ease-out max-lg:!ml-0 bg-white"
        >
          {/* Welcome Banner when in Guest / Unauthenticated Mode */}
          {!googleUser && (
            <div className="mb-6 p-4 md:p-5 rounded-3xl border border-indigo-200 bg-gradient-to-r from-indigo-50/90 via-purple-50/50 to-amber-50/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white font-black flex items-center justify-center text-lg shadow-xs shrink-0">
                  ★
                </div>
                <div>
                  <div className="text-sm font-black text-slate-900 rainbow-text">
                    Placement Readiness Diagnostic Mode
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    Spin the Wheel for 10 Bonus MCQs & practice the 25 Aptitude MCQs below. Then sign in with Google to save your placement score, unlock Days 2-5, and earn verified Badges.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start md:self-auto shrink-0 flex-wrap">
                <button
                  type="button"
                  onClick={() => setShowSpinningWheel(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-amber-300 bg-white hover:bg-amber-50 text-amber-900 text-xs font-bold transition-all shadow-2xs cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-600" />
                  <span>Spin Wheel</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-extrabold transition-all shadow-xs cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In with Google</span>
                </button>
              </div>
            </div>
          )}

          {/* HOME PAGE: 25 APTITUDE MCQS AND LINK WITH DSA PROBLEMS */}
          <div id="aptitude-section">
            <AptitudeSection
              onOpenIDEForQuestion={(q) => setActiveIDEQuestion(q)}
              onNavigateToDay={(day) => {
                setCurrentDay(day);
                const el = document.getElementById('curriculum-workspace-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          </div>

          {/* ALL THE CONTENT ALREADY SHOWN: 5-DAY CURRICULUM, 30 SOLVED PROGRAMS, ASSESSMENTS */}
          <div id="curriculum-workspace-section" className="pt-2">
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
                      className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:border-slate-300 cursor-pointer"
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
                  requireAuth(() =>
                    setActiveAssessment({ day: currentDay, type: 'pre' })
                  )
                }
                onOpenPostAssessment={() =>
                  requireAuth(() =>
                    setActiveAssessment({ day: currentDay, type: 'post' })
                  )
                }
                onOpenFinalExam={handleOpenFinalExam}
                onOpenCertificate={() => {
                  requireAuth(() => setShowCertificate(true));
                }}
                onOpenIDE={(q) => setActiveIDEQuestion(q)}
                onToggleAcknowledgeProgram={handleToggleAcknowledgeProgram}
                onOpenLevelZero={() => setShowLevelZeroModal(true)}
                onOpenFeedback={() => setShowFeedbackModal(true)}
                feedbackStatus={feedbackStatus}
              />
            )}
          </div>
        </main>
      </div>

      {/* 5. PROPER FOOTER */}
      <Footer
        completedCount={completedQuestions}
        totalQuestions={totalQuestions}
        badgesEarned={badgesEarned}
        onResetProgress={handleResetProgress}
      />

      {/* 6. MOBILE BOTTOM NAVIGATION BAR (Thumb ergonomics & offline status) */}
      <MobileBottomNav
        currentTab={mobileTab}
        onSelectTab={(tab) => {
          setMobileTab(tab);
          if (tab === 'aptitude') {
            const el = document.getElementById('aptitude-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          } else {
            const el = document.getElementById('curriculum-workspace-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        onOpenSpinningWheel={() => setShowSpinningWheel(true)}
        onOpenIDE={() => setActiveIDEQuestion(dayTopics[0]?.questions[0] || TOPICS[0]?.questions[0] || null)}
        onOpenBadges={() => setShowBadgeGallery(true)}
        isOnline={isOnlineState}
        onOpenFeedback={() => setShowFeedbackModal(true)}
        feedbackActive={feedbackStatus.isActive}
        feedbackFilled={feedbackStatus.isFilledToday}
      />

      {/* 7. MODALS & POPUPS */}
      {/* In-Browser IDE Workspace (Dark Theme, 6 Languages, Hidden Test Cases) */}
      {activeIDEQuestion && (
        <IDEWorkspace
          question={activeIDEQuestion}
          onClose={() => setActiveIDEQuestion(null)}
          onMarkSolved={() => handleToggleQuestion(activeIDEQuestion.id)}
        />
      )}

      {/* Kapil's Placement Interview Playbook Modal (Dark Theme) */}
      {showInterviewTips && (
        <InterviewTipsModal onClose={() => setShowInterviewTips(false)} />
      )}

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
          user={googleUser}
          progress={progress}
          onClose={() => setShowBadgeGallery(false)}
        />
      )}

      {/* Strict Prerequisites Checklist Modal for Final Exam */}
      {showPrerequisitesModal && (
        <PrerequisitesModal
          eligibility={checkFinalExamEligibility(progress, demoBypass)}
          onNavigateToDay={(day) => {
            setCurrentDay(day);
            setShowPrerequisitesModal(false);
            const el = document.getElementById('curriculum-workspace-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          onEnableBypass={() => {
            setDemoBypass(true);
            setShowPrerequisitesModal(false);
          }}
          onClose={() => setShowPrerequisitesModal(false)}
        />
      )}

      {/* Progressive Web App (PWA) Offline Install Modal */}
      {showPWAInstallModal && (
        <PWAInstallModal onClose={() => setShowPWAInstallModal(false)} />
      )}

      {/* Daily Workshop Feedback Modal (Active 2:30 PM - 3:30 PM IST) */}
      {showFeedbackModal && (
        <DailyFeedbackModal
          day={currentDay}
          status={feedbackStatus}
          progress={progress}
          onAcknowledgeFeedback={handleAcknowledgeFeedback}
          onClose={() => setShowFeedbackModal(false)}
          onSimulateTime={handleSimulateFeedbackTime}
          onResetSimulatedTime={handleResetSimulateFeedbackTime}
          isSimulated={simulatedDate !== null}
        />
      )}

      {/* LEVEL 0: 10 Solved Basic Programs Modal */}
      <LevelZeroModal
        isOpen={showLevelZeroModal}
        onClose={() => setShowLevelZeroModal(false)}
        completedIds={progress.levelZeroCompletedIds || []}
        onToggleComplete={handleToggleLevelZeroProgram}
        onOpenIDE={(q) => setActiveIDEQuestion(q)}
      />
    </div>
  );
}
export default App;
