import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import type { Quiz, ApiResponse } from "../types";

interface QuizAnswer {
  questionIndex: number;
  selectedAnswer: string;
}

interface QuizSubmitResponse {
  quizId: string;
  score: number;
  correctCount: number;
  totalQuestions: number;
  percentage: number;
  userAnswers: Array<{
    questionIndex: number;
    selectedAnswer: string;
    isCorrect: boolean;
    answeredAt: string;
  }>;
}

interface QuizResultDetail {
  questionIndex: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  selectedAnswer: string | null;
  isCorrect: boolean;
}

interface QuizResultResponse {
  quiz: {
    id: string;
    title: string;
    document: unknown;
    score: number;
    totalQuestions: number;
    completedAt: string;
  };
  results: QuizResultDetail[];
}

const getQuizzesByDocument = async (documentId: string): Promise<ApiResponse<Quiz[]>> => {
  try {
    const response = await axiosInstance.get<ApiResponse<Quiz[]>>(
      API_PATHS.QUIZZES.GET_BY_DOCUMENT(documentId)
    );
    return response.data;
  } catch (error: unknown) {
    throw (
      (error as { response?: { data?: unknown } }).response?.data || {
        message: "An error occurred while fetching quizzes.",
      }
    );
  }
};

const getQuizById = async (id: string): Promise<ApiResponse<Quiz>> => {
  try {
    const response = await axiosInstance.get<ApiResponse<Quiz>>(
      API_PATHS.QUIZZES.GET_BY_ID(id)
    );
    return response.data;
  } catch (error: unknown) {
    throw (
      (error as { response?: { data?: unknown } }).response?.data || {
        message: "An error occurred while fetching the quiz.",
      }
    );
  }
};

const submitQuiz = async (
  id: string,
  answers: QuizAnswer[]
): Promise<ApiResponse<QuizSubmitResponse>> => {
  try {
    const response = await axiosInstance.post<ApiResponse<QuizSubmitResponse>>(
      API_PATHS.QUIZZES.SUBMIT(id),
      { answers }
    );
    return response.data;
  } catch (error: unknown) {
    throw (
      (error as { response?: { data?: unknown } }).response?.data || {
        message: "An error occurred while submitting the quiz.",
      }
    );
  }
};

const getQuizResults = async (id: string): Promise<ApiResponse<QuizResultResponse>> => {
  try {
    const response = await axiosInstance.get<ApiResponse<QuizResultResponse>>(
      API_PATHS.QUIZZES.GET_RESULTS(id)
    );
    return response.data;
  } catch (error: unknown) {
    throw (
      (error as { response?: { data?: unknown } }).response?.data || {
        message: "An error occurred while fetching quiz results.",
      }
    );
  }
};

const deleteQuiz = async (id: string): Promise<ApiResponse<void>> => {
  try {
    const response = await axiosInstance.delete<ApiResponse<void>>(
      API_PATHS.QUIZZES.DELETE(id)
    );
    return response.data;
  } catch (error: unknown) {
    throw (
      (error as { response?: { data?: unknown } }).response?.data || {
        message: "An error occurred while deleting the quiz.",
      }
    );
  }
};

const quizService = {
  getQuizzesByDocument,
  getQuizById,
  submitQuiz,
  getQuizResults,
  deleteQuiz,
};

export default quizService;
