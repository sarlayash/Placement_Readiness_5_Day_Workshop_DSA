import { UserProgress } from '../types';
import { TOPICS } from '../data/curriculum';
import { SOLVED_PROGRAMS } from '../data/solvedPrograms';
import { ISTStatus } from './istTime';

export interface DayCompletionStatus {
  day: number;
  isComplete: boolean;
  prePassed: boolean;
  preScore: number;
  questionsSolved: number;
  totalQuestions: number;
  allQuestionsSolved: boolean;
  programsAcknowledged: number;
  totalPrograms: number;
  allProgramsAcknowledged: boolean;
  postPassed: boolean;
  postScore: number;
  badgeEarned: boolean;
  missingTasks: string[];
}

export interface DayUnlockResult {
  unlocked: boolean;
  reason?: string;
  missingDay?: number;
  missingTasks?: string[];
}

export interface FinalExamEligibility {
  isEligible: boolean;
  totalTasksRemaining: number;
  dayStatuses: DayCompletionStatus[];
}

/**
 * Checks all 4 core sections of a single day:
 * 1. Pre-Assessment passed
 * 2. All In-class & Post-class curriculum questions solved
 * 3. All 6 Solved Programs acknowledged
 * 4. Post-Assessment passed & Badge unlocked
 */
export function checkDayCompletion(
  day: number,
  progress: UserProgress
): DayCompletionStatus {
  const prePassed = !!progress.dayPreAssessmentPassed[day];
  const preScore = progress.dayPreAssessmentScores[day] || 0;

  const dayQuestions = TOPICS.filter((t) => t.day === day).flatMap((t) => t.questions);
  const totalQuestions = dayQuestions.length;
  const questionsSolved = dayQuestions.filter((q) =>
    progress.completedQuestionIds.includes(q.id)
  ).length;
  const allQuestionsSolved = totalQuestions > 0 && questionsSolved >= totalQuestions;

  const dayPrograms = SOLVED_PROGRAMS.filter((p) => p.day === day);
  const totalPrograms = dayPrograms.length;
  const programsAcknowledged = dayPrograms.filter((p) =>
    (progress.acknowledgedSolvedProgramIds || []).includes(p.id)
  ).length;
  const allProgramsAcknowledged = totalPrograms > 0 && programsAcknowledged >= totalPrograms;

  const postPassed = !!progress.dayPostAssessmentPassed[day];
  const postScore = progress.dayPostAssessmentScores[day] || 0;
  const badgeEarned = !!progress.badgesUnlocked[day];

  const missingTasks: string[] = [];
  if (!prePassed) {
    missingTasks.push(`Step 1: Day ${day} Pre-Assessment`);
  }
  if (!allQuestionsSolved) {
    missingTasks.push(
      `Step 2: Guided Curriculum Questions (${totalQuestions - questionsSolved} remaining)`
    );
  }
  if (!allProgramsAcknowledged) {
    missingTasks.push(
      `Step 3: 6 Solved Programs Masterclass (${totalPrograms - programsAcknowledged} remaining)`
    );
  }
  if (!postPassed || !badgeEarned) {
    missingTasks.push(`Step 4: Day ${day} Post-Assessment & Badge (Score >= 70%)`);
  }

  const isComplete =
    prePassed &&
    allQuestionsSolved &&
    allProgramsAcknowledged &&
    postPassed &&
    badgeEarned;

  return {
    day,
    isComplete,
    prePassed,
    preScore,
    questionsSolved,
    totalQuestions,
    allQuestionsSolved,
    programsAcknowledged,
    totalPrograms,
    allProgramsAcknowledged,
    postPassed,
    postScore,
    badgeEarned,
    missingTasks,
  };
}

/**
 * Checks if a specific day is accessible to the learner.
 * STRICT RULE: Day N will not unlock unless ALL sections of Day N-1 are 100% completed.
 */
export function isDayUnlockedStrict(
  dayNumber: number,
  progress: UserProgress,
  istStatus: ISTStatus,
  demoBypass = false
): DayUnlockResult {
  if (demoBypass) {
    return { unlocked: true };
  }

  // 1. Check IST Time Window Lock
  if (!istStatus.isWithinActiveWindow) {
    return {
      unlocked: false,
      reason: `Placement platform is locked outside active hours (08:00 AM - 08:00 PM IST). Daily lock reopens at 08:00 AM IST.`,
    };
  }

  // 2. Day 1 is always unlocked during active IST window
  if (dayNumber === 1) {
    return { unlocked: true };
  }

  // 3. Days 2 to 5 strictly require ALL sections of Day N-1
  const prevDay = dayNumber - 1;
  const prevStatus = checkDayCompletion(prevDay, progress);

  if (!prevStatus.isComplete) {
    return {
      unlocked: false,
      missingDay: prevDay,
      missingTasks: prevStatus.missingTasks,
      reason: `Day ${dayNumber} is strictly locked. You must complete ALL sections of Day ${prevDay} (${prevStatus.missingTasks.join(
        ', '
      )}) to unlock this day.`,
    };
  }

  return { unlocked: true };
}

/**
 * Checks if learner is eligible to start the Day 5 Final Proctored Exam.
 * STRICT RULE: Final Assessment will NOT unlock unless ALL Days 1 through 5 tasks are 100% completed.
 */
export function checkFinalExamEligibility(
  progress: UserProgress,
  demoBypass = false
): FinalExamEligibility {
  const dayStatuses: DayCompletionStatus[] = [1, 2, 3, 4, 5].map((d) =>
    checkDayCompletion(d, progress)
  );

  let totalTasksRemaining = 0;
  dayStatuses.forEach((status) => {
    totalTasksRemaining += status.missingTasks.length;
  });

  const allCompleted = dayStatuses.every((s) => s.isComplete);
  const isEligible = demoBypass || allCompleted;

  return {
    isEligible,
    totalTasksRemaining,
    dayStatuses,
  };
}
