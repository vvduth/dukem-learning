
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import type { AIChatResponse, AIExplanationResponse } from "../types";

export const generateFlashcards = async (
  documentId: string,
  {numQuestions, title}: {numQuestions: number, title?: string}
) => {
  try {
    const reponse = await axiosInstance.post(API_PATHS.AI.GENERATE_FLASHCARDS, {
      documentId,
      numQuestions,
      title,
    });
    return reponse.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "An error occurred while generating flashcards.",
      }
    );
  }
};

const generateQuiz = async (
  documentId: string,
  options: Record<string, unknown>
) => {
  try {
    const response = await axiosInstance.post(API_PATHS.AI.GENERATE_QUIZ, {
      documentId,
      ...options,
    });
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "An error occurred while generating the quiz.",
      }
    );
  }
};

const generateSummary = async (documentId: string) => {
  try {
    const response = await axiosInstance.post(API_PATHS.AI.GENERATE_SUMMARY, {
      documentId,
    });
    return response.data?.data as string;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "An error occurred while generating the summary.",
      }
    );
  }
};

const chat = async (documentId: string, message: string) : Promise<AIChatResponse> => {
    try {
        const response = await axiosInstance.post(API_PATHS.AI.CHAT, {
            documentId,
            question: message,  // removed history from payload
        });
        return response.data?.data;
    } catch (error) {
        throw (
            error.response?.data || {
                message: "An error occurred while chatting.",
            }
        );
    }
}

const explainConcept = async (documentId: string, concept: string) => {
    try {
        const response = await axiosInstance.post(API_PATHS.AI.EXPLAIN_CONCEPT, {
            documentId,
            concept,
        });
        return response.data?.data as AIExplanationResponse;
    } catch (error) {
        throw (
            error.response?.data || {
                message: "An error occurred while explaining the concept.",
            }
        );
    }
}

const getChatHistory = async (documentId: string) => {
    try {
        const response = await axiosInstance.get(API_PATHS.AI.CHAT_HISTORY(documentId));
        return response.data?.data;
    } catch (error) {
        throw (
            error.response?.data || {
                message: "An error occurred while fetching chat history.",
            }
        );
    }
}

const aiService = {
    generateFlashcards,
    generateQuiz,
    generateSummary,
    chat,
    explainConcept,
    getChatHistory,
}

export default aiService;