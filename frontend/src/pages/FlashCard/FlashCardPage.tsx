/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Plus,
  ChevronLeft,
  ChevronRight,
  X,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import flashcardService from "../../services/flashcardService";
import aiService from "../../services/aiService";
import PageHeader from "../../components/common/PageHeader";
import Spiner from "../../components/common/Spiner";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";
import Modal from "../../components/common/Modal";
import FlashCardComponent from "../../components/flashcards/FlashCardComponent";
import { useParams } from "react-router-dom";
import type { FlashCardItem, FlashCardSet } from "../../types";
import toast from "react-hot-toast";

const FlashCardPage = () => {
  const { id: documentId } = useParams<{ id: string }>();
  const [flashcardSets, setFlashcardSets] = useState<FlashCardSet[]>([]);
  const [flashcards, setFlashcards] = useState<FlashCardItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchFlashCards = async () => {
    setLoading(true);
    try {
      const response = await flashcardService.getFlashCardsByDocument(
        documentId!
      );
      console.log("FlashCards:", response.data);
      setFlashcardSets(response.data);
      setFlashcards(response.data[0]?.cards || []);
    } catch (error) {
      console.error(error.message || error);
      toast.error("Failed to fetch flashcards");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchFlashCards();
  }, [documentId]);

  const handleGenerateFlashCards = async () => {
    setGenerating(true);
    try {
      const response = await aiService.generateFlashcards(documentId!);
      toast.success("Flashcards generated successfully");
      fetchFlashCards();
    } catch (error) {
      console.error(error.message || "failed to generate flashcards");
      toast.error("Failed to generate flashcards");
    } finally {
      setGenerating(false);
    }
  };

  const handleNextCard = () => {
    handleReview(currentCardIndex);
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
  };
  const handlePrevCard = () => {
    handleReview(currentCardIndex);
    setCurrentCardIndex(
      (prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length
    );
  };

  const handleReview = async (index: number) => {
    const currentCard = flashcards[index];
    if (!currentCard) return;
    try {
      await flashcardService.reviewFlashCard(currentCard._id, index);
      toast.success("Flashcard reviewed");
    } catch (error) {
      toast.error("Failed to review flashcard");
      console.error(error.message || error);
    }
  };

  const handleTogglesStar = async (cardId: string) => {
    try {
      await flashcardService.toggleStarFlashCard(cardId);
      setFlashcards((prevCards) =>
        prevCards.map((card) =>
          card._id === cardId ? { ...card, isStarred: !card.isStarred } : card
        )
      );
      toast.success("Toggled star status updated!");
    } catch (error) {
      toast.error("Failed to toggle star status");
      console.error(error.message || error);
    }
  };

  const handleDeleteFlashCardSet = async () => {
    setDeleting(true);
    try {
      await flashcardService.deleteFlashCardSet(flashcardSets[0]._id);
      toast.success("Flashcard set deleted successfully");
      setIsDeleteModalOpen(false);
      // Redirect or update UI accordingly
    } catch (error) {
      toast.error("Failed to delete flashcard set");
      console.error(error.message || error);
    } finally {
      setDeleting(false);
    }
  };

  const renderFlashCardContent = () => {
    if (loading) {
      return <Spiner />;
    }

    if (flashcards.length === 0) {
      return (
        <EmptyState
          title="No flashcards available."
          description="Generate flashcards to start studying."
        />
      );
    }

    const currentCard = flashcards[currentCardIndex];
    return (
      <div className="flex flex-col items-center space-y-6">
        <div className="w-full max-w-lg">
          <FlashCardComponent
            flashCard={currentCard}
            onToggleStar={() => handleTogglesStar(currentCard._id)}
          />
        </div>
        <div className="flex items-center gap-4">
          <Button
            onClick={handlePrevCard}
            variant="secondary"
            disable={flashcards.length <= 1}
          >
            <ChevronLeft size={16} />
            Previous
          </Button>
          <span className="text-sm text-neutral-600">
            {currentCardIndex + 1} / {flashcards.length}
          </span>
          <Button
            onClick={handleNextCard}
            variant="secondary"
            disable={flashcards.length <= 1}
          >
            Next <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="mb-4">
        <Link
          to={`/documents/${documentId}`}
          className="inline-flex items-center gap-2 text-sm text-neutral-600
        hover:text-neutral-900 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Document
        </Link>
      </div>
      <PageHeader title="Flashcards">
        <div className="flex gap-2">
          {!loading && flashcardSets.length > 0 ? (
            <>
              <Button
                onClick={() => setIsDeleteModalOpen(true)}
                disable={deleting}
              >
                <Trash2 size={16} />
                Delete Set
              </Button>
            </>
          ) : (
            <Button onClick={handleGenerateFlashCards} disable={generating}>
              {generating ? (
                <Spiner />
              ) : (
                <>
                  <Plus size={16} /> Generate Flashcards
                </>
              )}
            </Button>
          )}
        </div>
      </PageHeader>
      {renderFlashCardContent()}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Flashcard Set"
      >
        <div className="space-y-4">
          <p className="text-sm text-neutral-600">
            Are you sure you want to delete this flashcard set? This action
            cannot be undone.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsDeleteModalOpen(false)}
              disable={deleting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteFlashCardSet}
              disable={deleting}
              className="bg-red-500 hover:bg-red-600 active:bg-red-700 focus:ring-red-300 text-white"
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FlashCardPage;
