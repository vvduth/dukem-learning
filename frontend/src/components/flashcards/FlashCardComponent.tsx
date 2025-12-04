/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import type { FlashCardSet, FlashCardItem } from "../../types";
import { Star, RotateCcw } from "lucide-react";
const FlashCardComponent = ({
  flashCard,
  onToggleStar,
}: {
  flashCard: FlashCardItem;
  onToggleStar: (cardId: string) => void;
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };
  return (
    <div
      className="relative w-full h-72"
      style={{
        perspective: "1000px",
      }}
    >
      <div
        className={`relative w-full h-64 
        transition-transform duration-500 transform-gpu cursor-pointer
         ${isFlipped ? "rotate-y-180" : ""}`}
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
        onClick={handleFlip}
      >
        {/* front of the card */}
        <div
          className="absolute inset-0 w-full h-full bg-white/80 backdrop-blur-xl border-2
          border-slate-200/60 rounded-2xl shadow-xl shadow-slate-300/20 p-8 flex flex-col justify-between"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          {/* star button */}
          <div className="flex items-start justify-between">
            <div
              className="bg-slate-100 text-[10px] text-slate-600 rounded px-4
            py-1 uppercase"
            >
              {flashCard?.difficulty || "N/A"}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleStar(flashCard._id);
              }}
              className={`w-9 h-9 flex items-center justify-center transition-all duration-200
                ${
                  flashCard.isStarred
                    ? "bg-linear-to-br from-amber-400 to-yellow-500 shadow-lg shadow-amber-300/50"
                    : "bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-amber-500"
                }`}
            >
              <Star
                className="w-4 h-4"
                fill={flashCard.isStarred ? "currentColor" : "none"}
                strokeWidth={2}
              />
            </button>
          </div>
          {/* question content */}
          <div className="flex-1 flex items-center justify-center px-4 py-6">
            <p className="text-lg font-semibold text-slate-900 text-center leading-relaxed">
              {flashCard.question}
            </p>
          </div>
          {/* flip indicator */}
          <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
            <RotateCcw className="w-3.5 h-3.5" strokeWidth={2} />
            <span>Click to flip</span>
          </div>
        </div>

        {/* back of the card */}
        <div
          className="absolute inset-0 w-full h-full 
          bg-linear-to-br from-violet-500 to-fuchsia-500
           border-2 border-violet-400/60 rounded-2xl shadow-xl 
           shadow-violet-500/30 p-8 flex flex-col justify-between"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {/* star button */}
          <div className="flex items-start justify-between rounded">
            <div
              className="bg-slate-100 text-[10px] text-slate-600 rounded px-4
            py-1 uppercase"
            >
              {flashCard?.difficulty || "N/A"}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleStar(flashCard._id);
              }}
              className={`w-9 h-9 flex items-center justify-center transition-all duration-200
                ${
                  flashCard.isStarred
                    ? "bg-linear-to-br from-amber-400 to-yellow-500 shadow-lg shadow-amber-300/50"
                    : "bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-amber-500"
                }`}
            >
              <Star
                className="w-4 h-4"
                fill={flashCard.isStarred ? "currentColor" : "none"}
                strokeWidth={2}
              />
            </button>
          </div>

          {/* answer content */}
          <div className="flex-1 flex items-center justify-center px-4 py-6">
            <p className="text-base text-white text-center leading-relaxed">
              {flashCard.answer}
            </p>
          </div>
          {/* flip indicator */}
          <div className="flex items-center justify-center gap-2 text-xs text-white/70 font-medium">
            <RotateCcw className="w-3.5 h-3.5" strokeWidth={2} />
            <span>Click to flip</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashCardComponent;
