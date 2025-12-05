/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import type { FlashCardSet } from "../../types";
import { useNavigate } from "react-router-dom";
import { Star, BookOpen, Sparkles, TrendingUp } from "lucide-react";
import moment from "moment";
import toast from "react-hot-toast";

const FlashCardSetCard = ({ flashCardSet }: { flashCardSet: FlashCardSet }) => {
  const navigate = useNavigate();
  const handleStudyNow = () => {
    navigate(`/documents/${flashCardSet.documentId._id}/flashcards`);
  };
  const reviewCount = flashCardSet.cards.filter(
    (card) => card.lastReviewed
  ).length;
  const totalCards = flashCardSet.cards.length;
  const progressPercentage =
    totalCards > 0 ? Math.round((reviewCount / totalCards) * 100) : 0;
  return (
    <div
      className="group relative bg-white/80 backdrop-blur-xl
    border-2 border-slate-200 hover:border-violet-400 rounded-2xl p-6 cursor-pointer
    transition-all duration-200 hover:shadow-lg hover:shadow-violet-500/10 flex flex-col
    justify-between"
      onClick={handleStudyNow}
    >
      <div className="space-y-4">
        {/* icon and title */}
        <div className="flex items-start gap-4">
          <div
            className="shrink-0 w-12 h-12 rounded-xl bg-linear-to-br from-violet-100 to-fuchsia-100
          flex items-center justify-center"
          >
            <BookOpen className="w-6 h-6 text-violet-600" strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className="text-base font-semibold text-slate-900 line-clamp-2 mb-1"
              title={flashCardSet?.documentId.title}
            >
              {flashCardSet?.documentId.title}
            </h3>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Created {moment(flashCardSet.createdAt).fromNow()}
            </p>
          </div>
        </div>
        {/* stats */}
        <div className="flex items-center gap-3 pt-2">
          <div className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="text-sm font-medium text-slate-700">
              {totalCards} {totalCards === 1 ? "card" : "cards"}
            </span>
          </div>
          {reviewCount > 0 && (
            <div className="flex items-center gap-1 px-3 py-1.5 bg-violet-50 border border-violet-200 rounded-lg">
              <TrendingUp
                className="w-3.5 h-3.5 text-violet-600"
                strokeWidth={2.5}
              />
              <span className="text-sm font-semibold text-violet-700">
                {progressPercentage}%
              </span>
            </div>
          )}
        </div>
        {/* progress bar */}
        {totalCards > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-600">
                Progress{" "}
              </span>
              <span className="text-xs font-semibold text-slate-700">
                {reviewCount}/{totalCards} reviewed
              </span>
            </div>
            <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-linear-to-r from-violet-400 to-fuchsia-400 rounded-full
                    transition-all duration-500 ease-out"
                style={{
                  width: `${progressPercentage}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>
      {/* study now button */}
      <div className="mt-6 pt-4 border-t border-slate-200">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleStudyNow();
          }}
          className="group/btn relative w-full h-11 bg-linear-to-r from-violet-50 to-fuchsia-50
            hover:from-violet-600 hover:to-fuchsia-600 text-violet-700 hover:text-white
            font-semibold text-sm rounded-xl transition-all duration-300 active:scale-95 overflow-hidden"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" strokeWidth={2.5} />
            Study Now
          </span>
          <div
            className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0
            -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"
          />
        </button>
      </div>
    </div>
  );
};

export default FlashCardSetCard;
