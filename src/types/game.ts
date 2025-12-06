export type Language = 'html' | 'css' | 'javascript' | 'ds' | 'dbms' | 'python';

export interface Level {
  id: number;
  language: Language;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  xpReward: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  bestScore?: number;
}

export interface Question {
  id: string;
  type: 'mcq' | 'code-output' | 'fill-blank' | 'bug-fix';
  question: string;
  code?: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  hint: string;
  difficulty: number;
  topic: string;
}

export interface UserProgress {
  totalXP: number;
  currentLevel: number;
  completedLevels: number[];
  badges: Badge[];
  streak: number;
  weakTopics: string[];
  strongTopics: string[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: Date;
}

export interface GameSession {
  levelId: number;
  startedAt: Date;
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  correctAnswers: number;
  wrongAnswers: number;
  hintsUsed: number;
}

export interface TutorMessage {
  id: string;
  role: 'tutor' | 'user';
  content: string;
  timestamp: Date;
  isVoice?: boolean;
}

export const LANGUAGE_LEVELS: Record<Language, { start: number; end: number; name: string; color: string }> = {
  html: { start: 0, end: 3, name: 'HTML', color: 'from-orange-500 to-red-500' },
  css: { start: 4, end: 7, name: 'CSS', color: 'from-blue-500 to-cyan-500' },
  javascript: { start: 8, end: 10, name: 'JavaScript', color: 'from-yellow-500 to-amber-500' },
  ds: { start: 11, end: 15, name: 'Data Structures', color: 'from-green-500 to-emerald-500' },
  dbms: { start: 16, end: 18, name: 'DBMS', color: 'from-purple-500 to-violet-500' },
  python: { start: 19, end: 25, name: 'Python', color: 'from-blue-600 to-indigo-600' },
};
