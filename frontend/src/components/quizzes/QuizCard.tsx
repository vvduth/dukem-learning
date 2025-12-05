/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import type { Quiz } from "../../types";
import { Link } from "react-router-dom";
import { Trash2, Play, BarChart2, Award } from "lucide-react";
import moment from "moment";
const QuizCard = ({
  quiz,
  onDelete,
}: {
  quiz: Quiz;
  onDelete: (quiz: Quiz) => void;
}) => {
  return (
    <div
      className="group relative bg-white/80 backdrop-blur-xl border-2
    border-slate-200 hover:border-violet-500 rounded-2xl p-4
    transition-all duration-200 shadow-sm hover:shadow-lg hover:shadow-violet-200/50
    flex flex-col justify-between"
    >
      <button
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.stopPropagation();
          onDelete(quiz);
        }}
        className="absolute top-4 right-4 text-slate-400 hover:text-red-700
        hover:bg-rose-50 rounded-lg transition-all duration-200 opacity-0
        group-hover:opacity-100"
      >
        <Trash2 className="w-4 h-4" strokeWidth={2} />
      </button>
      <div className="space-y-4">
        {/* status badge */}
        <div
          className="inline-flex items-center gap-1.5 py-1 rounded-lg text-xs
        font-semibold"
        >
          <div
            className="flex items-center gap-1 bg-violet-50 border border-violet-200
          rounded-lg px-3 py-1"
          >
            <Award className="w-3.5 h-3.5 text-violet-600" strokeWidth={2.5} />
            <span className="text-violet-700">Score: {quiz.score}</span>
          </div>
        </div>
        <div>
          <h3
            className="text-base font-semibold text-slate-900 mb-1 line-clamp-2"
            title={quiz.title}
          >
            {quiz.title || `Quiz - ${moment(quiz.createdAt).format("LLL")}`}
          </h3>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Created on {moment(quiz.createdAt).format("MMM D, YYYY")}
          </p>
        </div>
        {/* quiz info */}
        <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
          <div className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="text-sm font-semibold text-slate-700">{quiz.questions.length} Questions</span>
          </div>
        </div>
      </div>
      {/* action button */}
      <div className="mt-2 pt-4 border-t border-slate-100">
        {quiz?.userAnswers?.length > 0 ? (
          <Link to={`/quizzes/${quiz._id}/result`}>
            <button className="group/btn w-full inline-flex items-center justify-center gap-2 h-11
            bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl
            transition-all duration-200 active:scale-95 cursor-pointer">
              <BarChart2 className="" strokeWidth={2.5} />
              View results
            </button>
          </Link>
        ) : (
          <Link to={`/quizzes/${quiz._id}`}>
            <button className="group/btn w-full inline-flex items-center justify-center gap-2 h-11
            bg-linear-to-r from-violet-500 to-rose-500
            hover:from-violet-600 hover:to-rose-600 text-white
            font-semibold text-sm rounded-xl
            transition-all duration-200 active:scale-95 cursor-pointer">
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Play className="w-4 h-4" strokeWidth={2.5} />
                Start Quiz
              </span>
              <div className="absolute inset-0 bg-linear-to-r from-white/0
              via-white/20 to-white/0 -translate-x-full
              group-hover/btn:translate-x-full transition-transform duration-700"/>
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default QuizCard;
