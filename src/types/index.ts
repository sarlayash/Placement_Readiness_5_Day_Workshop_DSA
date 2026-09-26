export interface Question {
  id: string;
  topicCode: string; // T1 to T10
  day: number; // 1 to 5
  number?: number;
  name: string;
  type: 'inclass' | 'postclass';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  inputFormat: string;
  outputFormat: string;
  sampleInput: string;
  sampleOutput: string;
  constraints: string[];
  kapilIntuition: string; // Kapil's strategic algorithmic advice
  timeComplexity: string;
  spaceComplexity: string;
  hackerRankUrl: string;
  completed?: boolean;
}

export interface Topic {
  code: string; // T1 .. T10
  name: string;
  day: number;
  part: 1 | 2;
  module: 'Technical';
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

export interface UserProgress {
  completedQuestionIds: string[];
  dayPreAssessmentPassed: Record<number, boolean>;
  dayPostAssessmentPassed: Record<number, boolean>;
  dayPreAssessmentScores: Record<number, number>;
  dayPostAssessmentScores: Record<number, number>;
  badgesUnlocked: Record<number, boolean>;
  finalExamPassed: boolean;
  finalExamScore: number;
  finalExamDate: string | null;
  certificateId: string | null;
  customNotes: Record<string, string>;
}
