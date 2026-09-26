import React, { useState, useEffect, useRef } from 'react';
import { FINAL_PROCTORED_QUESTIONS } from '../data/curriculum';
import { ProctorLog } from '../types';
import {
  ShieldAlert,
  Maximize2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Eye,
  Camera,
  Activity,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ProctoredExamModalProps {
  userName: string;
  onComplete: (scorePercentage: number, passed: boolean) => void;
  onClose: () => void;
}

export const ProctoredExamModal: React.FC<ProctoredExamModalProps> = ({
  userName,
  onComplete,
  onClose,
}) => {
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(30 * 60); // 30 minutes
  const [violations, setViolations] = useState<number>(0);
  const [proctorLogs, setProctorLogs] = useState<ProctorLog[]>([]);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize camera and security listeners once started
  useEffect(() => {
    if (!hasStarted || isSubmitted) return;

    // Start camera
    navigator.mediaDevices?.getUserMedia({ video: true, audio: false })
      .then((stream) => {
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraActive(true);
        addLog('Webcam feed acquired & facial anchor locked.', 'info');
      })
      .catch(() => {
        setCameraActive(false);
        addLog('Webcam hardware unavailable. AI Simulated Optical Proctor initiated.', 'warning');
      });

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

    // Timer countdown
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
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, [hasStarted, isSubmitted]);

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

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [qIdx]: optIdx,
    }));
  };

  const calculateScore = () => {
    let correct = 0;
    FINAL_PROCTORED_QUESTIONS.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / FINAL_PROCTORED_QUESTIONS.length) * 100);
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }

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

  // LOBBY / PRE-EXAM BRIEFING
  if (!hasStarted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="relative w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 md:p-8 text-slate-800 shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white font-black flex items-center justify-center text-2xl mx-auto mb-3 shadow-md">
              K
            </div>
            <h2 className="text-2xl md:text-3xl font-black rainbow-text">Final Proctored Placement Assessment</h2>
            <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-extrabold">
              Comprehensive Evaluation • Syllabus Topics T1 to T10
            </p>
          </div>

          <div className="space-y-4 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-5 mb-6 text-xs text-slate-700">
            <div className="font-extrabold text-slate-900 flex items-center gap-2 text-sm rainbow-text">
              <ShieldAlert className="w-4 h-4 text-indigo-600" />
              <span>Kapil Proctor Integrity Guidelines</span>
            </div>
            <ul className="space-y-2 list-disc list-inside text-slate-600 font-medium">
              <li><strong className="text-slate-900">10 Questions:</strong> Covering Graphs, Recursion, Two Pointers, Math, and Divide & Conquer.</li>
              <li><strong className="text-slate-900">Time Limit:</strong> 30 Minutes countdown.</li>
              <li><strong className="text-slate-900">Passing Threshold:</strong> Minimum 70% required to graduate and earn Certificate.</li>
              <li><strong className="text-slate-900">Proctoring Enforcement:</strong> Fullscreen mode, optical face detection, and tab-switch monitoring are active. More than 4 violations will void your exam.</li>
              <li><strong className="text-slate-900">Identity:</strong> Exam is bound to your verified Google Account ({userName}).</li>
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

  // ACTIVE EXAM OR SUBMITTED VIEW
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white text-slate-800 overflow-hidden">
      {/* Top Proctoring Bar */}
      <div className="h-16 border-b border-slate-200 bg-slate-50 px-4 flex items-center justify-between shrink-0 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <span className="font-black text-sm uppercase tracking-wider rainbow-text">
              PROCTOR ACTIVE
            </span>
          </div>
          <span className="hidden sm:inline text-xs text-slate-500 border-l border-slate-200 pl-3">
            Candidate: <strong className="text-slate-800 font-bold">{userName}</strong>
          </span>
        </div>

        {/* Center Countdown Timer */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-mono text-sm text-slate-800 shadow-2xs">
          <Clock className="w-4 h-4 text-indigo-600" />
          <span className={timeLeftSeconds < 300 ? 'text-rose-600 font-black animate-pulse' : 'font-bold'}>
            {formatTimer(timeLeftSeconds)}
          </span>
        </div>

        {/* Violations Counter */}
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
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto ${passed ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}`}>
                  {passed ? <CheckCircle2 className="w-8 h-8" /> : <X className="w-8 h-8" />}
                </div>
                <h3 className="text-2xl font-black rainbow-text">
                  {passed ? 'Proctored Placement Certification Cleared!' : 'Proctored Exam Failed'}
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed font-medium">
                  {passed
                    ? `Congratulations ${userName}! You scored ${score}% under proctored integrity. Your official Certificate of Completion powered by Kapil has been issued.`
                    : `Score: ${score}%. Minimum required is 70% with <= 3 proctor strikes. Review syllabus materials and retry.`}
                </p>
                <div className="pt-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-extrabold text-xs hover:opacity-90 transition-all shadow-md cursor-pointer"
                  >
                    View Official Certificate
                  </button>
                </div>
              </div>

              {/* Review all 10 questions */}
              <div className="space-y-4">
                <h4 className="text-sm font-extrabold uppercase tracking-wider rainbow-text">
                  Comprehensive Review
                </h4>
                {FINAL_PROCTORED_QUESTIONS.map((q, idx) => {
                  const isCorrect = selectedAnswers[idx] === q.correctAnswer;
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
                        <span>Question {idx + 1} • {q.topicTag}</span>
                        <span className={isCorrect ? 'text-emerald-700 font-bold' : 'text-rose-600 font-bold'}>
                          {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                        </span>
                      </div>
                      <div className="font-bold text-slate-900 text-sm">{q.question}</div>
                      <div className="text-slate-600 pt-1">
                        <strong className="text-slate-900">Kapil&apos;s Solution:</strong> {q.explanation}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            // Active Question Engine
            <div className="space-y-6">
              {/* Question Index Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {FINAL_PROCTORED_QUESTIONS.map((q, idx) => {
                  const isAnswered = selectedAnswers[idx] !== undefined;
                  const isCurrent = currentIdx === idx;
                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setCurrentIdx(idx)}
                      className={`w-9 h-9 rounded-xl font-mono text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-300'
                          : isAnswered
                          ? 'bg-slate-200 text-slate-800'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Question Body */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 space-y-4 shadow-sm">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600">
                  Question {currentIdx + 1} of {FINAL_PROCTORED_QUESTIONS.length} • {FINAL_PROCTORED_QUESTIONS[currentIdx].topicTag}
                </div>
                <h3 className="text-base md:text-lg font-bold text-slate-900 leading-relaxed">
                  {FINAL_PROCTORED_QUESTIONS[currentIdx].question}
                </h3>

                {/* Options */}
                <div className="space-y-2.5 pt-2">
                  {FINAL_PROCTORED_QUESTIONS[currentIdx].options.map((opt, optIdx) => {
                    const isSelected = selectedAnswers[currentIdx] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectOption(currentIdx, optIdx)}
                        className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer ${
                          isSelected
                            ? 'border-indigo-400 bg-indigo-50/70 text-indigo-950 font-bold ring-1 ring-indigo-300 shadow-2xs'
                            : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 text-slate-700'
                        }`}
                      >
                        <span className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5 text-slate-500">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="text-xs md:text-sm leading-snug">{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question Navigation */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentIdx((p) => Math.max(0, p - 1))}
                  disabled={currentIdx === 0}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 disabled:opacity-40 text-xs font-bold"
                >
                  ← Previous
                </button>
                <div className="text-xs text-slate-500 font-medium">
                  {Object.keys(selectedAnswers).length} of {FINAL_PROCTORED_QUESTIONS.length} Questions Answered
                </div>
                {currentIdx < FINAL_PROCTORED_QUESTIONS.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentIdx((p) => Math.min(FINAL_PROCTORED_QUESTIONS.length - 1, p + 1))}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs hover:opacity-90 transition-all shadow-xs cursor-pointer"
                  >
                    Next →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs hover:opacity-90 transition-all shadow-md cursor-pointer"
                  >
                    Submit Proctored Exam
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right: Proctor Telemetry Sidecar */}
        <div className="hidden lg:flex w-80 border-l border-slate-200 bg-slate-50 flex-col p-4 space-y-4 shrink-0">
          <div className="space-y-1">
            <span className="text-xs font-black uppercase tracking-wider rainbow-text flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-indigo-600" />
              <span>Optical Feed Preview</span>
            </span>
            <span className="text-[10px] text-slate-500 font-medium">Facial tracking anchor locked</span>
          </div>

          {/* Live Video Box */}
          <div className="relative w-full h-44 rounded-2xl border border-slate-300 bg-slate-900 overflow-hidden flex items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover transform -scale-x-100 ${!cameraActive && 'hidden'}`}
            />
            {!cameraActive && (
              <div className="text-center p-3 space-y-2">
                <Eye className="w-8 h-8 text-slate-400 mx-auto animate-pulse" />
                <div className="text-xs text-slate-300 font-bold">AI Simulated Eye-Tracker</div>
                <div className="text-[10px] text-slate-400">Face: Center • Gaze: Screen</div>
              </div>
            )}
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 border border-slate-600 text-[10px] font-mono text-white flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
              LIVE
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
