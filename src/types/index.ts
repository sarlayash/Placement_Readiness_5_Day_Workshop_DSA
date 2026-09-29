export type SupportedLanguage = 'c' | 'cpp' | 'java' | 'python' | 'html' | 'javascript';

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  explanation?: string;
}

export interface Question {
  id: string;
  topicCode: string; // T1 to T10
  day: number; // 1 to 5
  number?: number;
  name: string;
  type: 'inclass' | 'postclass';
  difficulty: 'Level 0' | 'Easy' | 'Medium' | 'Hard';
  description: string;
  inputFormat: string;
  outputFormat: string;
  sampleInput: string;
  sampleOutput: string;
  constraints: string[];
  kapilIntuition: string; // Kapil's strategic algorithmic advice
  interviewTips?: string[];
  timeComplexity: string;
  spaceComplexity: string;
  hackerRankUrl: string;
  testCases: TestCase[];
  starterCode: Record<SupportedLanguage, string>;
  completed?: boolean;
}

export interface Topic {
  code: string; // T1 .. T10
  name: string;
  day: number;
  part: 1 | 2;
  module: string;
  totalQuestions: number;
  durationHours: number;
  inclassCount: number;
  postclassCount: number;
  questions: Question[];
  hackerRankUrl: string;
  description: string;
  keyConcepts: string[];
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // index 0-3
  explanation: string;
  topicTag: string;
}

export interface DayAssessment {
  day: number;
  preAssessment: AssessmentQuestion[];
  postAssessment: AssessmentQuestion[];
}

export interface Badge {
  id: string;
  day: number;
  title: string;
  subtitle: string;
  iconName: string;
  criteria: string;
  unlockedAt?: string | null;
}

export interface GoogleUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  signedInAt: string;
}

export interface ProctorLog {
  timestamp: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface SolvedProgram {
  id: string; // e.g., "D1-E1", "lvl0-1"
  day: number; // 0 for Level 0, 1 to 5 for Daily Solved
  title: string;
  difficulty: 'Level 0' | 'Easy' | 'Medium' | 'Hard';
  topicTag: string;
  problemStatement: string;
  sampleInput: string;
  sampleOutput: string;
  explanation: string;
  kapilInsight: string;
  timeComplexity: string;
  spaceComplexity: string;
  solutions: Record<SupportedLanguage, string>;
  testCases: TestCase[];
}

export interface UserProgress {
  completedQuestionIds: string[];
  acknowledgedSolvedProgramIds: string[];
  levelZeroCompletedIds?: string[];
  visualizationCompletedIds?: string[];
  visualizationTries?: Record<string, number>;
  dayPreAssessmentPassed: Record<number, boolean>;
  dayPostAssessmentPassed: Record<number, boolean>;
  dayPreAssessmentScores: Record<number, number>;
  dayPostAssessmentScores: Record<number, number>;
  dayFinalExamPassed?: Record<number, boolean>;
  dayFinalExamScores?: Record<number, number>;
  dayFinalExamDates?: Record<number, string>;
  badgesUnlocked: Record<number, boolean>;
  finalExamPassed: boolean;
  finalExamScore: number;
  finalExamDate: string | null;
  certificateId: string | null;
  customNotes: Record<string, string>;
  questionCodeSnippets?: Record<string, Record<string, string>>;
  feedbackSubmitted?: Record<number, boolean>;
  feedbackSubmittedAt?: Record<number, string>;
}

export type VisualizationCategory = 'Searching' | 'Sorting' | 'Graphs' | 'Trees';

export interface AlgorithmVisualization {
  id: string;
  category: VisualizationCategory;
  name: string;
  tagline: string;
  timeComplexity: string;
  spaceComplexity: string;
  description: string;
  kapilRule: string;
  defaultInput: string;
  targetLabel?: string;
  defaultTarget?: number;
}

export type FeedbackReminderStage = 'none' | '30m' | '10m' | '5m' | 'active' | 'closed';

export interface FeedbackWindowStatus {
  isActive: boolean;
  isOpenToday: boolean;
  currentDay: number;
  isFilledToday: boolean;
  timeRemainingSec: number;
  timeUntilOpenSec: number;
  reminderStage: FeedbackReminderStage;
  reminderMessage: string;
}

export interface WheelSlice {
  id: string;
  label: string;
  bonus: number;
  penalty: number;
  color: string;
  tier: string;
}

export interface SpinningWheelMCQ {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface AptitudeMCQ {
  id: string;
  category: 'Quantitative' | 'Logical' | 'Number Theory' | 'Combinatorics' | 'Algorithmic';
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  linkedDsaProblem: {
    id: string;
    title: string;
    day: number;
    topic: string;
    conceptTieIn: string;
  };
}

export type DayLockStatus = 'default' | 'unlocked' | 'locked';

export interface StudentRecord {
  id: string;
  name: string;
  email: string;
  avatar: string;
  rollNo?: string;
  loginProvider: string;
  lastActive: string;
  registeredAt: string;
  progress: UserProgress;
  customBadges?: string[];
  customCertificates?: string[];
  dayOverrides?: Record<number, DayLockStatus>;
}


export interface AdminCustomBadge {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  color: string;
  criteria: string;
  day: number | string;
  issuedAt: string;
  recipientStudentIds: string[]; // empty means all enrolled students
}

export interface AdminCustomCertificate {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  certificateTitle: string;
  grade: 'Outstanding' | 'A+' | 'A' | 'Honours';
  issuedAt: string;
  issuedBy: string;
  verificationCode: string;
  remarks: string;
}

export interface AdminCustomAssignment {
  id: string;
  title: string;
  day: number;
  difficulty: 'Level 0' | 'Easy' | 'Medium' | 'Hard';
  topicTag: string;
  description: string;
  sampleInput: string;
  sampleOutput: string;
  kapilIntuition: string;
  timeComplexity: string;
  spaceComplexity: string;
  createdAt: string;
}

export interface AdminCustomQuiz {
  id: string;
  category: 'Day 1' | 'Day 2' | 'Day 3' | 'Day 4' | 'Day 5' | 'Aptitude' | 'Spinning Wheel' | 'Final Exam';
  question: string;
  options: [string, string, string, string];
  correctAnswer: number; // 0-3
  explanation: string;
  marks: number;
  createdAt: string;
}

