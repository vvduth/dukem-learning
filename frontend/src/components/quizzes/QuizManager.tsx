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
      console.error(error);
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
      await aiService.generateQuiz(documentId, { numQuestions });
      toast.success("Quiz generated successfully.");
      setIsGenerateModalOpen(false);
      fetchQuizzes();
    } catch (error) {
      toast.error(error.message || "Failed to generate quiz.");
      console.error(error.message || "Failed to generate quiz.");
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteRequest = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedQuiz) return;
    setDeleting(true);
    try {
        await quizService.deleteQuiz(selectedQuiz._id);
        toast.success("Quiz deleted successfully.");
        setIsDeleteModalOpen(false);
        setSelectedQuiz(null);
        setQuizzes(quizzes.filter((q) => q._id !== selectedQuiz._id));
        fetchQuizzes();
    } catch (error) {
        toast.error(error.message || "Failed to delete quiz.");
        console.error(error.message || "Failed to delete quiz.");
    } finally {
        setDeleting(false);
    }
  };

  const renderQuizContent = () => {
    if (loading) {
      return <Spiner />;
    }

    if (quizzes.length === 0) {
      return (
        <EmptyState
          title="No Quizzes Found"
          description="Generate quizzes based on the document content to test your knowledge."
        />
      );
    }
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {quizzes.map((quiz) => (
          <QuizCard
            key={quiz._id}
            quiz={quiz}
            onDelete={() => handleDeleteRequest(quiz)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-6">
      <div className="flex justify-end gap-2 mb-4">
        <Button variant="primary" onClick={() => setIsGenerateModalOpen(true)}>
          <Plus size={16} />
          Generate Quiz
        </Button>
      </div>
      {renderQuizContent()}

      {/* generate quiz */}
      <Modal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        title="Generate new quiz"
      >
        <form className="space-y-4" onSubmit={handleGenerateQuiz}>
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1.5">
              Number of Questions:
            </label>
            <input
              type="number"
              value={numQuestions}
              onChange={(e) =>
                setNumQuestions(Math.max(1, parseInt(e.target.value) || 1))
              }
              min={"1"}
              required
              className="w-full h-9 px-3 border border-neutral-200 rounded-lg
                    bg-white text-sm text-neutral-900 placeholder-neutral-400
                    transition-colors duration-150 focus:outline-none focus:ring-2 
                    focus:ring-violet-600 focus:border-transparent"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsGenerateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disable={generating}>
              {generating ? "Generating..." : "Generate"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* delete quiz confirm */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete Quiz"
      >
        <div className="space-y-4">
          <p className="text-sm text-neutral-600">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-neutral-900">{selectedQuiz?.title || "this quiz"}</span>? This
            action cannot be undone.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              disable={deleting}
            >
              Cancel
            </Button>

            <Button
              type="button"
              disable={deleting}
              variant="primary"
              onClick={handleConfirmDelete}
            >
              {deleting ? "Deleting..." : "Delete Quiz"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default QuizManager;
