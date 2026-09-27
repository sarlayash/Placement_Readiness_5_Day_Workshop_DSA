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

// Initial realistic JIET Placement batch cohort
const SEED_STUDENTS: StudentRecord[] = [
  {
    id: 'stud-jiet-01',
    name: 'Aarav Mehta',
    email: 'aarav.mehta@jietjodhpur.ac.in',
    rollNo: '22JIETCS001',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav',
    loginProvider: 'Google Auth',
    registeredAt: '2026-09-23T08:15:00Z',
    lastActive: '2026-09-27T17:40:00Z',
    progress: {
      completedQuestionIds: ['q-t1-1', 'q-t1-2', 'q-t1-3', 'q-t2-1', 'q-t2-2', 'q-t3-1', 'q-t4-1', 'q-t5-1', 'q-t7-1', 'q-t9-1'],
      acknowledgedSolvedProgramIds: ['D1-E1', 'D1-E2', 'D1-M1', 'D1-M2', 'D1-H1', 'D1-H2', 'D2-E1', 'D2-E2', 'D2-M1', 'D2-M2', 'D2-H1', 'D2-H2', 'D3-E1', 'D3-M1', 'D4-E1', 'D5-E1'],
      levelZeroCompletedIds: ['lvl0-1', 'lvl0-2', 'lvl0-3', 'lvl0-4', 'lvl0-5', 'lvl0-6', 'lvl0-7', 'lvl0-8', 'lvl0-9', 'lvl0-10'],
      visualizationCompletedIds: ['linear-search', 'binary-search', 'bubble-sort', 'quick-sort', 'bfs-graph', 'bst-ops'],
      visualizationTries: { 'linear-search': 3, 'bubble-sort': 3, 'bfs-graph': 2 },
      dayPreAssessmentPassed: { 1: true, 2: true, 3: true, 4: true, 5: true },
      dayPostAssessmentPassed: { 1: true, 2: true, 3: true, 4: true, 5: true },
      dayPreAssessmentScores: { 1: 5, 2: 4, 3: 5, 4: 5, 5: 4 },
      dayPostAssessmentScores: { 1: 100, 2: 80, 3: 100, 4: 100, 5: 80 },
      badgesUnlocked: { 1: true, 2: true, 3: true, 4: true, 5: true },
      finalExamPassed: true,
      finalExamScore: 92,
      finalExamDate: '2026-09-27T16:30:00Z',
      certificateId: 'KAPIL-PRP-2026-AARA-8F92A',
      customNotes: {},
      feedbackSubmitted: { 1: true, 2: true, 3: true, 4: true, 5: true },
    },
    customBadges: ['Speed Coder Elite', 'Graph Titan'],
  },
  {
    id: 'stud-jiet-02',
    name: 'Priya Sharma',
    email: 'priya.sharma@jietjodhpur.ac.in',
    rollNo: '22JIETCS014',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
    loginProvider: 'Google Auth',
    registeredAt: '2026-09-23T08:20:00Z',
    lastActive: '2026-09-27T18:10:00Z',
    progress: {
      completedQuestionIds: ['q-t1-1', 'q-t1-2', 'q-t2-1', 'q-t3-1', 'q-t4-1', 'q-t5-1', 'q-t7-1'],
      acknowledgedSolvedProgramIds: ['D1-E1', 'D1-E2', 'D1-M1', 'D1-M2', 'D1-H1', 'D1-H2', 'D2-E1', 'D2-E2', 'D2-M1', 'D2-M2', 'D2-H1', 'D2-H2', 'D3-E1', 'D3-E2', 'D3-M1', 'D3-M2', 'D3-H1', 'D3-H2'],
      levelZeroCompletedIds: ['lvl0-1', 'lvl0-2', 'lvl0-3', 'lvl0-4', 'lvl0-5'],
      visualizationCompletedIds: ['linear-search', 'binary-search', 'bubble-sort', 'insertion-sort'],
      visualizationTries: { 'linear-search': 2, 'binary-search': 3 },
      dayPreAssessmentPassed: { 1: true, 2: true, 3: true, 4: true },
      dayPostAssessmentPassed: { 1: true, 2: true, 3: true, 4: false },
      dayPreAssessmentScores: { 1: 4, 2: 5, 3: 4, 4: 4 },
      dayPostAssessmentScores: { 1: 80, 2: 100, 3: 80, 4: 40 },
      badgesUnlocked: { 1: true, 2: true, 3: true },
      finalExamPassed: false,
      finalExamScore: 0,
      finalExamDate: null,
      certificateId: null,
      customNotes: {},
      feedbackSubmitted: { 1: true, 2: true, 3: true },
    },
    customBadges: ['Dynamic Programming Ace'],
  },
  {
    id: 'stud-jiet-03',
    name: 'Rohan Singhania',
    email: 'rohan.singhania@jietjodhpur.ac.in',
    rollNo: '22JIETCS029',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan',
    loginProvider: 'Google Auth',
    registeredAt: '2026-09-23T08:22:00Z',
    lastActive: '2026-09-27T17:55:00Z',
    progress: {
      completedQuestionIds: ['q-t1-1', 'q-t1-2', 'q-t2-1', 'q-t2-2', 'q-t3-1', 'q-t3-2', 'q-t4-1', 'q-t4-2', 'q-t5-1', 'q-t6-1', 'q-t7-1', 'q-t8-1', 'q-t9-1', 'q-t10-1'],
      acknowledgedSolvedProgramIds: [
        'D1-E1', 'D1-E2', 'D1-M1', 'D1-M2', 'D1-H1', 'D1-H2',
        'D2-E1', 'D2-E2', 'D2-M1', 'D2-M2', 'D2-H1', 'D2-H2',
        'D3-E1', 'D3-E2', 'D3-M1', 'D3-M2', 'D3-H1', 'D3-H2',
        'D4-E1', 'D4-E2', 'D4-M1', 'D4-M2', 'D4-H1', 'D4-H2',
        'D5-E1', 'D5-E2', 'D5-M1', 'D5-M2', 'D5-H1', 'D5-H2',
      ],
      levelZeroCompletedIds: ['lvl0-1', 'lvl0-2', 'lvl0-3', 'lvl0-4', 'lvl0-5', 'lvl0-6', 'lvl0-7', 'lvl0-8', 'lvl0-9', 'lvl0-10'],
      visualizationCompletedIds: ['linear-search', 'binary-search', 'bubble-sort', 'selection-sort', 'insertion-sort', 'merge-sort', 'quick-sort', 'bfs-graph', 'dfs-graph', 'dijkstra-graph', 'bst-ops', 'tree-traversal'],
      visualizationTries: { 'dijkstra-graph': 3, 'quick-sort': 3, 'bst-ops': 3 },
      dayPreAssessmentPassed: { 1: true, 2: true, 3: true, 4: true, 5: true },
      dayPostAssessmentPassed: { 1: true, 2: true, 3: true, 4: true, 5: true },
      dayPreAssessmentScores: { 1: 5, 2: 5, 3: 5, 4: 5, 5: 5 },
      dayPostAssessmentScores: { 1: 100, 2: 100, 3: 100, 4: 100, 5: 100 },
      badgesUnlocked: { 1: true, 2: true, 3: true, 4: true, 5: true },
      finalExamPassed: true,
      finalExamScore: 98,
      finalExamDate: '2026-09-27T17:15:00Z',
      certificateId: 'KAPIL-PRP-2026-ROHA-7C34D',
      customNotes: {},
      feedbackSubmitted: { 1: true, 2: true, 3: true, 4: true, 5: true },
    },
    customBadges: ['Placement Masterclass Topper', 'Grandmaster Algorithmist'],
  },
  {
    id: 'stud-jiet-04',
    name: 'Ananya Verma',
    email: 'ananya.verma@jietjodhpur.ac.in',
    rollNo: '22JIETCS033',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya',
    loginProvider: 'Google Auth',
    registeredAt: '2026-09-23T08:35:00Z',
    lastActive: '2026-09-27T16:50:00Z',
    progress: {
      completedQuestionIds: ['q-t1-1', 'q-t1-2', 'q-t2-1', 'q-t3-1', 'q-t4-1'],
      acknowledgedSolvedProgramIds: ['D1-E1', 'D1-E2', 'D1-M1', 'D1-M2', 'D1-H1', 'D1-H2', 'D2-E1', 'D2-E2'],
      levelZeroCompletedIds: ['lvl0-1', 'lvl0-2', 'lvl0-3', 'lvl0-4'],
      visualizationCompletedIds: ['linear-search', 'binary-search'],
      visualizationTries: { 'linear-search': 1 },
      dayPreAssessmentPassed: { 1: true, 2: true },
      dayPostAssessmentPassed: { 1: true, 2: true },
      dayPreAssessmentScores: { 1: 4, 2: 4 },
      dayPostAssessmentScores: { 1: 80, 2: 80 },
      badgesUnlocked: { 1: true, 2: true },
      finalExamPassed: false,
      finalExamScore: 0,
      finalExamDate: null,
      certificateId: null,
      customNotes: {},
      feedbackSubmitted: { 1: true, 2: true },
    },
  },
  {
    id: 'stud-jiet-05',
    name: 'Devendra Rathore',
    email: 'devendra.rathore@jietjodhpur.ac.in',
    rollNo: '22JIETCS048',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Devendra',
    loginProvider: 'Google Auth',
    registeredAt: '2026-09-23T08:40:00Z',
    lastActive: '2026-09-27T15:20:00Z',
    progress: {
      completedQuestionIds: ['q-t1-1', 'q-t1-2', 'q-t2-1', 'q-t2-2', 'q-t3-1', 'q-t4-1', 'q-t5-1'],
      acknowledgedSolvedProgramIds: ['D1-E1', 'D1-E2', 'D1-M1', 'D1-M2', 'D1-H1', 'D1-H2', 'D2-E1', 'D2-E2', 'D2-M1', 'D2-M2'],
      levelZeroCompletedIds: ['lvl0-1', 'lvl0-2', 'lvl0-3'],
      visualizationCompletedIds: ['bubble-sort', 'quick-sort'],
      visualizationTries: { 'bubble-sort': 3 },
      dayPreAssessmentPassed: { 1: true, 2: true, 3: true },
      dayPostAssessmentPassed: { 1: true, 2: true, 3: false },
      dayPreAssessmentScores: { 1: 5, 2: 4, 3: 3 },
      dayPostAssessmentScores: { 1: 100, 2: 80, 3: 40 },
      badgesUnlocked: { 1: true, 2: true },
      finalExamPassed: false,
      finalExamScore: 0,
      finalExamDate: null,
      certificateId: null,
      customNotes: {},
      feedbackSubmitted: { 1: true, 2: true },
    },
  },
  {
    id: 'stud-jiet-06',
    name: 'Kavita Chhajed',
    email: 'kavita.c@jietjodhpur.ac.in',
    rollNo: '22JIETCS055',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kavita',
    loginProvider: 'Google Auth',
    registeredAt: '2026-09-23T08:45:00Z',
    lastActive: '2026-09-27T17:25:00Z',
    progress: {
      completedQuestionIds: ['q-t1-1', 'q-t1-2', 'q-t2-1', 'q-t2-2', 'q-t3-1', 'q-t3-2', 'q-t4-1', 'q-t4-2', 'q-t5-1', 'q-t7-1', 'q-t8-1'],
      acknowledgedSolvedProgramIds: [
        'D1-E1', 'D1-E2', 'D1-M1', 'D1-M2', 'D1-H1', 'D1-H2',
        'D2-E1', 'D2-E2', 'D2-M1', 'D2-M2', 'D2-H1', 'D2-H2',
        'D3-E1', 'D3-E2', 'D3-M1', 'D3-M2', 'D3-H1', 'D3-H2',
        'D4-E1', 'D4-E2', 'D4-M1', 'D4-M2',
      ],
      levelZeroCompletedIds: ['lvl0-1', 'lvl0-2', 'lvl0-3', 'lvl0-4', 'lvl0-5', 'lvl0-6', 'lvl0-7', 'lvl0-8'],
      visualizationCompletedIds: ['linear-search', 'binary-search', 'bubble-sort', 'merge-sort', 'bfs-graph', 'dfs-graph'],
      visualizationTries: { 'bfs-graph': 3, 'dfs-graph': 2 },
      dayPreAssessmentPassed: { 1: true, 2: true, 3: true, 4: true },
      dayPostAssessmentPassed: { 1: true, 2: true, 3: true, 4: true },
      dayPreAssessmentScores: { 1: 5, 2: 5, 3: 4, 4: 5 },
      dayPostAssessmentScores: { 1: 100, 2: 100, 3: 80, 4: 100 },
      badgesUnlocked: { 1: true, 2: true, 3: true, 4: true },
      finalExamPassed: false,
      finalExamScore: 0,
      finalExamDate: null,
      certificateId: null,
      customNotes: {},
      feedbackSubmitted: { 1: true, 2: true, 3: true, 4: true },
    },
    customBadges: ['Consistent Achiever'],
  },
  {
    id: 'stud-jiet-07',
    name: 'Siddharth Dave',
    email: 'siddharth.dave@jietjodhpur.ac.in',
    rollNo: '22JIETCS068',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Siddharth',
    loginProvider: 'Google Auth',
    registeredAt: '2026-09-23T08:50:00Z',
    lastActive: '2026-09-27T18:05:00Z',
    progress: {
      completedQuestionIds: ['q-t1-1', 'q-t1-2', 'q-t2-1', 'q-t2-2', 'q-t3-1', 'q-t4-1', 'q-t5-1', 'q-t6-1', 'q-t7-1', 'q-t8-1', 'q-t9-1', 'q-t10-1'],
      acknowledgedSolvedProgramIds: [
        'D1-E1', 'D1-E2', 'D1-M1', 'D1-M2', 'D1-H1', 'D1-H2',
        'D2-E1', 'D2-E2', 'D2-M1', 'D2-M2', 'D2-H1', 'D2-H2',
        'D3-E1', 'D3-E2', 'D3-M1', 'D3-M2', 'D3-H1', 'D3-H2',
        'D4-E1', 'D4-E2', 'D4-M1', 'D4-M2', 'D4-H1', 'D4-H2',
        'D5-E1', 'D5-E2', 'D5-M1', 'D5-M2', 'D5-H1', 'D5-H2',
      ],
      levelZeroCompletedIds: ['lvl0-1', 'lvl0-2', 'lvl0-3', 'lvl0-4', 'lvl0-5', 'lvl0-6', 'lvl0-7', 'lvl0-8', 'lvl0-9', 'lvl0-10'],
      visualizationCompletedIds: ['linear-search', 'binary-search', 'bubble-sort', 'selection-sort', 'merge-sort', 'quick-sort', 'bfs-graph', 'dfs-graph', 'dijkstra-graph', 'bst-ops', 'tree-traversal'],
      visualizationTries: { 'dijkstra-graph': 3, 'bst-ops': 2 },
      dayPreAssessmentPassed: { 1: true, 2: true, 3: true, 4: true, 5: true },
      dayPostAssessmentPassed: { 1: true, 2: true, 3: true, 4: true, 5: true },
      dayPreAssessmentScores: { 1: 5, 2: 4, 3: 5, 4: 5, 5: 5 },
      dayPostAssessmentScores: { 1: 100, 2: 80, 3: 100, 4: 100, 5: 100 },
      badgesUnlocked: { 1: true, 2: true, 3: true, 4: true, 5: true },
      finalExamPassed: true,
      finalExamScore: 94,
      finalExamDate: '2026-09-27T17:00:00Z',
      certificateId: 'KAPIL-PRP-2026-SIDD-5B12F',
      customNotes: {},
      feedbackSubmitted: { 1: true, 2: true, 3: true, 4: true, 5: true },
    },
    customBadges: ['Placement Ready Champion'],
  },
];

// Load Student Roster
export function getAllStudents(): StudentRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_ROSTER);
    if (!raw) {
      localStorage.setItem(STORAGE_ROSTER, JSON.stringify(SEED_STUDENTS));
      return SEED_STUDENTS;
    }
    const parsed: StudentRecord[] = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_ROSTER, JSON.stringify(SEED_STUDENTS));
      return SEED_STUDENTS;
    }
    return parsed;
  } catch {
    return SEED_STUDENTS;
  }
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
        id: user.id || `stud-${Date.now()}`,
        name: user.name,
        email: user.email,
        rollNo: `22JIETCS${String(students.length + 1).padStart(3, '0')}`,
        avatar: user.avatar,
        loginProvider: 'Google Auth',
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
    'Roll No',
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
      escapeCSV(s.rollNo || 'N/A'),
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
    'Roll No',
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
      escapeCSV(s.rollNo || 'N/A'),
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
