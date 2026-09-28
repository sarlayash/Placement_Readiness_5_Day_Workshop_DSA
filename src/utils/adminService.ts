import {
  GoogleUser,
  UserProgress,
  StudentRecord,
  AdminCustomBadge,
  AdminCustomCertificate,
  AdminCustomAssignment,
  AdminCustomQuiz,
} from '../types';

const ADMIN_USERNAME = 'KAPILADMIN';
const ADMIN_PASSWORD = 'ADMIN123';

const STORAGE_ADMIN_AUTH = 'kapil_prp_admin_auth';
const STORAGE_ROSTER = 'kapil_prp_student_roster';
const STORAGE_CUSTOM_BADGES = 'kapil_prp_admin_badges';
const STORAGE_CUSTOM_CERTS = 'kapil_prp_admin_certificates';
const STORAGE_CUSTOM_ASSIGNMENTS = 'kapil_prp_admin_assignments';
const STORAGE_CUSTOM_QUIZZES = 'kapil_prp_admin_quizzes';

// Verify Admin Credentials (case-insensitive username, exact password)
export function verifyAdminCredentials(user: string, pass: string): boolean {
  return user.trim().toUpperCase() === ADMIN_USERNAME && pass === ADMIN_PASSWORD;
}

export function isAdminAuthenticated(): boolean {
  try {
    return sessionStorage.getItem(STORAGE_ADMIN_AUTH) === 'true';
  } catch {
    return false;
  }
}

export function setAdminAuthenticated(val: boolean): void {
  try {
    if (val) {
      sessionStorage.setItem(STORAGE_ADMIN_AUTH, 'true');
    } else {
      sessionStorage.removeItem(STORAGE_ADMIN_AUTH);
    }
  } catch (err) {
    console.error('Failed to set admin session', err);
  }
}

import { REAL_FIREBASE_AUTH_USERS } from './realFirebaseUsers';
export { REAL_FIREBASE_AUTH_USERS } from './realFirebaseUsers';

// Helper to generate empty progress with zero fake numbers
export function createEmptyUserProgress(): UserProgress {
  return {
    completedQuestionIds: [],
    acknowledgedSolvedProgramIds: [],
    levelZeroCompletedIds: [],
    visualizationCompletedIds: [],
    visualizationTries: {},
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
}

// Build verified Real Firebase Student records (100% Real Google Users)
export function getInitialRealStudents(): StudentRecord[] {
  let currentGoogleUser: GoogleUser | null = null;
  let currentUserProgress: UserProgress | null = null;
  try {
    const rawUser = localStorage.getItem('kapil_prp_google_user');
    if (rawUser) currentGoogleUser = JSON.parse(rawUser);
    const rawProg = localStorage.getItem('kapil_prp_progress');
    if (rawProg) currentUserProgress = JSON.parse(rawProg);
  } catch {
    // ignore
  }

  const list: StudentRecord[] = REAL_FIREBASE_AUTH_USERS.map((fbUser) => {
    const isCurrentUser =
      currentGoogleUser &&
      (currentGoogleUser.email.toLowerCase() === fbUser.email.toLowerCase() ||
        currentGoogleUser.id === fbUser.localId);

    const progress =
      isCurrentUser && currentUserProgress
        ? currentUserProgress
        : createEmptyUserProgress();

    return {
      id: fbUser.localId,
      name: fbUser.displayName,
      email: fbUser.email,
      rollNo: `UID-${fbUser.localId.substring(0, 8)}`,
      avatar: fbUser.photoUrl,
      loginProvider: 'Google Auth (Firebase)',
      registeredAt: fbUser.createdAt,
      lastActive: isCurrentUser ? new Date().toISOString() : fbUser.lastSignedInAt,
      progress,
      customBadges: [],
      customCertificates: [],
    };
  });

  // If active user is another Google user not yet in REAL_FIREBASE_AUTH_USERS, add them
  if (
    currentGoogleUser &&
    currentGoogleUser.email &&
    !list.some((s) => s.email.toLowerCase() === currentGoogleUser!.email.toLowerCase())
  ) {
    list.unshift({
      id: currentGoogleUser.id,
      name: currentGoogleUser.name,
      email: currentGoogleUser.email,
      rollNo: `UID-${(currentGoogleUser.id || '').substring(0, 8) || 'GOOG'}`,
      avatar: currentGoogleUser.avatar,
      loginProvider: 'Google Auth (Firebase)',
      registeredAt: currentGoogleUser.signedInAt || new Date().toISOString(),
      lastActive: new Date().toISOString(),
      progress: currentUserProgress || createEmptyUserProgress(),
      customBadges: [],
      customCertificates: [],
    });
  }

  return list;
}

// Load Student Roster - STRICTLY REAL GOOGLE USERS ONLY, ZERO FAKE DATA
export function getAllStudents(): StudentRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_ROSTER);
    let list: StudentRecord[] = [];

    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          // STRICT PURGE: Strip ANY fake / seeded mock users (e.g. stud-jiet-*)
          list = parsed.filter(
            (s: StudentRecord) =>
              s.loginProvider?.includes('Google') &&
              !s.id?.startsWith('stud-') &&
              !s.rollNo?.startsWith('22JIET')
          );
        }
      } catch {
        list = [];
      }
    }

    if (list.length === 0) {
      list = getInitialRealStudents();
    } else {
      // Ensure known Firebase Auth accounts are present
      REAL_FIREBASE_AUTH_USERS.forEach((fbUser) => {
        const exists = list.some(
          (s) =>
            s.email.toLowerCase() === fbUser.email.toLowerCase() ||
            s.id === fbUser.localId
        );
        if (!exists) {
          list.push({
            id: fbUser.localId,
            name: fbUser.displayName,
            email: fbUser.email,
            rollNo: `UID-${fbUser.localId.substring(0, 8)}`,
            avatar: fbUser.photoUrl,
            loginProvider: 'Google Auth (Firebase)',
            registeredAt: fbUser.createdAt,
            lastActive: fbUser.lastSignedInAt,
            progress: createEmptyUserProgress(),
            customBadges: [],
            customCertificates: [],
          });
        }
      });
    }

    // Attach active logged-in Google learner's live progress
    try {
      const rawUser = localStorage.getItem('kapil_prp_google_user');
      const rawProg = localStorage.getItem('kapil_prp_progress');
      if (rawUser && rawProg) {
        const u: GoogleUser = JSON.parse(rawUser);
        const p: UserProgress = JSON.parse(rawProg);
        const curIdx = list.findIndex(
          (s) =>
            s.email.toLowerCase() === u.email.toLowerCase() ||
            s.id === u.id
        );
        if (curIdx >= 0) {
          list[curIdx].progress = p;
          list[curIdx].lastActive = new Date().toISOString();
        } else if (u.email) {
          list.unshift({
            id: u.id,
            name: u.name,
            email: u.email,
            rollNo: `UID-${(u.id || '').substring(0, 8) || 'GOOG'}`,
            avatar: u.avatar,
            loginProvider: 'Google Auth (Firebase)',
            registeredAt: u.signedInAt || new Date().toISOString(),
            lastActive: new Date().toISOString(),
            progress: p,
            customBadges: [],
            customCertificates: [],
          });
        }
      }
    } catch {
      // ignore
    }

    localStorage.setItem(STORAGE_ROSTER, JSON.stringify(list));
    return list;
  } catch {
    const initials = getInitialRealStudents();
    localStorage.setItem(STORAGE_ROSTER, JSON.stringify(initials));
    return initials;
  }
}

// Fetch live Firebase Authentication users from hosted roster endpoint and merge
export async function fetchLiveFirebaseRoster(): Promise<StudentRecord[]> {
  try {
    const res = await fetch('./firebase_auth_roster.json?t=' + Date.now());
    if (res.ok) {
      const remoteUsers: typeof REAL_FIREBASE_AUTH_USERS = await res.json();
      if (Array.isArray(remoteUsers) && remoteUsers.length > 0) {
        const current = getAllStudents();
        remoteUsers.forEach((fbUser) => {
          const exists = current.some(
            (s) => s.email.toLowerCase() === fbUser.email.toLowerCase() || s.id === fbUser.localId
          );
          if (!exists) {
            current.push({
              id: fbUser.localId,
              name: fbUser.displayName,
              email: fbUser.email,
              rollNo: `UID-${fbUser.localId.substring(0, 8)}`,
              avatar: fbUser.photoUrl,
              loginProvider: 'Google Auth (Firebase)',
              registeredAt: fbUser.createdAt,
              lastActive: fbUser.lastSignedInAt,
              progress: createEmptyUserProgress(),
              customBadges: [],
              customCertificates: [],
            });
          }
        });
        localStorage.setItem(STORAGE_ROSTER, JSON.stringify(current));
        return current;
      }
    }
  } catch {
    // fallback
  }
  return getAllStudents();
}

// Force-sync real Firebase users and clean any stale data
export function forceSyncFirebaseRoster(): StudentRecord[] {
  try {
    localStorage.removeItem(STORAGE_ROSTER);
  } catch {
    // ignore
  }
  return getAllStudents();
}

// Sync active learner into student roster
export function syncCurrentUserToRoster(user: GoogleUser, progress: UserProgress): void {
  try {
    const students = getAllStudents();
    const existingIndex = students.findIndex((s) => s.email.toLowerCase() === user.email.toLowerCase() || s.id === user.id);

    const nowIso = new Date().toISOString();

    if (existingIndex >= 0) {
      students[existingIndex] = {
        ...students[existingIndex],
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        lastActive: nowIso,
        progress: {
          ...students[existingIndex].progress,
          ...progress,
        },
      };
    } else {
      const newStudent: StudentRecord = {
        id: user.id || `google-${Date.now()}`,
        name: user.name,
        email: user.email,
        rollNo: `UID-${(user.id || '').substring(0, 8) || 'GOOG'}`,
        avatar: user.avatar,
        loginProvider: 'Google Auth (Firebase)',
        registeredAt: user.signedInAt || nowIso,
        lastActive: nowIso,
        progress: progress,
        customBadges: [],
        customCertificates: [],
      };
      students.unshift(newStudent);
    }

    localStorage.setItem(STORAGE_ROSTER, JSON.stringify(students));
  } catch (err) {
    console.error('Failed to sync user to roster', err);
  }
}

// Update specific student record
export function updateStudentRecord(studentId: string, updater: (prev: StudentRecord) => StudentRecord): void {
  try {
    const students = getAllStudents();
    const idx = students.findIndex((s) => s.id === studentId);
    if (idx >= 0) {
      students[idx] = updater(students[idx]);
      localStorage.setItem(STORAGE_ROSTER, JSON.stringify(students));
    }
  } catch (err) {
    console.error('Failed to update student record', err);
  }
}

// Calculate Day Completion percentage for student
export function calculateStudentDayCompletion(progress: UserProgress, day: number): number {
  let score = 0;
  if (progress.dayPreAssessmentPassed[day]) score += 20;
  // Solved programs (6 total per day, up to 40%)
  const dayPrograms = (progress.acknowledgedSolvedProgramIds || []).filter((id) => id.startsWith(`D${day}-`));
  score += Math.min(40, Math.round((dayPrograms.length / 6) * 40));
  if (progress.dayPostAssessmentPassed[day]) score += 25;
  if (progress.badgesUnlocked[day]) score += 15;
  return Math.min(100, score);
}

// Calculate Overall Course Completion percentage for student
export function calculateStudentOverallCompletion(progress: UserProgress): number {
  let daySum = 0;
  for (let d = 1; d <= 5; d++) {
    daySum += calculateStudentDayCompletion(progress, d);
  }
  const baseAvg = daySum / 5;
  const examBonus = progress.finalExamPassed ? 10 : 0;
  return Math.min(100, Math.round(baseAvg * 0.9 + examBonus));
}

// Escape CSV cells according to RFC-4180
function escapeCSV(val: any): string {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

// Generate Daily CSV Report (Day 1 to 5)
export function generateDailyCSV(day: number, students: StudentRecord[]): string {
  const headers = [
    'Google UID / Roll No',
    'Student Name',
    'Email Address',
    'Day',
    'Pre-Assessment Score (/5)',
    'Pre-Assessment Status',
    'Solved Programs Acknowledged (/6)',
    'Post-Assessment Score (%)',
    'Post-Assessment Status',
    'Daily Badge Earned',
    'Day Completion (%)',
    'Feedback Submitted',
    'Last Active (IST)',
  ];

  const rows = students.map((s) => {
    const preScore = s.progress.dayPreAssessmentScores?.[day] ?? 0;
    const prePassed = s.progress.dayPreAssessmentPassed?.[day] ? 'Passed' : 'Pending';
    const dayAck = (s.progress.acknowledgedSolvedProgramIds || []).filter((id) => id.startsWith(`D${day}-`)).length;
    const postScore = s.progress.dayPostAssessmentScores?.[day] ?? 0;
    const postPassed = s.progress.dayPostAssessmentPassed?.[day] ? 'Passed' : 'Pending';
    const badgeEarned = s.progress.badgesUnlocked?.[day] ? 'UNLOCKED' : 'LOCKED';
    const completionPct = `${calculateStudentDayCompletion(s.progress, day)}%`;
    const feedbackStatus = s.progress.feedbackSubmitted?.[day] ? 'Submitted' : 'Pending';
    const lastActiveIST = s.lastActive ? new Date(s.lastActive).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : 'N/A';

    return [
      escapeCSV(s.rollNo || s.id || 'N/A'),
      escapeCSV(s.name),
      escapeCSV(s.email),
      escapeCSV(`Day ${day}`),
      escapeCSV(`${preScore}/5`),
      escapeCSV(prePassed),
      escapeCSV(`${dayAck}/6`),
      escapeCSV(`${postScore}%`),
      escapeCSV(postPassed),
      escapeCSV(badgeEarned),
      escapeCSV(completionPct),
      escapeCSV(feedbackStatus),
      escapeCSV(lastActiveIST),
    ].join(',');
  });

  return [headers.map(escapeCSV).join(','), ...rows].join('\r\n');
}

// Generate Consolidated 5-Day Master CSV Report
export function generateMasterCSV(students: StudentRecord[]): string {
  const headers = [
    'Google UID / Roll No',
    'Student Name',
    'Email Address',
    'Day 1 (%)',
    'Day 2 (%)',
    'Day 3 (%)',
    'Day 4 (%)',
    'Day 5 (%)',
    'Overall Completion (%)',
    'Solved Programs Completed (/30)',
    'Level 0 Completed (/10)',
    'Visualizer Practiced (/11)',
    'Badges Earned (/5)',
    'Final Exam Score (%)',
    'Final Exam Status',
    'Certificate Issued',
    'Certificate ID',
    'Registered Date',
    'Last Active (IST)',
  ];

  const rows = students.map((s) => {
    const d1 = `${calculateStudentDayCompletion(s.progress, 1)}%`;
    const d2 = `${calculateStudentDayCompletion(s.progress, 2)}%`;
    const d3 = `${calculateStudentDayCompletion(s.progress, 3)}%`;
    const d4 = `${calculateStudentDayCompletion(s.progress, 4)}%`;
    const d5 = `${calculateStudentDayCompletion(s.progress, 5)}%`;
    const overall = `${calculateStudentOverallCompletion(s.progress)}%`;
    const totalSolved = (s.progress.acknowledgedSolvedProgramIds || []).length;
    const lvl0 = (s.progress.levelZeroCompletedIds || []).length;
    const viz = (s.progress.visualizationCompletedIds || []).length;
    const badges = Object.values(s.progress.badgesUnlocked || {}).filter(Boolean).length;
    const examScore = `${s.progress.finalExamScore || 0}%`;
    const examPassed = s.progress.finalExamPassed ? 'PASSED' : 'NOT PASSED';
    const certIssued = s.progress.certificateId ? 'YES' : 'NO';
    const certId = s.progress.certificateId || 'N/A';
    const registeredDate = s.registeredAt ? new Date(s.registeredAt).toLocaleDateString('en-IN') : 'N/A';
    const lastActiveIST = s.lastActive ? new Date(s.lastActive).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : 'N/A';

    return [
      escapeCSV(s.rollNo || s.id || 'N/A'),
      escapeCSV(s.name),
      escapeCSV(s.email),
      escapeCSV(d1),
      escapeCSV(d2),
      escapeCSV(d3),
      escapeCSV(d4),
      escapeCSV(d5),
      escapeCSV(overall),
      escapeCSV(`${totalSolved}/30`),
      escapeCSV(`${lvl0}/10`),
      escapeCSV(`${viz}/11`),
      escapeCSV(`${badges}/5`),
      escapeCSV(examScore),
      escapeCSV(examPassed),
      escapeCSV(certIssued),
      escapeCSV(certId),
      escapeCSV(registeredDate),
      escapeCSV(lastActiveIST),
    ].join(',');
  });

  return [headers.map(escapeCSV).join(','), ...rows].join('\r\n');
}

// Trigger Client-Side CSV File Download
export function downloadCSV(filename: string, content: string): void {
  const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Admin Badges Service
export function getAdminCustomBadges(): AdminCustomBadge[] {
  try {
    const raw = localStorage.getItem(STORAGE_CUSTOM_BADGES);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function issueCustomBadge(badge: AdminCustomBadge): void {
  try {
    const current = getAdminCustomBadges();
    current.unshift(badge);
    localStorage.setItem(STORAGE_CUSTOM_BADGES, JSON.stringify(current));

    // Update recipient students
    const students = getAllStudents();
    students.forEach((s) => {
      if (badge.recipientStudentIds.length === 0 || badge.recipientStudentIds.includes(s.id)) {
        if (!s.customBadges) s.customBadges = [];
        if (!s.customBadges.includes(badge.title)) {
          s.customBadges.push(badge.title);
        }
      }
    });
    localStorage.setItem(STORAGE_ROSTER, JSON.stringify(students));
  } catch (err) {
    console.error('Failed to issue custom badge', err);
  }
}

// Admin Certificates Service
export function getAdminCustomCertificates(): AdminCustomCertificate[] {
  try {
    const raw = localStorage.getItem(STORAGE_CUSTOM_CERTS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function issueCustomCertificate(cert: AdminCustomCertificate): void {
  try {
    const current = getAdminCustomCertificates();
    current.unshift(cert);
    localStorage.setItem(STORAGE_CUSTOM_CERTS, JSON.stringify(current));

    // Update target student's certificateId and mark exam passed
    updateStudentRecord(cert.studentId, (prev) => ({
      ...prev,
      progress: {
        ...prev.progress,
        finalExamPassed: true,
        finalExamDate: cert.issuedAt,
        certificateId: cert.verificationCode,
      },
      customCertificates: [...(prev.customCertificates || []), cert.certificateTitle],
    }));
  } catch (err) {
    console.error('Failed to issue custom certificate', err);
  }
}

// Admin Custom Assignments Service
export function getAdminAssignments(): AdminCustomAssignment[] {
  try {
    const raw = localStorage.getItem(STORAGE_CUSTOM_ASSIGNMENTS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function addAdminAssignment(assignment: AdminCustomAssignment): void {
  try {
    const current = getAdminAssignments();
    current.unshift(assignment);
    localStorage.setItem(STORAGE_CUSTOM_ASSIGNMENTS, JSON.stringify(current));
  } catch (err) {
    console.error('Failed to save admin assignment', err);
  }
}

// Admin Custom Quizzes Service
export function getAdminQuizzes(): AdminCustomQuiz[] {
  try {
    const raw = localStorage.getItem(STORAGE_CUSTOM_QUIZZES);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function addAdminQuiz(quiz: AdminCustomQuiz): void {
  try {
    const current = getAdminQuizzes();
    current.unshift(quiz);
    localStorage.setItem(STORAGE_CUSTOM_QUIZZES, JSON.stringify(current));
  } catch (err) {
    console.error('Failed to save admin quiz', err);
  }
}
