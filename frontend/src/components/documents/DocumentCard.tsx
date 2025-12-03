/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Trash2,
  BookOpen,
  Download,
  BrainCircuit,
  Clock,
} from "lucide-react";
import type { Document } from "../../types";
import moment from "moment";

// helper function to format gile size
const formatFileSize = (bytes: number) => {
  if (bytes === undefined || bytes === null) return "N/A";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

const DocumentCard = ({
  document,
  onDelete,
}: {
  document: Document;
  onDelete: (document: Document) => void;
}) => {
  const navigate = useNavigate();

  const handeNavigate = () => {
    navigate(`/documents/${document._id}`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(document);
  };

  return (
    <div
      className="group relative bg-white/80 backdrop-blur-xl border border-slate-200/60
    rounded-2xl p-5 hover:border-slate-300/60 hover:shadow-slate-200/50 transition-all duration-300
    flex flex-col justify-between cursor-pointer hover:-translate-y-1"
      onClick={handeNavigate}
    >
      {/* header */}
      <div>
        <div className="flex items-start justify-between mb-4 gap-3">
          <div
            className="shrink-0 w-12 h-12 bg-linear-to-br from-violet-500 to-cyan-500
          rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/30
          group-hover:scale-110 transition-transform duration-300"
          >
            <FileText className="w-6 h-6 text-white" strokeWidth={2} />
          </div>
          <button
            onClick={handleDelete}
            className="opcacity-0 group-hover:opacity-100 w-8 h-8
          items-center justify-center text-slate-400 hover:text-red-500
          hover:bg-red-100 rounded-lg transition-all duration-200"
          >
            <Trash2 className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>
        {/* title */}
        <h3
          className="text-base font-semibold text-slate-900 truncate mb-2"
          title={document.title}
        >
          {document.title}
        </h3>

        {/* document info */}
        <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
          {document.fileSize !== undefined && (
            <>
              <span className="font-medium">
                {formatFileSize(document.fileSize)}
              </span>
            </>
          )}
        </div>
        {/* stats section */}
        <div className="flex items-center gap-3">
          {document.flashcardCount !== undefined && (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-purple-50 rounded-lg">
              <BookOpen className="w-3.5 h-3.5 text-violet-600" strokeWidth={2.5} />
              <span className="text-xs font-semibold text-violet-700">{document.flashcardCount} Flashcards</span>
            </div>
          )}
          {document.quizCount !== undefined && (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 rounded-lg">
              <BrainCircuit className="w-3.5 h-3.5 text-emerald-600" strokeWidth={2.5} />
              <span className="text-xs font-semibold text-emerald-700">{document.quizCount} Quizzes</span>
            </div>
          )}
        </div>
      </div>
      {/* footer section */}
      <div className="mt-5 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Clock className="w-3.5 h-3.5" strokeWidth={2} />
          <span>Upload {moment(document.createdAt).fromNow()}</span>
        </div>
      </div>
      {/* hover indicator */}
      <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-violet-500/0 to-cyan-500/0
      group-hover:from-violet-500/5 group-hover:to-cyan-500/5 transition-all duration-300
      pointer-events-none" />
    </div>
  );
};

export default DocumentCard;
