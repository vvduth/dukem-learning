import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import type { Document, ApiResponse } from "../types";

interface DocumentWithCounts extends Document {
  flashcardCount: number;
  quizCount: number;
}

const uploadDocument = async (file: File, title: string): Promise<ApiResponse<Document>> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);

    const response = await axiosInstance.post<ApiResponse<Document>>(
      API_PATHS.DOCUMENTS.UPLOAD,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error: unknown) {
    throw (
      (error as { response?: { data?: unknown } }).response?.data || {
        message: "An error occurred while uploading the document.",
      }
    );
  }
};

const getDocuments = async (): Promise<ApiResponse<Document[]>> => {
  try {
    const response = await axiosInstance.get<ApiResponse<Document[]>>(
      API_PATHS.DOCUMENTS.GET_ALL
    );
    return response.data;
  } catch (error: unknown) {
    throw (
      (error as { response?: { data?: unknown } }).response?.data || {
        message: "An error occurred while fetching documents.",
      }
    );
  }
};

const getDocumentById = async (id: string): Promise<ApiResponse<DocumentWithCounts>> => {
  try {
    const response = await axiosInstance.get<ApiResponse<DocumentWithCounts>>(
      API_PATHS.DOCUMENTS.GET_BY_ID(id)
    );
    return response.data;
  } catch (error: unknown) {
    throw (
      (error as { response?: { data?: unknown } }).response?.data || {
        message: "An error occurred while fetching the document.",
      }
    );
  }
};

const updateDocument = async (
  id: string,
  data: Partial<Document>
): Promise<ApiResponse<Document>> => {
  try {
    const response = await axiosInstance.put<ApiResponse<Document>>(
      API_PATHS.DOCUMENTS.UPDATE(id),
      data
    );
    return response.data;
  } catch (error: unknown) {
    throw (
      (error as { response?: { data?: unknown } }).response?.data || {
        message: "An error occurred while updating the document.",
      }
    );
  }
};

const deleteDocument = async (id: string): Promise<ApiResponse<void>> => {
  try {
    const response = await axiosInstance.delete<ApiResponse<void>>(
      API_PATHS.DOCUMENTS.DELETE(id)
    );
    return response.data;
  } catch (error: unknown) {
    throw (
      (error as { response?: { data?: unknown } }).response?.data || {
        message: "An error occurred while deleting the document.",
      }
    );
  }
};

const documentService = {
  uploadDocument,
  getDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
};

export default documentService;
