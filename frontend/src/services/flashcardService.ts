import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import type { FlashCardSet, ApiResponse } from "../types";

const getAllFlashCardSets = async (): Promise<ApiResponse<FlashCardSet[]>> => {
  try {
    const response = await axiosInstance.get<ApiResponse<FlashCardSet[]>>(
      API_PATHS.FLASHCARDS.GET_ALL_SETS
    );
    return response.data;
  } catch (error: unknown) {
    throw (
      (error as { response?: { data?: unknown } }).response?.data || {
        message: "An error occurred while fetching flashcard sets.",
      }
    );
  }
};

const getFlashCardsByDocument = async (
  documentId: string
): Promise<ApiResponse<FlashCardSet[]>> => {
  try {
    const response = await axiosInstance.get<ApiResponse<FlashCardSet[]>>(
      API_PATHS.FLASHCARDS.GET_BY_DOCUMENT(documentId)
    );
    return response.data;
  } catch (error: unknown) {
    throw (
      (error as { response?: { data?: unknown } }).response?.data || {
        message: "An error occurred while fetching flashcards.",
      }
    );
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const reviewFlashCard = async (cardId: string, index: number): Promise<ApiResponse<FlashCardSet>> => {
  try {
    const response = await axiosInstance.put<ApiResponse<FlashCardSet>>(
      API_PATHS.FLASHCARDS.REVIEW(cardId)
    );
    return response.data;
  } catch (error: unknown) {
    throw (
      (error as { response?: { data?: unknown } }).response?.data || {
        message: "An error occurred while reviewing the flashcard.",
      }
    );
  }
};

const toggleStarFlashCard = async (cardId: string): Promise<ApiResponse<FlashCardSet>> => {
  try {
    const response = await axiosInstance.put<ApiResponse<FlashCardSet>>(
      API_PATHS.FLASHCARDS.TOGGLE_STAR(cardId)
    );
    return response.data;
  } catch (error: unknown) {
    throw (
      (error as { response?: { data?: unknown } }).response?.data || {
        message: "An error occurred while toggling star status.",
      }
    );
  }
};

const deleteFlashCardSet = async (setId: string): Promise<ApiResponse<void>> => {
  try {
    const response = await axiosInstance.delete<ApiResponse<void>>(
      API_PATHS.FLASHCARDS.DELETE_SET(setId)
    );
    return response.data;
  } catch (error: unknown) {
    throw (
      (error as { response?: { data?: unknown } }).response?.data || {
        message: "An error occurred while deleting the flashcard set.",
      }
    );
  }
};

const flashcardService = {
  getAllFlashCardSets,
  getFlashCardsByDocument,
  reviewFlashCard,
  toggleStarFlashCard,
  deleteFlashCardSet,
};

export default flashcardService;
