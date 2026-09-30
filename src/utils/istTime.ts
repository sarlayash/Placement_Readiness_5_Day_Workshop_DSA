/**
 * IST (Indian Standard Time) Clock & Date Utility
 * Rules:
 * - All Days 1 to 5 are 100% UNLOCKED 24/7
 * - No 8:00 AM - 08:00 PM restrictions
 * - Round-the-clock unlimited learner access
 */

export interface ISTStatus {
  currentISTDate: Date;
  istTimeString: string;
  istDateString: string;
  isWithinActiveWindow: boolean; // Always true (24/7 unlimited access)
  timeUntilUnlockSeconds: number; // 0 (always open)
  timeUntilRelockSeconds: number; // 0 (never relocks)
  activeWindowStart: string; // "24/7 Open"
  activeWindowEnd: string; // "Unlimited Access"
  currentHourIST: number;
  currentMinuteIST: number;
}

// Convert any Date to IST date object
export function getISTDate(overrideDate?: Date | null): Date {
  const baseDate = overrideDate || new Date();
  // IST is UTC + 5 hours 30 minutes
  const utc = baseDate.getTime() + baseDate.getTimezoneOffset() * 60000;
  const istOffset = 5.5 * 3600000; // 5.5 hours in ms
  return new Date(utc + istOffset);
}

export function calculateISTStatus(overrideDate?: Date | null, _bypassLockWindow = false): ISTStatus {
  const ist = getISTDate(overrideDate);
  const hours = ist.getHours();
  const minutes = ist.getMinutes();

  // All Days 1-5 100% Unlocked 24/7 - No 8AM - 8PM limits
  const isWithinWindow = true;

  // Format strings
  const timeFormatter = new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata',
  });

  const dateFormatter = new Intl.DateTimeFormat('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  });

  return {
    currentISTDate: ist,
    istTimeString: timeFormatter.format(ist),
    istDateString: dateFormatter.format(ist),
    isWithinActiveWindow: isWithinWindow,
    timeUntilUnlockSeconds: 0,
    timeUntilRelockSeconds: 0,
    activeWindowStart: '24/7 Open',
    activeWindowEnd: 'Unlimited Access',
    currentHourIST: hours,
    currentMinuteIST: minutes,
  };
}

export function formatSecondsToDHMS(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
}

/**
 * Checks if a specific day is accessible to the user
 * All days 1 to 5 are 100% unlocked 24/7 without 8AM-8PM restrictions.
 */
export function isDayUnlocked(
  _dayNumber: number,
  _completedBadges?: Record<number, boolean>,
  _istStatus?: ISTStatus,
  _demoBypass = false
): { unlocked: boolean; reason?: string } {
  // All days are 100% unlocked 24/7
  return { unlocked: true };
}
