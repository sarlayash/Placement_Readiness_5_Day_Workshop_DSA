import React, { useState } from 'react';
import { FeedbackWindowStatus, FeedbackReminderStage } from '../types';
import { formatFeedbackTimer, FEEDBACK_URL } from '../utils/feedback';
import {
  Bell,
  Clock,
  AlertTriangle,
  AlertCircle,
  ExternalLink,
  CheckCircle2,
  X,
  Volume2,
} from 'lucide-react';

interface FeedbackReminderBannerProps {
  status: FeedbackWindowStatus;
  onOpenModal: () => void;
  onRequestNotifications?: () => void;
}

export const FeedbackReminderBanner: React.FC<FeedbackReminderBannerProps> = ({
  status,
  onOpenModal,
  onRequestNotifications,
}) => {
  const [dismissedStage, setDismissedStage] = useState<FeedbackReminderStage | null>(null);

  // If already filled today or stage is none/closed, or user dismissed this specific stage
  if (status.isFilledToday || status.reminderStage === 'none' || status.reminderStage === dismissedStage) {
    return null;
  }

  const getStageConfig = () => {
    switch (status.reminderStage) {
      case 'active':
        return {
          bgColor: 'bg-gradient-to-r from-red-600 via-rose-600 to-pink-600',
          borderColor: 'border-red-400',
          textColor: 'text-white',
          icon: <Bell className="w-4 h-4 text-white animate-bounce shrink-0" />,
          title: `🔔 Day ${status.currentDay} Daily Feedback is LIVE NOW!`,
          subtext: `Window closes strictly at 03:30 PM IST (${formatFeedbackTimer(status.timeRemainingSec)} remaining).`,
          btnColor: 'bg-white text-rose-700 hover:bg-rose-50',
        };
      case '5m':
        return {
          bgColor: 'bg-gradient-to-r from-amber-600 via-orange-600 to-red-600',
          borderColor: 'border-amber-400',
          textColor: 'text-white',
          icon: <AlertCircle className="w-4 h-4 text-white animate-pulse shrink-0" />,
          title: `🚨 Final 5-Min Reminder: Day ${status.currentDay} Feedback Opens at 2:30 PM IST!`,
          subtext: `Window is only 1 hour (02:30 PM - 03:30 PM IST). Opens in ${formatFeedbackTimer(status.timeUntilOpenSec)}.`,
          btnColor: 'bg-white text-orange-800 hover:bg-orange-50',
        };
      case '10m':
        return {
          bgColor: 'bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500',
          borderColor: 'border-amber-300',
          textColor: 'text-white',
          icon: <AlertTriangle className="w-4 h-4 text-white shrink-0" />,
          title: `⚠️ 10-Min Reminder: Day ${status.currentDay} Feedback Opens in 10 Minutes!`,
          subtext: `Daily feedback opens at 02:30 PM IST (${formatFeedbackTimer(status.timeUntilOpenSec)} remaining).`,
          btnColor: 'bg-white text-amber-900 hover:bg-amber-50',
        };
      case '30m':
        return {
          bgColor: 'bg-gradient-to-r from-indigo-700 via-purple-700 to-slate-800',
          borderColor: 'border-indigo-400',
          textColor: 'text-white',
          icon: <Clock className="w-4 h-4 text-indigo-300 shrink-0" />,
          title: `⏰ 30-Min Reminder: Day ${status.currentDay} Daily Workshop Feedback`,
          subtext: `Form opens today at 02:30 PM IST (${formatFeedbackTimer(status.timeUntilOpenSec)} until window opens).`,
          btnColor: 'bg-white text-indigo-900 hover:bg-indigo-50',
        };
      default:
        return null;
    }
  };

  const config = getStageConfig();
  if (!config) return null;

  return (
    <div
      role="alert"
      className={`sticky top-0 z-40 w-full px-3 py-2.5 sm:px-6 sm:py-3 shadow-md border-b ${config.bgColor} ${config.borderColor} ${config.textColor} transition-all`}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1 rounded-lg bg-black/20 shrink-0">{config.icon}</div>
          <div>
            <div className="text-xs sm:text-sm font-extrabold flex items-center gap-2 flex-wrap">
              <span>{config.title}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 font-mono tracking-wider uppercase">
                2:30 PM - 3:30 PM IST
              </span>
            </div>
            <p className="text-[11px] sm:text-xs opacity-90 mt-0.5 leading-tight">{config.subtext}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
          {onRequestNotifications && typeof window !== 'undefined' && 'Notification' in window && Notification.permission !== 'granted' && (
            <button
              type="button"
              onClick={onRequestNotifications}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-[11px] font-semibold transition-all cursor-pointer"
              title="Enable desktop notifications for 30m, 10m, and 5m reminders"
            >
              <Volume2 className="w-3 h-3" />
              <span className="hidden md:inline">Enable Browser Alerts</span>
            </button>
          )}

          <a
            href={FEEDBACK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${config.btnColor}`}
          >
            <span>Open Link</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <button
            type="button"
            onClick={onOpenModal}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-black/30 hover:bg-black/40 text-white text-xs font-bold transition-all cursor-pointer"
          >
            <span>Details / Acknowledge</span>
          </button>

          <button
            type="button"
            onClick={() => setDismissedStage(status.reminderStage)}
            className="p-1.5 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
            title="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
