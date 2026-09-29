import React, { useState, useEffect } from 'react';
import { getDailyFinalAssessment, DAY_FINAL_ASSESSMENT_INFO } from '../data/dailyFinalAssessments';
import { ProctorLog } from '../types';
import {
  ShieldAlert,
  ShieldCheck,
  Maximize2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Activity,
  X,
  Lock,
  Check,
  Brain,
  Code2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ProctoredExamModalProps {
  day?: number;
  userName: string;
  onComplete: (scorePercentage: number, passed: boolean) => void;
  onClose: () => void;
}

export const ProctoredExamModal: React.FC<ProctoredExamModalProps> = ({
  day = 1,
  userName,
  onComplete,
  onClose,
}) => {
  const examDay = day;
  const questions = getDailyFinalAssessment(examDay);
  const examInfo = DAY_FINAL_ASSESSMENT_INFO[examDay] || {
    title: `Day ${examDay} Proctored Final Assessment`,
    syllabus: `Day ${examDay} Syllabus & Practice Questions`,
    aptitudeCount: 10,
    dsaCount: 15,
  };

  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(30 * 60); // 30 minutes duration
  const [violations, setViolations] = useState<number>(0);
  const [proctorLogs, setProctorLogs] = useState<ProctorLog[]>([]);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  const addLog = (message: string, severity: 'info' | 'warning' | 'critical') => {
    const timestamp = new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' });
    setProctorLogs((prev) => [{ timestamp, message, severity }, ...prev.slice(0, 15)]);
  };

  const handleViolation = (reason: string) => {
    setViolations((v) => {
      const updated = v + 1;
      addLog(`VIOLATION #${updated}: ${reason}`, 'warning');
      setWarningMessage(`Proctor Alert: ${reason}. (Strike ${updated}/3)`);
      setTimeout(() => setWarningMessage(null), 4000);
      return updated;
    });
  };

  // Initialize security listeners & 30-min countdown timer once started (No camera required)
  useEffect(() => {
    if (!hasStarted || isSubmitted) return;

    addLog('Browser Integrity Proctor engaged. No camera hardware required.', 'info');
    addLog(`30-minute timer initiated for Day ${examDay} Final Assessment (25 MCQs).`, 'info');

    // Request fullscreen
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {
        addLog('Fullscreen automatic trigger bypassed by browser security policy.', 'info');
      });
    }

    // Visibility change / tab switch listener
    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleViolation('Tab switch or window minimized detected');
      }
    };

    const handleWindowBlur = () => {
      handleViolation('Lost application focus or opened secondary window');
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        handleViolation('Exited secure fullscreen testing viewport');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    // Timer countdown (30 Minutes strict)
    const timerInterval = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timerInterval);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      clearInterval(timerInterval);
    };
  }, [hasStarted, isSubmitted]);

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [qIdx]: optIdx,
    }));
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / questions.length) * 100);
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    const score = calculateScore();
    const passed = score >= 70 && violations <= 4;

    if (passed) {
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'],
      });
    }

    onComplete(score, passed);
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const score = isSubmitted ? calculateScore() : 0;
  const passed = score >= 70 && violations <= 4;
  const answeredCount = Object.keys(selectedAnswers).length;

  // LOBBY / PRE-EXAM BRIEFING
  if (!hasStarted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="relative w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 md:p-8 text-slate-800 shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white font-black flex items-center justify-center text-2xl mx-auto mb-3 shadow-md">
              D{examDay}
            </div>
            <h2 className="text-2xl md:text-3xl font-black rainbow-text">
              Day {examDay} Proctored Final Assessment
            </h2>
            <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-extrabold">
              25 Questions • 10 Aptitude + 15 DSA • 30-Minute Timer
            </p>
          </div>

          <div className="space-y-4 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-5 mb-6 text-xs text-slate-700">
            <div className="font-extrabold text-slate-900 flex items-center gap-2 text-sm rainbow-text">
              <ShieldAlert className="w-4 h-4 text-indigo-600" />
              <span>Assessment & Proctoring Guidelines</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-indigo-100 text-[11px] text-slate-600">
              <span className="font-bold text-indigo-900">Syllabus Scope: </span>
              {examInfo.syllabus}
            </div>
            <ul className="space-y-2 list-disc list-inside text-slate-600 font-medium">
              <li>
                <strong className="text-slate-900">25 Unique MCQs:</strong> 10 Quantitative/Logical Aptitude + 15 Data Structures & Algorithms tailored strictly to Day {examDay}.
              </li>
              <li>
                <strong className="text-slate-900">30-Minute Duration:</strong> Strict timer countdown with automatic submission upon expiry.
              </li>
              <li>
                <strong className="text-slate-900">70% Passing Threshold:</strong> Score at least 18/25 (70%) to qualify and earn credentials.
              </li>
              <li>
                <strong className="text-slate-900">No Camera Required:</strong> Pure browser integrity proctoring (fullscreen sentry, window focus blur detection, and tab-switch monitoring).
              </li>
              <li>
                <strong className="text-slate-900">Candidate Identity:</strong> Verified under your Google account ({userName}).
              </li>
            </ul>
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900 text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                setHasStarted(true);
                addLog('Candidate initialized proctored exam session.', 'info');
              }}
              className="flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-black text-sm hover:opacity-90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Maximize2 className="w-4 h-4 text-white" />
              <span>Enter Fullscreen & Begin Assessment</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ACTIVE EXAM OR REVIEW VIEW
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-white text-slate-800 overflow-hidden select-none"
      onCopy={(e) => {
        e.preventDefault();
        handleViolation('Clipboard copy blocked by proctor');
      }}
      onPaste={(e) => {
        e.preventDefault();
        handleViolation('Clipboard paste blocked by proctor');
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        handleViolation('Context menu click blocked by proctor');
      }}
    >
      {/* Top Proctoring Bar */}
      <div className="h-16 border-b border-slate-200 bg-slate-50 px-4 flex items-center justify-between shrink-0 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-black text-sm uppercase tracking-wider rainbow-text">
              PROCTOR ACTIVE
            </span>
            <span className="hidden md:inline px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-mono font-bold">
              Day {examDay} • 25 MCQs
            </span>
          </div>
          <span className="hidden sm:inline text-xs text-slate-500 border-l border-slate-200 pl-3">
            Candidate: <strong className="text-slate-800 font-bold">{userName}</strong>
          </span>
        </div>

        {/* Center Countdown Timer (30 Mins) */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-mono text-sm text-slate-800 shadow-2xs">
          <Clock className="w-4 h-4 text-indigo-600" />
          <span
            className={
              timeLeftSeconds < 300
                ? 'text-rose-600 font-black animate-pulse'
                : 'font-bold'
            }
          >
            {formatTimer(timeLeftSeconds)}
          </span>
        </div>

        {/* Violations Counter & Actions */}
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border text-xs font-mono font-bold ${
              violations > 0
                ? 'border-rose-200 bg-rose-50 text-rose-800'
                : 'border-slate-200 bg-white text-slate-600'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            <span>Strikes: {violations}/3</span>
          </div>

          {!isSubmitted && (
            <button
              type="button"
              onClick={handleSubmit}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs hover:opacity-90 transition-all cursor-pointer shadow-xs"
            >
              Finish Exam
            </button>
          )}
        </div>
      </div>

      {/* Real-time Warning Flash */}
      {warningMessage && (
        <div className="bg-rose-50 border-b border-rose-200 text-rose-800 px-4 py-2 text-xs font-extrabold flex items-center justify-center gap-2 animate-bounce">
          <AlertTriangle className="w-4 h-4" />
          <span>{warningMessage}</span>
        </div>
      )}

      {/* Main Split Layout: Exam Questions + Proctor Telemetry Sidecar */}
      <div className="flex-1 flex overflow-hidden bg-white">
        {/* Left: Questions Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 max-w-4xl mx-auto space-y-6">
          {/* Results Summary if isSubmitted */}
          {isSubmitted ? (
            <div className="space-y-6">
              <div
                className={`p-8 rounded-3xl border text-center space-y-3 ${
                  passed
                    ? 'border-emerald-200 bg-emerald-50/70 text-slate-800'
                    : 'border-rose-200 bg-rose-50/70 text-slate-800'
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto ${
                    passed ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                  }`}
                >
                  {passed ? <CheckCircle2 className="w-8 h-8" /> : <X className="w-8 h-8" />}
                </div>
                <h3 className="text-2xl font-black rainbow-text">
                  {passed
                    ? `Day ${examDay} Proctored Assessment Cleared!`
                    : `Day ${examDay} Assessment Not Cleared`}
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed font-medium">
                  {passed
                    ? `Congratulations ${userName}! You scored ${score}% (${Math.round(
                        (score / 100) * questions.length
                      )}/${questions.length} correct) under proctored integrity. Your Day ${examDay} assessment record is updated.`
                    : `Score: ${score}% (${Math.round(
                        (score / 100) * questions.length
                      )}/${questions.length} correct). Minimum required is 70% with <= 3 strikes. Review the solutions below and retry.`}
                </p>
                <div className="pt-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-extrabold text-xs hover:opacity-90 transition-all shadow-md cursor-pointer"
                  >
                    Close & Return to Dashboard
                  </button>
                </div>
              </div>

              {/* Review all 25 questions */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-extrabold uppercase tracking-wider rainbow-text">
                    Comprehensive Review (All 25 Questions)
                  </h4>
                  <span className="text-xs text-slate-500 font-mono">
                    {Math.round((score / 100) * questions.length)} / {questions.length} Correct
                  </span>
                </div>

                {questions.map((q, idx) => {
                  const isCorrect = selectedAnswers[idx] === q.correctAnswer;
                  const isAptitude = idx < 10;
                  return (
                    <div
                      key={q.id}
                      className={`p-5 rounded-2xl border space-y-2 text-xs ${
                        isCorrect
                          ? 'border-emerald-200 bg-emerald-50/40'
                          : 'border-slate-200 bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between text-slate-500 text-[11px] font-bold">
                        <span className="flex items-center gap-1.5">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                              isAptitude ? 'bg-amber-100 text-amber-800' : 'bg-indigo-100 text-indigo-800'
                            }`}
                          >
                            {isAptitude ? 'Aptitude' : 'DSA'}
                          </span>
                          <span>Question {idx + 1} • {q.topicTag}</span>
                        </span>
                        <span className={isCorrect ? 'text-emerald-700 font-bold' : 'text-rose-600 font-bold'}>
                          {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                        </span>
                      </div>
                      <div className="font-bold text-slate-900 text-sm">{q.question}</div>
                      <div className="text-slate-600 pt-1">
                        <strong className="text-slate-900">Your Answer: </strong>
                        {selectedAnswers[idx] !== undefined
                          ? q.options[selectedAnswers[idx]]
                          : 'Not Attempted'}
                      </div>
                      {!isCorrect && (
                        <div className="text-emerald-700">
                          <strong>Correct Answer: </strong>
                          {q.options[q.correctAnswer]}
                        </div>
                      )}
                      <div className="text-slate-600 pt-1 border-t border-slate-200 mt-2">
                        <strong className="text-slate-900">Explanation: </strong> {q.explanation}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            // Active Question Engine
            <div className="space-y-6">
              {/* Question 1-25 Navigator Palette */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                  <span className="flex items-center gap-2">
                    <span className="text-indigo-600">Question Navigator (1 to 25)</span>
                    <span className="text-slate-400">• Click to jump</span>
                  </span>
                  <span>
                    Answered: <strong className="text-emerald-600">{answeredCount}</strong> / {questions.length}
                  </span>
                </div>

                <div className="grid grid-cols-5 sm:grid-cols-10 md:grid-cols-13 lg:grid-cols-25 gap-1.5">
                  {questions.map((q, idx) => {
                    const isAnswered = selectedAnswers[idx] !== undefined;
                    const isCurrent = currentIdx === idx;
                    const isApt = idx < 10;
                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => setCurrentIdx(idx)}
                        className={`h-8 rounded-lg font-mono text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${
                          isCurrent
                            ? 'bg-indigo-600 text-white ring-2 ring-indigo-400 shadow-xs'
                            : isAnswered
                            ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                            : isApt
                            ? 'bg-white text-slate-700 border border-amber-200 hover:bg-amber-50'
                            : 'bg-white text-slate-700 border border-indigo-200 hover:bg-indigo-50'
                        }`}
                        title={`Q${idx + 1}: ${isApt ? 'Aptitude' : 'DSA'} (${isAnswered ? 'Answered' : 'Pending'})`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-4 text-[10px] text-slate-500 pt-1 font-medium">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded bg-emerald-500" /> Answered
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded bg-indigo-600" /> Current
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded border border-amber-300 bg-white" /> Aptitude (1-10)
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded border border-indigo-300 bg-white" /> DSA (11-25)
                  </span>
                </div>
              </div>

              {/* Question Body Card */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 space-y-4 shadow-sm">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        currentIdx < 10
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}
                    >
                      {currentIdx < 10 ? 'Part A: Aptitude' : 'Part B: DSA'}
                    </span>
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
                      Question {currentIdx + 1} of {questions.length}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-slate-500">
                    {questions[currentIdx].topicTag}
                  </span>
                </div>

                <h3 className="text-base md:text-lg font-bold text-slate-900 leading-relaxed">
                  {questions[currentIdx].question}
                </h3>

                {/* Options List */}
                <div className="space-y-2.5 pt-2">
                  {questions[currentIdx].options.map((opt, optIdx) => {
                    const isSelected = selectedAnswers[currentIdx] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectOption(currentIdx, optIdx)}
                        className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer ${
                          isSelected
                            ? 'border-indigo-500 bg-indigo-50/70 text-indigo-950 font-bold ring-2 ring-indigo-300 shadow-2xs'
                            : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 text-slate-700'
                        }`}
                      >
                        <span
                          className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5 ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-600 text-white'
                              : 'border-slate-300 text-slate-500 bg-white'
                          }`}
                        >
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="text-xs md:text-sm leading-snug">{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentIdx((p) => Math.max(0, p - 1))}
                  disabled={currentIdx === 0}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 disabled:opacity-40 text-xs font-bold cursor-pointer"
                >
                  ← Previous
                </button>
                <div className="text-xs text-slate-500 font-medium">
                  {answeredCount} of {questions.length} Questions Answered
                </div>
                {currentIdx < questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentIdx((p) => Math.min(questions.length - 1, p + 1))}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs hover:opacity-90 transition-all shadow-xs cursor-pointer"
                  >
                    Next →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs hover:opacity-90 transition-all shadow-md cursor-pointer"
                  >
                    Submit 25-MCQ Assessment
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right: Proctor Telemetry Sidecar (No Camera Needed) */}
        <div className="hidden lg:flex w-80 border-l border-slate-200 bg-slate-50 flex-col p-4 space-y-4 shrink-0">
          <div className="space-y-1">
            <span className="text-xs font-black uppercase tracking-wider rainbow-text flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Browser Integrity Proctor</span>
            </span>
            <span className="text-[10px] text-slate-500 font-medium">
              Hardware Camera: Not Required (AI Browser Sentry Active)
            </span>
          </div>

          {/* Sentry Status Panel */}
          <div className="rounded-2xl border border-slate-200 bg-white p-3.5 space-y-2.5 shadow-2xs">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-semibold">Fullscreen Mode:</span>
              <span className="text-emerald-700 font-mono font-bold flex items-center gap-1">
                <Check className="w-3 h-3" /> Enforced
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-semibold">Tab Switch Sentry:</span>
              <span className="text-emerald-700 font-mono font-bold flex items-center gap-1">
                <Check className="w-3 h-3" /> Active
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-semibold">Clipboard Shield:</span>
              <span className="text-emerald-700 font-mono font-bold flex items-center gap-1">
                <Check className="w-3 h-3" /> Protected
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-semibold">Timer Duration:</span>
              <span className="text-indigo-700 font-mono font-bold">30 Minutes</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-semibold">Passing Threshold:</span>
              <span className="text-indigo-700 font-mono font-bold">70% (18/25)</span>
            </div>
          </div>

          {/* Candidate Info Card */}
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-3 space-y-1">
            <div className="text-[10px] font-mono text-indigo-700 uppercase font-bold">
              Verified Candidate
            </div>
            <div className="text-xs font-bold text-slate-900 truncate">{userName}</div>
            <div className="text-[10px] text-slate-500">
              Exam: Day {examDay} Final Assessment (25 MCQs)
            </div>
          </div>

          {/* Audit Telemetry Stream */}
          <div className="flex-1 flex flex-col min-h-0 space-y-2 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-extrabold text-slate-900 flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-indigo-600" />
                Audit Telemetry
              </span>
              <span className="font-mono text-[10px] font-bold text-emerald-600">Active</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1.5 font-mono text-[10px] text-slate-600 pr-1">
              {proctorLogs.map((log, i) => (
                <div
                  key={i}
                  className={`p-2 rounded-xl border ${
                    log.severity === 'warning'
                      ? 'border-amber-200 bg-amber-50 text-amber-900'
                      : 'border-slate-200 bg-white text-slate-600'
                  }`}
                >
                  <span className="text-slate-400 mr-1">[{log.timestamp}]</span>
                  <span>{log.message}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
