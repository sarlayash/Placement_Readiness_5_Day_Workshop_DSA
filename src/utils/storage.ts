import { GoogleUser, UserProgress } from '../types';

const STORAGE_KEY_USER = 'kapil_prp_google_user';
const STORAGE_KEY_PROGRESS = 'kapil_prp_user_progress';

export const INITIAL_PROGRESS: UserProgress = {
  completedQuestionIds: [],
  acknowledgedSolvedProgramIds: [],
  levelZeroCompletedIds: [],
  dayPreAssessmentPassed: {},
  dayPostAssessmentPassed: {},
  dayPreAssessmentScores: {},
  dayPostAssessmentScores: {},
  badgesUnlocked: {},
  finalExamPassed: false,
  finalExamScore: 0,
  finalExamDate: null,
  certificateId: null,
  customNotes: {},
  feedbackSubmitted: {},
  feedbackSubmittedAt: {},
};

export function loadGoogleUser(): GoogleUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USER);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveGoogleUser(user: GoogleUser | null): void {
  try {
    if (!user) {
      localStorage.removeItem(STORAGE_KEY_USER);
    } else {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    }
  } catch (err) {
    console.error('Failed to save Google User', err);
  }
}

export function loadUserProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROGRESS);
    if (!raw) return INITIAL_PROGRESS;
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_PROGRESS,
      ...parsed,
      levelZeroCompletedIds: parsed.levelZeroCompletedIds || [],
      feedbackSubmitted: parsed.feedbackSubmitted || {},
      feedbackSubmittedAt: parsed.feedbackSubmittedAt || {},
    };
  } catch {
    return INITIAL_PROGRESS;
  }
}

export function saveUserProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(progress));
  } catch (err) {
    console.error('Failed to save User Progress', err);
  }
}

export function generateCertificateId(userName: string): string {
  const cleanName = userName.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 4) || 'KAPL';
  const randomHex = Math.random().toString(36).substring(2, 7).toUpperCase();
  const year = new Date().getFullYear();
  return `KAPIL-PRP-${year}-${cleanName}-${randomHex}`;
}
