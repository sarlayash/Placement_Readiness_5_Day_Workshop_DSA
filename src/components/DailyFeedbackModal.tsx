import React, { useState } from 'react';
import { UserProgress, FeedbackWindowStatus } from '../types';
import {
  FEEDBACK_URL,
  formatFeedbackTimer,
  requestNotificationPermission,
  sendDesktopNotification,
} from '../utils/feedback';
import {
  MessageSquare,
  Clock,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Bell,
  X,
  Volume2,
  Calendar,
  Sparkles,
  RefreshCw,
  Check,
  Copy,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DailyFeedbackModalProps {
  day: number;
  status: FeedbackWindowStatus;
  progress: UserProgress;
  onAcknowledgeFeedback: (day: number) => void;
  onClose: () => void;
  onSimulateTime?: (hour: number, minute: number) => void;
  onResetSimulatedTime?: () => void;
  isSimulated?: boolean;
}

export const DailyFeedbackModal: React.FC<DailyFeedbackModalProps> = ({
  day,
  status,
  progress,
  onAcknowledgeFeedback,
  onClose,
  onSimulateTime,
  onResetSimulatedTime,
  isSimulated = false,
}) => {
  const isFilled = !!(progress.feedbackSubmitted && progress.feedbackSubmitted[day]);
  const submittedAt = progress.feedbackSubmittedAt && progress.feedbackSubmittedAt[day];
  const [copied, setCopied] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState<string | null>(null);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(FEEDBACK_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmSubmit = () => {
    onAcknowledgeFeedback(day);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'],
    });
  };

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      setNotificationStatus('Browser notifications enabled! You will receive 30m, 10m, and 5m reminders.');
      sendDesktopNotification(
        'Placement Readiness - Notifications Active',
        `Reminders enabled for Day ${day} Daily Feedback (2:30 PM - 3:30 PM IST).`
      );
    } else {
      setNotificationStatus('Notifications were not granted by browser settings.');
    }
    setTimeout(() => setNotificationStatus(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-3 md:p-6 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-5 md:p-8 text-slate-800 shadow-2xl my-6 overflow-hidden">
        {/* Top Gradient Header Accent */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl md:text-2xl font-black text-slate-900 rainbow-text">
                  Daily Workshop Feedback
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-indigo-100 text-indigo-800 border border-indigo-200">
                  Day {day}
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                Powered by Kapil • Daily Quality & Mentorship Evaluation
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Active Window & Reminder Schedule Card */}
        <div className="mt-5 space-y-4">
          <div className="p-4 rounded-2xl border border-indigo-100 bg-indigo-50/60 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Daily Activation Window: 2:30 PM – 3:30 PM IST
                </span>
              </div>

              {/* Status Badge */}
              {isFilled ? (
                <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Day {day} Submitted</span>
                </span>
              ) : status.isActive ? (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-rose-600" />
                  <span>LIVE NOW • Closes in {formatFeedbackTimer(status.timeRemainingSec)}</span>
                </span>
              ) : status.reminderStage === 'closed' ? (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-200 text-slate-700">
                  Window Closed Today
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                  Opens at 2:30 PM ({formatFeedbackTimer(status.timeUntilOpenSec)})
                </span>
              )}
            </div>

            {/* Reminder Timeline Steps */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center">
              <div
                className={`p-2 rounded-xl border text-[11px] font-medium ${
                  status.reminderStage === '30m'
                    ? 'border-amber-400 bg-amber-100/80 text-amber-900 font-bold'
                    : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                <div className="font-extrabold text-xs">2:00 PM</div>
                <div>30 Min Reminder</div>
              </div>

              <div
                className={`p-2 rounded-xl border text-[11px] font-medium ${
                  status.reminderStage === '10m'
                    ? 'border-amber-400 bg-amber-100/80 text-amber-900 font-bold'
                    : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                <div className="font-extrabold text-xs">2:20 PM</div>
                <div>10 Min Reminder</div>
              </div>

              <div
                className={`p-2 rounded-xl border text-[11px] font-medium ${
                  status.reminderStage === '5m'
                    ? 'border-orange-400 bg-orange-100/80 text-orange-900 font-bold'
                    : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                <div className="font-extrabold text-xs">2:25 PM</div>
                <div>5 Min Reminder</div>
              </div>

              <div
                className={`p-2 rounded-xl border text-[11px] font-medium ${
                  status.isActive
                    ? 'border-emerald-500 bg-emerald-100/90 text-emerald-900 font-bold'
                    : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                <div className="font-extrabold text-xs">2:30 – 3:30 PM</div>
                <div>Form Active</div>
              </div>
            </div>
          </div>

          {/* Official Feedback Link Display */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Official Feedback Link (Identical for Days 1 to 5)
              </span>
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied Link' : 'Copy Link'}</span>
              </button>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-200 font-mono text-xs text-slate-800 break-all select-all flex items-center justify-between gap-2 shadow-2xs">
              <span>{FEEDBACK_URL}</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>Important Instruction:</strong> While the feedback URL remains the same throughout the 5 days, your feedback submission is uniquely recorded and reviewed per day. Please fill out your honest feedback for <strong>Day {day}</strong> regarding syllabus pace, concept clarity, and interview readiness.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href={FEEDBACK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold text-xs transition-all shadow-xs cursor-pointer"
              >
                <span>Open Feedback Form in New Tab</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={handleEnableNotifications}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Enable Desktop Reminders</span>
              </button>
            </div>

            {notificationStatus && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
                {notificationStatus}
              </div>
            )}
          </div>

          {/* Acknowledgement / Mark Completed Checkpoint */}
          <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/60 space-y-3">
            <div className="flex items-center gap-2 text-emerald-950 font-bold text-xs uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Learner Completion Acknowledgement</span>
            </div>

            {isFilled ? (
              <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-emerald-300 shadow-2xs">
                <div>
                  <div className="text-xs font-extrabold text-emerald-900 flex items-center gap-1.5">
                    <span>✓ Day {day} Feedback Recorded!</span>
                  </div>
                  {submittedAt && (
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Submitted on: {new Date(submittedAt).toLocaleTimeString()} IST ({new Date(submittedAt).toLocaleDateString()})
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleConfirmSubmit}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Update / Re-confirm
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-slate-700 leading-relaxed">
                  After you submit your response on <strong>fpln.site</strong>, click below to mark your Day {day} feedback as completed in your placement workshop portfolio.
                </p>

                <button
                  type="button"
                  onClick={handleConfirmSubmit}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-all shadow-xs cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>I Have Submitted Day {day} Feedback on fpln.site</span>
                </button>
              </div>
            )}
          </div>

          {/* Instructor & Evaluator Testing Simulation Controls */}
          {onSimulateTime && (
            <div className="p-3.5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 space-y-2 text-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Instructor & Tester Simulation Toolbar</span>
                </span>
                {isSimulated && (
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold border border-amber-300">
                    Simulation Active
                  </span>
                )}
              </div>

              <p className="text-[11px] text-slate-500 leading-tight">
                Simulate any reminder or activation point without waiting for the live clock:
              </p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => onSimulateTime(14, 0)}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-[11px] font-bold cursor-pointer shadow-2xs"
                >
                  Simulate 2:00 PM (30m reminder)
                </button>

                <button
                  type="button"
                  onClick={() => onSimulateTime(14, 20)}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-[11px] font-bold cursor-pointer shadow-2xs"
                >
                  Simulate 2:20 PM (10m reminder)
                </button>

                <button
                  type="button"
                  onClick={() => onSimulateTime(14, 25)}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-[11px] font-bold cursor-pointer shadow-2xs"
                >
                  Simulate 2:25 PM (5m reminder)
                </button>

                <button
                  type="button"
                  onClick={() => onSimulateTime(14, 45)}
                  className="px-2.5 py-1 rounded-lg bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-50 text-[11px] font-bold cursor-pointer shadow-2xs"
                >
                  Simulate 2:45 PM (Active Window)
                </button>

                <button
                  type="button"
                  onClick={() => onSimulateTime(16, 0)}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-[11px] font-bold cursor-pointer shadow-2xs"
                >
                  Simulate 4:00 PM (Closed)
                </button>

                {onResetSimulatedTime && (
                  <button
                    type="button"
                    onClick={onResetSimulatedTime}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 text-[11px] font-bold cursor-pointer shadow-2xs"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Reset Real Time</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-5 mt-4 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
