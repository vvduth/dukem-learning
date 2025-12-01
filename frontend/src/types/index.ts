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
  chunk: DocumentChunk[];
  uploadDate: string;
  lastAccessed: string;
  status: 'processing' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
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
  difficulty: 'easy' | 'medium' | 'hard';
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
  relevantChunks: number[];
  _id: string;
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
