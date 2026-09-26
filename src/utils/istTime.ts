/**
 * IST (Indian Standard Time) Lock Window Utility
 * Rules:
 * - Active Window: 08:00 AM IST to 08:00 PM IST (08:00 - 20:00)
 * - Relocks: 08:00 PM IST till 08:00 AM IST next morning
 * - Next day unlocks strictly at 08:00 AM IST
 */

export interface ISTStatus {
  currentISTDate: Date;
  istTimeString: string;
  istDateString: string;
  isWithinActiveWindow: boolean; // between 08:00 and 20:00 IST
  timeUntilUnlockSeconds: number; // if before 8am or after 8pm
  timeUntilRelockSeconds: number; // if between 8am and 8pm
  activeWindowStart: string; // "08:00 AM IST"
  activeWindowEnd: string; // "08:00 PM IST"
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

export function calculateISTStatus(overrideDate?: Date | null, bypassLockWindow = false): ISTStatus {
  const ist = getISTDate(overrideDate);
  const hours = ist.getHours();
  const minutes = ist.getMinutes();
  const seconds = ist.getSeconds();

  // Active window is [08:00, 20:00) IST
  const isWithinWindow = bypassLockWindow || (hours >= 8 && hours < 20);

  // Time calculations
  let timeUntilUnlock = 0;
  let timeUntilRelock = 0;

  if (hours >= 20) {
    // Relocked for the night. Next unlock is 8 AM tomorrow
    // hours left today: 24 - hours - 1
    // hours tomorrow: 8
    const secondsRemainingToday = (23 - hours) * 3600 + (59 - minutes) * 60 + (60 - seconds);
    timeUntilUnlock = secondsRemainingToday + 8 * 3600;
  } else if (hours < 8) {
    // Before 8 AM today. Unlock is at 8 AM today
    timeUntilUnlock = (7 - hours) * 3600 + (59 - minutes) * 60 + (60 - seconds);
  } else {
    // Within active window. Relock is at 20:00 (8 PM) today
    timeUntilRelock = (19 - hours) * 3600 + (59 - minutes) * 60 + (60 - seconds);
  }

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
    timeUntilUnlockSeconds: Math.max(0, timeUntilUnlock),
    timeUntilRelockSeconds: Math.max(0, timeUntilRelock),
    activeWindowStart: '08:00 AM IST',
    activeWindowEnd: '08:00 PM IST',
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
 * - Day 1 is always unlocked during active window (or if bypass is on)
 * - Day N requires Day N-1 to be completed, and must be within active 8am-8pm window
 */
export function isDayUnlocked(
  dayNumber: number,
  completedBadges: Record<number, boolean>,
  istStatus: ISTStatus,
  demoBypass = false
): { unlocked: boolean; reason?: string } {
  if (demoBypass) {
    return { unlocked: true };
  }

  // Check IST Window lock first
  if (!istStatus.isWithinActiveWindow) {
    return {
      unlocked: false,
      reason: `System locked outside active hours (08:00 AM - 08:00 PM IST). Unlocks at 08:00 AM IST.`,
    };
  }

  // Day 1 is open during active window
  if (dayNumber === 1) {
    return { unlocked: true };
  }

  // Day 2..5 requires previous day badge
  const prevDay = dayNumber - 1;
  const prevCompleted = !!completedBadges[prevDay];

  if (!prevCompleted) {
    return {
      unlocked: false,
      reason: `Complete Day ${prevDay} syllabus & assessments to unlock Day ${dayNumber}.`,
    };
  }

  return { unlocked: true };
}
