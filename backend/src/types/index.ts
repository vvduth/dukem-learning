import { Types } from 'mongoose';

// Re-exporting types that are shared conceptually, but adapted for Backend (using Date/ObjectId)

export interface IUser {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password?: string;
  profileImage?: string | null;
  createdAt: Date;
  updatedAt: Date;
   matchPassword?: (enteredPassword: string) => Promise<boolean>;
}

export interface IDocumentChunk {
  content: string;
  pageNumber: number;
  chunkIndex: number;
  _id?: Types.ObjectId;
}

export interface IDocument {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  title: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  extractedText: string;
  chunk: IDocumentChunk[];
  uploadDate: Date;
  lastAccessed: Date;
  status: 'processing' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

export interface IQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  _id?: Types.ObjectId;
}

export interface IUserAnswer {
  questionIndex: number;
  selectedAnswer: string;
  isCorrect: boolean;
  answerAt: Date;
  _id?: Types.ObjectId;
}

export interface IQuiz {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  documentId: Types.ObjectId;
  title: string;
  questions: IQuestion[];
  userAnswers: IUserAnswer[];
  score: number;
  totalQuestions: number;
  completedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFlashCardItem {
  question: string;
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  lastReviewed?: Date | null;
  reviewCount: number;
  isStarred: boolean;
  _id?: Types.ObjectId;
}

export interface IFlashCard {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  documentId: Types.ObjectId;
  cards: IFlashCardItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  relevantChunks: number[];
  _id?: Types.ObjectId;
}

export interface IChatHistory {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  documentId: Types.ObjectId;
  messages: IChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}
