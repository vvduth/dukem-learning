/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import quizService from "../../services/quizService";
import PageHeader from "../../components/common/PageHeader";
import Spiner from "../../components/common/Spiner";
import toast from "react-hot-toast";
import Button from "../../components/common/Button";
import type { Quiz } from "../../types";
const QuizTakePage = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      setLoading(true);
      try {
        const response = await quizService.getQuizById(quizId!);
        setQuiz(response.data);
      } catch (error) {
        console.error("Error fetching quiz:", error);
        toast.error("Failed to load quiz. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId]);

  const handleOptionChange = (questionId: string, optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz?.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    setSubmitting(true);
    try {
      const formattedAnswers = Object.keys(selectedAnswers).map((questionId) => {
        const question = quiz?.questions.find((q) => q._id === questionId);
        const questionIndex = quiz?.questions.findIndex((q) => q._id === questionId);
        const optionIndex = selectedAnswers[questionId];
        const selectedAnswer =  question?.options[optionIndex];
        return {
          questionIndex, selectedAnswer
        }
      })
      await quizService.submitQuiz(quizId!, formattedAnswers);
      toast.success("Quiz submitted successfully!");
      navigate(`/quizzes/${quizId}/result`);
    } catch (error) {
      toast.error("Failed to submit quiz. Please try again.");
      console.error("Error submitting quiz:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spiner />
      </div>
    );
  }

  if (!quiz || quiz.questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-slate-600 text-lg">
            No quiz available or has no questions.
          </p>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isAnswered = selectedAnswers.hasOwnProperty.call(currentQuestion._id);
  const answeredCount = Object.keys(selectedAnswers).length;
  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader title={quiz.title || "Take Quiz"} />
      {/* progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-slate-700">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </span>
          <span className="text-sm font-semibold text-slate-500">
            {" - "} {answeredCount} answered
          </span>
        </div>
        <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-linear-to-r from-violet-500 to-fuchsia-500
            rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${
                ((currentQuestionIndex + 1) / quiz.questions.length) * 100
              }%`,
            }}
          />
        </div>
      </div>
      {/* question card */}
      <div
        className="bg-white/80 backdrop-blur-xl border-2 border-slate-200 rounded-2xl
      shadow-xl shadow-slate-200/50 p-6 mb-8"
      >
        <div
          className="inline-flex items-center gap-2 px-4 py-2
        bg-linear-to-r from-violet-50 to-fuchsia-50 border border-violet-200
        rounded-xl mb-6"
        >
          <div className="w-2 h-2  bg-violet-500 rounded-full animate-pulse" />
          <span className="text-sm font-semibold text-violet-700">
            Question {currentQuestionIndex + 1}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-6 leading-relaxed">
          {currentQuestion.question}
        </h3>
        {/* options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswers[currentQuestion._id] === index;
            return (
              <label
                key={index}
                className={`group relative flex items-center p-3 border-2 rounded-xl
                  cursor-pointer transition-all duration-200 
                  ${
                    isSelected
                      ? "border-violet-500 bg-violet-50 shadow-lg shadow-violet-500/10"
                      : "border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-white hover:shadow-md"
                  }`}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion._id}`}
                  checked={isSelected}
                  value={index}
                  onChange={() =>
                    handleOptionChange(currentQuestion._id, index)
                  }
                  className="sr-only"
                />
                {/* custom radio button */}
                <div
                  className={`shrink-0 w-5 h-5 rounded-full border2 transition-all duration-200
                  ${
                    isSelected
                      ? "border-violet-500 bg-violet-500"
                      : "border-slate-300 bg-white group-hover:border-violet-400"
                  }`}
                >
                  {isSelected && (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </div>
                {/* option text */}
                <span
                  className={`ml-4 text-sm font-medium transition-colors duration-200 ${
                    isSelected
                      ? "text-violet-900"
                      : "text-slate-700 group-hover:text-slate-900"
                  }`}
                >
                  {option}
                </span>
                {/* selected checkmark */}
                {isSelected && (
                  <CheckCircle2
                    className="ml-auto w-5 h-5 text-violet-500"
                    strokeWidth={2.5}
                  />
                )}
              </label>
            );
          })}
        </div>
      </div>
      {/* navigation buttons */}
      <div className="flex items-center justify-between gap-4">
        <Button
          onClick={handlePreviousQuestion}
          disable={currentQuestionIndex === 0 || submitting}
          variant="secondary"
        >
          <ChevronLeft
            className="w-4 h-4 group-hover:-translate-x-0.5
          transition-transform duration-200"
            strokeWidth={2.5}
          />
          Previous
        </Button>

        {currentQuestionIndex === quiz.questions.length - 1 ? (
          <button
            onClick={handleSubmitQuiz}
            disabled={submitting}
            className="group relative px-8 h-12 bg-linear-to-r from-violet-500 to-fuchsia-500
          hover:from-violet-600 hover:to-fuchsia-600 text-white font-semibold
          text-sm rounded-xl transition-all duration-200 shadow-lg shadow-fuchsia-500/30
          active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
          overflow-hidden"
          >
            <span className="relative flex items-center justify-center gap-2">
              {submitting ? (
                <>
                  <div
                    className="w-4 h-4 border-2 border-t-white
                  rounded-full animate-spin"
                  >
                    Submitting...
                  </div>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" strokeWidth={2.5} />
                  Submit quiz
                </>
              )}
            </span>
            <div
              className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0
            -translate-x-full group-hover:translate-x-full transition-transform duration-700"
            />
          </button>
        ) : (
          <Button
            onClick={handleNextQuestion}
            disable={
              currentQuestionIndex === quiz.questions.length - 1 || submitting
            }
            variant="primary"
          >
            Next
            <ChevronRight
              className="w-4 h-4 group-hover:translate-x-0.5
            transition-transform duration-200"
              strokeWidth={2.5}
            />
          </Button>
        )}
      </div>
      {/* question navigation dots */}
      <div className="mt-0 flex items-center justify-center gap-2 flex-wrap">
        {quiz.questions.map((_, index) => {
          const isAnsweredQuestion = Object.prototype.hasOwnProperty.call(
            selectedAnswers,
            quiz.questions[index]._id
          );
          const isCurrent = index === currentQuestionIndex;

          return (
            <button
              key={index}
              onClick={() => setCurrentQuestionIndex(index)}
              disabled={submitting}
              className={`w-8 h-8 rounded-lg font-semibold text-xs transition-all duration-200 ${
                isCurrent
                  ? "bg-linear-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/25 scale-110"
                  : isAnsweredQuestion
                  ? "bg-violet-100 text-violet-700 hover:bg-violet-200"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuizTakePage;
