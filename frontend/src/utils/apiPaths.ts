export const BASE_URL =  "http://localhost:5000/api";

export const API_PATHS = {
  // Auth routes
  AUTH: {
    REGISTER: `${BASE_URL}/auth/register`,
    LOGIN: `${BASE_URL}/auth/login`,
    PROFILE: `${BASE_URL}/auth/profile`,
    UPDATE_PROFILE: `${BASE_URL}/auth/profile`,
    CHANGE_PASSWORD: `${BASE_URL}/auth/change-password`,
  },

  // Document routes
  DOCUMENTS: {
    UPLOAD: `${BASE_URL}/documents/upload`,
    GET_ALL: `${BASE_URL}/documents`,
    GET_BY_ID: (id : string) => `${BASE_URL}/documents/${id}`,
    UPDATE: (id: string) => `${BASE_URL}/documents/${id}`,
    DELETE: (id: string) => `${BASE_URL}/documents/${id}`,
  },

  // Flashcard routes
  FLASHCARDS: {
    GET_ALL_SETS: `${BASE_URL}/flashcards`,
    GET_BY_DOCUMENT: (documentId: string) => `${BASE_URL}/flashcards/${documentId}`,
    REVIEW: (cardId: string) => `${BASE_URL}/flashcards/${cardId}/review`,
    TOGGLE_STAR: (cardId: string) => `${BASE_URL}/flashcards/${cardId}/star`,
    DELETE_SET: (setId: string) => `${BASE_URL}/flashcards/${setId}`,
  },

  // AI routes
  AI: {
    BASE: `${BASE_URL}/ai`,
    GENERATE_FLASHCARDS: `${BASE_URL}/ai/generate-flashcards`,
    GENERATE_QUIZ: `${BASE_URL}/ai/generate-quiz`,
    GENERATE_SUMMARY: `${BASE_URL}/ai/generate-summary`,
    CHAT: `${BASE_URL}/ai/chat`,
    EXPLAIN_CONCEPT: `${BASE_URL}/ai/explain-concept`,
    CHAT_HISTORY: (documentId: string) => `${BASE_URL}/ai/chat-history/${documentId}`,
  },

  // Quiz routes
  QUIZZES: {
    GET_BY_DOCUMENT: (documentId: string) => `${BASE_URL}/quizzes/${documentId}`,
    GET_BY_ID: (id: string) => `${BASE_URL}/quizzes/quiz/${id}`,
    SUBMIT: (id: string) => `${BASE_URL}/quizzes/${id}/submit`,
    GET_RESULTS: (id: string) => `${BASE_URL}/quizzes/${id}/results`,
    DELETE: (id: string) => `${BASE_URL}/quizzes/${id}`,
  },

  // Progress routes
  PROGRESS: {
    DASHBOARD: `${BASE_URL}/progress/dashboard`,
  },
} as const;
