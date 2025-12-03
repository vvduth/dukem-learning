 export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface User {
  _id: string;
  username: string;
  email: string;
  profileImage?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentChunk {
  content: string;
  pageNumber: number;
  chunkIndex: number;
  _id: string;
}

export interface Document {
  _id: string;
  userId: string;
  title: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  extractedText: string;
  chunks: DocumentChunk[];
  uploadDate: string;
  lastAccessed: string;
  status: 'processing' | 'completed' | 'failed'| 'ready';
  createdAt: string;
  updatedAt: string;
  flashcardCount?: number;
  quizCount?: number;
}

export interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  difficulty: DifficultyLevel;
  _id: string;
}

export interface UserAnswer {
  questionIndex: number;
  selectedAnswer: string;
  isCorrect: boolean;
  answerAt: string;
  _id: string;
}

export interface Quiz {
  _id: string;
  userId: string;
  documentId: string;
  title: string;
  questions: Question[];
  userAnswers: UserAnswer[];
  score: number;
  totalQuestions: number;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FlashCardItem {
  question: string;
  answer: string;
  difficulty: DifficultyLevel
  lastReviewed?: string | null;
  reviewCount: number;
  isStarred: boolean;
  _id: string;
}

export interface FlashCard {
  _id: string;
  userId: string;
  documentId: string;
  cards: FlashCardItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  relevantChunks?: number[];
  _id?: string;
}

export interface AIChatResponse {
  question : string;
  answer: string;
  relevantChunks: number[];
  chatHistoryId: ChatHistory['_id'];
}

export interface ChatHistory {
  _id: string;
  userId: string;
  documentId: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

// Generic API Response
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  statusCode?: number;
}

// Auth Responses
export interface AuthResponse {
  user: User;
  token: string;
}


export interface DashboardOverview {
  totalDocuments: number;
  totalFlashCardSets: number;
  totalFlashCards: number;
  reviewedFlashCards: number;
  starredFlashCards: number;
  totalQuizzes: number;
  completedQuizzes: number;
  averageScore: number;
  studyStreak: number;
}

export interface DashboardRecentDocument {
  _id: string;
  title: string;
  fileName: string;
  status: string;
  lastAccessed: string;
}

export interface DashboardRecentQuiz {
  _id: string;
  title: string;
  score: number;
  totalQuestions: number;
  completedAt: string;
  lastAttempted?: string;
}

export interface DashboardRecentActivity {
  documents: DashboardRecentDocument[];
  quizzes: DashboardRecentQuiz[];
}

export interface DashboardData {
  overview: DashboardOverview;
  recentActivity: DashboardRecentActivity;
}

export interface DashboardProgressData {
  overview: DashboardOverview;
  recentActivity: DashboardRecentActivity;
}