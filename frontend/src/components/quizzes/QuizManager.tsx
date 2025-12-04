/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import quizService from "../../services/quizService";
import aiService from "../../services/aiService";
import Spiner from "../common/Spiner";
import Button from "../common/Button";
import Modal from "../common/Modal";
import QuizCard from "./QuizCard";
import type { Quiz } from "../../types";
import EmptyState from "../common/EmptyState";

const QuizManager = ({ documentId }: { documentId: string }) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [generating, setGenerating] = useState(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [numQuestions, setNumQuestions] = useState(5);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const data = await quizService.getQuizzesByDocument(documentId);
      setQuizzes(data.data);
    } catch (error) {
      console.error( error);
      toast.error(error.message || "Failed to load quizzes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, [documentId]);

  const handleGenerateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    try {
        await aiService.generateFlashcards(documentId, { numQuestions});
        toast.success("Quiz generated successfully.");
        setIsGenerateModalOpen(false);
        fetchQuizzes();
    } catch (error) {
        toast.error(error.message || "Failed to generate quiz.");
        console.error(error.message || "Failed to generate quiz.");
    } finally {
        setGenerating(false);
    }
  }

  const handleDeleteRequest = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setIsDeleteModalOpen(true);
  }

  const handleConfirmDelete = async () => {

  }

  const renderQuizContent = () => {
    if (loading) {
        return <Spiner />;
    }

    if (quizzes.length === 0) {
        return (
            <EmptyState
                title = "No Quizzes Found"
                description = "Generate quizzes based on the document content to test your knowledge."

            />
        )
    }
    return "Coming Soon!";
  }

  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-6">
        <div className="flex justify-end gap-2 mb-4">
            <Button variant="primary" onClick={() => setIsGenerateModalOpen(true)}>
                <Plus size={16} />
                Generate Quiz
            </Button>
        </div>
        {renderQuizContent()}
    </div>
  )
};

export default QuizManager;
