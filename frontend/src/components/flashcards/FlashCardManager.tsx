/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { useState, useEffect } from "react";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Trash2,
  ArrowLeft,
  Sparkles,
  Brain,
} from "lucide-react";
import toast from "react-hot-toast";
import moment from "moment";
import flashcardService from "../../services/flashcardService";
import aiService from "../../services/aiService";
import Spiner from "../common/Spiner";
import Modal from "../common/Modal";
import FlashCardComponent from "./FlashCardComponent";
import type { FlashCardSet } from "../../types";
const FlashCardManager = ({
  documentId,
}: {
  documentId: string | undefined;
}) => {
  const [flashCardSets, setFlashCardSets] = useState<FlashCardSet[]>([]);
  const [selectedSet, setSelectedSet] = useState<FlashCardSet | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isdeleteModalOpen, setIsdeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [setToDelete, setSetToDelete] = useState<FlashCardSet | null>(null);
  useEffect(() => {
    if (documentId) {
      fetchFlashCardSets();
    }
  }, [documentId]);
  if (!documentId) {
    return <div>No document ID provided.</div>;
  }
  const fetchFlashCardSets = async () => {
    setLoading(true);
    try {
      const response = await flashcardService.getFlashCardsByDocument(
        documentId
      );
      setFlashCardSets(response.data);
    } catch (error) {
      toast.error("Failed to load flashcard sets.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateFlashCards = async () => {
    setGenerating(true);
    try {
      await aiService.generateFlashcards(documentId);
      toast.success("Flashcards generated successfully.");
      fetchFlashCardSets();
    } catch (error) {
      toast.error("Failed to generate flashcards.");
      console.error(error);
    } finally {
      setGenerating(false);
    }
  };

  const handleNextCard = () => {
    if (selectedSet) {
      handleReview(currentCardIndex);
      setCurrentCardIndex(
        (prevIndex) => (prevIndex + 1) % selectedSet.cards.length
      );
    }
  };

  const handlePrevCard = () => {
    if (selectedSet) {
      handleReview(currentCardIndex);
      setCurrentCardIndex(
        (prevIndex) =>
          (prevIndex - 1 + selectedSet.cards.length) % selectedSet.cards.length
      );
    }
  };

  const handleReview = async (cardIndex: number) => {
    const currentCard = selectedSet?.cards[currentCardIndex];
    if (!currentCard) return;
    try {
      await flashcardService.reviewFlashCard(currentCard._id, cardIndex);
      toast.success("Flashcard reviewed.");
    } catch (error) {
      console.error("Failed to review flashcard:", error);
    }
  };

  const handleToggleStar = async (cardId: string) => {};

  const handleDeleteRequest = (e: React.MouseEvent, set: FlashCardSet) => {
    e.stopPropagation();
    setSetToDelete(set);
    setIsdeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {};

  const handleSelectSet = (set: FlashCardSet) => {
    setSelectedSet(set);
    setCurrentCardIndex(0);
  };

  const renderFlashCardSets = () => {
    return "FlashCard Sets List";
  };

  const renderFlashCardViewer = () => {
    return "FlashCard Viewer Details";
  };

  const renderSetList = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-20">
          <Spiner />
        </div>
      );
    }

    if (flashCardSets.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 px-16">
          <div
            className="inline-flex items-center justify-center w-16 h-16
        rounded-2xl bg-linear-to-br from-violet-100 to-rose-100 mb-6"
          >
            <Brain className="w-8 h-8 text-violet-600" strokeWidth={2} />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            No flashcard sets found for this document.
          </h3>
          <p className="text-sm text-slate-500 mb-8 text-center max-w-sm">
            Generate flashcards to help you review and retain key information
            from your document.
          </p>
          <button
            onClick={handleGenerateFlashCards}
            disabled={generating}
            className="group inline-flex items-center gap-2 px-6 h-12 bg-linear-to-r
          from-violet-500 to-rose-500 hover:from-violet-600 hover:to-rose-600
          text-white font-semibold text-sm rounded-xl transition-all duration-200
          shadow-lg shadow-violet-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
          disabled:active:scale-100"
          >
            {generating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white animate-spin rounded-full" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" strokeWidth={2} />
                Generate Flashcards
              </>
            )}
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* header with generate button */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Your flashcard sets
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              {flashCardSets.length} sets available. Click on a set to view the
              flashcards.
            </p>
          </div>
          <button
            onClick={handleGenerateFlashCards}
            disabled={generating}
            className="group inline-flex items-center gap-2 px-5 h-11 bg-linear-to-r
            from-violet-500 to-rose-500 hover:from-violet-600 hover:to-rose-600
            text-white font-semibold text-sm rounded-xl transition-all duration-200
            shadow-lg shadow-violet-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? (
              <>
                <div
                  className="w-4 h-4 border-2 border-white/30 
                border-t-white animate-spin rounded-full"
                />
                Generating...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" strokeWidth={2} />
                Generate New Set
              </>
            )}
          </button>
        </div>
        {/* flashcard sets grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {flashCardSets.map((set) => (
            <div
              key={set._id}
              onClick={() => handleSelectSet(set)}
              className="group relative bg-white/80 backdrop-blur-xl
              border-2 border-slate-200 hover:border-violet-300
              rounded-2xl p-6 coursor-pointer transition-all duration-200
              hover:shadow-lg hover:shadow-violet-500/10"
            >
              {/* delete button */}
              <button
                onClick={(e) => handleDeleteRequest(e, set)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-rose-500
              hover:bg-rose-50 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-4 h-4" strokeWidth={2} />
              </button>

              {/* set content */}
              <div className="space-y-4">
                <div
                  className="inline-flex items-center justify-center w-12 h-12 rounded-xl
                bg-linear-to-br from-violet-100 to-rose-100 mb-2"
                >
                  <Brain className="w-6 h-6 text-violet-600" strokeWidth={2} />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-slate-900 mb-1">
                    Flashcard Set
                  </h4>
                  <p
                    className="text-xs font-medium text-slate-500 uppercase
                  tracking-wide"
                  >
                    Created {moment(set.createdAt).fromNow()} &middot;{" "}
                    {set.cards.length} cards
                  </p>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <div className="px-3 py-1.5 bg-violet-50 border border-violet-200 rounded-lg">
                    <span className="text-sm font-semibold text-violet-700">
                      {set.cards.length} {" cards"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  return (
    <>
      <div
        className="bg-white/80 backdrop-blur-xl
    border border-slate-200/60 rounded-3xl shadow-xl shadow-slate-200/50
    p-8"
      >
        {selectedSet ? renderFlashCardViewer() : renderSetList()}
      </div>
      {/* delete confirmation modal */}
      <Modal
        isOpen={isdeleteModalOpen}
        onClose={() => setIsdeleteModalOpen(false)}
        title="Are you sure?"
      >
        <div className="space-y-6">
          <p className="text-sm text-slate-600">
            Are you sure you want to delete this flashcard set? This action
            cannot be undone.
          </p>
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsdeleteModalOpen(false)}
              disabled={deleting}
              className="px-5 h-11 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium
              text-sm rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmDelete}
              disabled={deleting}
              className="px-5 h-11 bg-linear-to-r from-rose-500 to-red-500
              hover:from-rose-600 hover:to-red-600 text-white font-semibold text-sm
              rounded-xl transition-all duration-200 shadow-lg shadow-rose-500/25
              active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
              disabled:active:scale-100"
            >
              {deleting ? (
                <span className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full
                animate-spin"
                  />
                  <div>Deleting...</div>
                </span>
              ) : (
                "Delete Set"
              )}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default FlashCardManager;
