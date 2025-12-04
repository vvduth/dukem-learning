/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Sparkle, BookOpen, Lightbulb } from "lucide-react";
import aiService from "../../services/aiService";
import toast from "react-hot-toast";
import MarkdownRenderer from "../common/MarkdownRenderer";
import Modal from "../common/Modal";

const AIActions = () => {
  const { id: documentId } = useParams<{ id: string }>();
  const [loadingAction, setLoadingAction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [concept, setConcept] = useState("");

  const handleGenerateSummary = async () => {
    setLoadingAction("summary");
    try {
      const response = await aiService.generateSummary(documentId!);
      setModalTitle("Generated Summary");
      setModalContent(response);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error generating summary:", error);
      toast.error("Failed to generate summary.");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleExplainConcept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!concept.trim()) {
      toast.error("Please enter a concept to explain.");
      return;
    }
    setLoadingAction("explain");
    try {
      const {
        explanation,
        concept: conceptAnswer,
        relevantChunks,
      } = await aiService.explainConcept(documentId!, concept);
      setModalTitle(`Explanation of: ${conceptAnswer}`);
      setModalContent(explanation);
      setIsModalOpen(true);
      setConcept("");
    } catch (error) {
      console.error("Error explaining concept:", error);
      toast.error("Failed to explain concept.");
    } finally {
      setLoadingAction(null);
    }
  };
  return (
    <>
      <div
        className="bg-white/80 backdrop-blur-xl border border-slate-200/60 
        rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden"
      >
        {/* header */}
        <div
          className="px-6 py-5 border-b border-slate-200/60 bg-linear-to-br
            from-slate-50/50  to-white/50 "
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl bg-linear-to-br from-violet-500 to-fuchsia-500
                    shadow-lg shadow-fuchsia-500/25 flex items-center justify-center"
            >
              <Sparkle className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                AI Assistant
              </h3>
              <p className="text-xs text-slate-500">Powered by advance AI </p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-6">
          {/* generate summary */}
          <div className="group p-5 bg-linear-to-br from-slate-50/50 to-white
          rounded-xl border border-slate-200/60 hover:border-slate-300/60
          hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-100 to-cyan-100
                  flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-sky-600" strokeWidth={2} />
                  </div>
                  <h4 className="font-semibold text-slate-900">Generate summary</h4>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Generate a concise summary of the document content.
                </p>
              </div>
              <button
                onClick={handleGenerateSummary}
                disabled={loadingAction === "summary"}
                className="shrink-0 h-10 px-5 bg-linear-to-r
                from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600
                text-white text-sm font-semibold rounded-xl transition-all
                duration-200 shadow-lg shadow-cyan-500/30 disabled:opacity-50
                disabled:cursor-not-allowed"
              >
                {loadingAction === "summary" ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white 
                    rounded-full animate-spin" />
                    Generating...
                  </span>
                ) : (
                  "Generate Summary"
                )}
              </button>
            </div>
          </div>

          {/* explain concept */}
          <div className="group p-5 bg-linear-to-br from-slate-50/50 to-white rounded-xl 
          border border-slate-200/60 hover:border-slate-300/60 
          hover:shadow-md transition-all duration-200">
            <form onSubmit={handleExplainConcept}>
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-linear-to-br from-yellow-100 to-amber-100
                    flex items-center justify-center">
                        <Lightbulb className="w-5 h-5 text-amber-600 mb-2" strokeWidth={2} />
                    </div>
                    <h4 className="font-semibold text-slate-900">
                        Explain a Concept
                    </h4>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    Enter a concept from the document that you would like to understand better.
                </p>
                <div className="flex items-center gap-3">
                    <input type="text" 
                    value={concept}
                    onChange={(e) => setConcept(e.target.value)}
                    placeholder="E.g., Photosynthesis, Quantum Mechanics..."
                    className="flex-1 h-11 px-4 border-2 border-slate-200 rounded-xl
                    bg-slate-50/50 text-slate-900 placeholder-slate-400 text-sm font-medium
                    transition-all duration-200 focus:outline-none focus:border-violet-500
                    focus:bg-white focus:shadow-lg focus:shadow-violet-500/10"
                    disabled={loadingAction === "explain"}
                    />
                    <button type="submit"
                    className="shrink-0 h-11 px-5 bg-linear-to-r
                    from-violet-700 to-violet-800 hover:from-violet-800 hover:to-violet-900
                    text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg
                    shadow-violet-500/25 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                    disabled={loadingAction === "explain" || !concept.trim()}
                    >
                      {
                        loadingAction === "explain" ? (
                            <span className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white 
                                rounded-full animate-spin" />
                                Explaining...
                            </span>
                        ) : (
                            "Explain Concept"
                        )
                      }
                    </button>
                </div>
            </form>
          </div>
        </div>
      </div>

      {/* result modal */}
      <Modal 
      
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalTitle}
      >
        <div className="max-h-[60vh] overflow-y-auto prose prose-sm
        max-w-none prose-slate">
          <MarkdownRenderer content={modalContent} />
        </div>
      </Modal>
    </>
  );
};

export default AIActions;
