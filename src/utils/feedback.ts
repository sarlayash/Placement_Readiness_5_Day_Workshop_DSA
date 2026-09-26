import { UserProgress, FeedbackWindowStatus, FeedbackReminderStage } from '../types';
import { ISTStatus } from './istTime';

export const FEEDBACK_URL = 'https://fpln.site/feedback/form.php?id=4gvfOQ8m';

export const FEEDBACK_WINDOW = {
  startHour: 14,
  startMinute: 30, // 2:30 PM IST
  endHour: 15,
  endMinute: 30, // 3:30 PM IST
  reminder30mHour: 14,
  reminder30mMinute: 0, // 2:00 PM IST (30 mins before)
  reminder10mHour: 14,
  reminder10mMinute: 20, // 2:20 PM IST (10 mins before)
  reminder5mHour: 14,
  reminder5mMinute: 25, // 2:25 PM IST (5 mins before)
};

/**
 * Calculates current status of the Daily Feedback window:
 * - Window: 2:30 PM to 3:30 PM IST
 * - Reminders:
 *   - 30 min before: 2:00 PM - 2:19 PM IST
 *   - 10 min before: 2:20 PM - 2:24 PM IST
 *   - 5 min before: 2:25 PM - 2:29 PM IST
 *   - Active: 2:30 PM - 3:30 PM IST
 */
export function calculateFeedbackStatus(
  currentDay: number,
  progress: UserProgress,
  istStatus: ISTStatus,
  demoBypass = false
): FeedbackWindowStatus {
  const isFilledToday = !!(progress.feedbackSubmitted && progress.feedbackSubmitted[currentDay]);

  const istDate = istStatus.currentISTDate;
  const hour = istDate.getHours();
  const minute = istDate.getMinutes();
  const second = istDate.getSeconds();

  const currentMinutes = hour * 60 + minute + second / 60;
  const startMinutes = 14 * 60 + 30; // 870 mins (2:30 PM)
  const endMinutes = 15 * 60 + 30; // 930 mins (3:30 PM)
  const rem30Minutes = 14 * 60 + 0; // 840 mins (2:00 PM)
  const rem10Minutes = 14 * 60 + 20; // 860 mins (2:20 PM)
  const rem5Minutes = 14 * 60 + 25; // 865 mins (2:25 PM)

  if (demoBypass) {
    return {
      isActive: true,
      isOpenToday: true,
      currentDay,
      isFilledToday,
      timeRemainingSec: 3600,
      timeUntilOpenSec: 0,
      reminderStage: 'active',
      reminderMessage: `[Testing Bypass] Day ${currentDay} Daily Feedback is open for inspection! (Link: fpln.site)`,
    };
  }

  let isActive = false;
  let isOpenToday = false;
  let reminderStage: FeedbackReminderStage = 'none';
  let reminderMessage = `Day ${currentDay} Feedback opens at 2:30 PM IST today.`;
  let timeRemainingSec = 0;
  let timeUntilOpenSec = 0;

  if (currentMinutes >= startMinutes && currentMinutes < endMinutes) {
    isActive = true;
    isOpenToday = true;
    reminderStage = 'active';
    timeRemainingSec = Math.max(0, Math.floor((endMinutes - currentMinutes) * 60));
    reminderMessage = isFilledToday
      ? `✓ Day ${currentDay} Feedback submitted! Window closes at 3:30 PM IST.`
      : `🔔 Day ${currentDay} Daily Feedback is LIVE NOW (2:30 PM - 3:30 PM IST)! Please fill out the form.`;
  } else if (currentMinutes >= rem5Minutes && currentMinutes < startMinutes) {
    isActive = false;
    isOpenToday = false;
    reminderStage = '5m';
    timeUntilOpenSec = Math.max(0, Math.floor((startMinutes - currentMinutes) * 60));
    reminderMessage = `🚨 Final 5-Min Reminder: Day ${currentDay} Feedback window opens at 2:30 PM IST! (Window is 1 hour only: 2:30 PM - 3:30 PM).`;
  } else if (currentMinutes >= rem10Minutes && currentMinutes < rem5Minutes) {
    isActive = false;
    isOpenToday = false;
    reminderStage = '10m';
    timeUntilOpenSec = Math.max(0, Math.floor((startMinutes - currentMinutes) * 60));
    reminderMessage = `⚠️ 10-Min Reminder: Day ${currentDay} Feedback opens in 10 minutes at 2:30 PM IST. Get ready!`;
  } else if (currentMinutes >= rem30Minutes && currentMinutes < rem10Minutes) {
    isActive = false;
    isOpenToday = false;
    reminderStage = '30m';
    timeUntilOpenSec = Math.max(0, Math.floor((startMinutes - currentMinutes) * 60));
    reminderMessage = `⏰ 30-Min Reminder: Day ${currentDay} Workshop Feedback opens at 2:30 PM IST.`;
  } else if (currentMinutes < rem30Minutes) {
    isActive = false;
    isOpenToday = false;
    reminderStage = 'none';
    timeUntilOpenSec = Math.max(0, Math.floor((startMinutes - currentMinutes) * 60));
    reminderMessage = `Day ${currentDay} Workshop Feedback opens today at 2:30 PM IST.`;
  } else {
    // currentMinutes >= endMinutes
    isActive = false;
    isOpenToday = false;
    reminderStage = 'closed';
    timeRemainingSec = 0;
    timeUntilOpenSec = 0;
    reminderMessage = `Day ${currentDay} Feedback window closed at 3:30 PM IST. Next window opens tomorrow at 2:30 PM IST.`;
  }

  return {
    isActive,
    isOpenToday,
    currentDay,
    isFilledToday,
    timeRemainingSec,
    timeUntilOpenSec,
    reminderStage,
    reminderMessage,
  };
}

export function formatFeedbackTimer(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

/**
 * Native Browser Notification Dispatcher
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }
  if (Notification.permission === 'granted') {
    return true;
  }
  if (Notification.permission !== 'denied') {
    const perm = await Notification.requestPermission();
    return perm === 'granted';
  }
  return false;
}

export function sendDesktopNotification(title: string, body: string): void {
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  if (Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: '/pwa-icon.svg',
      });
    } catch {
      // Ignore if background notification fails
    }
  }
}

// Track whether we sent desktop notifications for this session to prevent repeated dings
const NOTIFIED_KEY_PREFIX = 'kapil_feedback_notified_';

export function hasNotifiedStage(day: number, stage: string): boolean {
  try {
    const todayStr = new Date().toDateString();
    const key = `${NOTIFIED_KEY_PREFIX}${todayStr}_d${day}_${stage}`;
    return sessionStorage.getItem(key) === 'true';
  } catch {
    return false;
  }
}

export function markNotifiedStage(day: number, stage: string): void {
  try {
    const todayStr = new Date().toDateString();
    const key = `${NOTIFIED_KEY_PREFIX}${todayStr}_d${day}_${stage}`;
    sessionStorage.setItem(key, 'true');
  } catch {
    // ignore
  }
}
