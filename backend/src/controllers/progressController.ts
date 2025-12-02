import { Request, Response, NextFunction } from "express";
import FlashCard from "../models/FlashCard.js";
import Document from "../models/Document.js";
import Quiz from "../models/Quiz.js";

// @desc    Get user learning stattistics for dashboard
// @route   GET /api/progress/dashboard
// @access  Private
export const getDashboard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!._id;

    // get counts
    const totalDocuments = await Document.countDocuments({ userId });
    const totalFlashCardSets = await FlashCard.countDocuments({ userId });
    const totalQuizzes = await Quiz.countDocuments({ userId });
    const completedQuizzes = await Quiz.countDocuments({
      userId,
      completed: true,
    });

    // get flashcards statistics
    const flashCardSets = await FlashCard.find({ userId });
    let totalFlashCards = 0;
    let reviewedFlashCards = 0;
    let starredFlashCards = 0;
    flashCardSets.forEach((set) => {
      totalFlashCards += set.cards.length;
      reviewedFlashCards += set.cards.filter(
        (card) => card.reviewCount > 0
      ).length;
      starredFlashCards += set.cards.filter((card) => card.isStarred).length;
    });

    // get quizzes statistics
    const quizzes = await Quiz.find({ userId, completedAt: { $ne: null } });
    const averageScore =
      quizzes.length > 0
        ? Math.round(
            quizzes.reduce((sum, quiz) => sum + quiz.score, 0) / quizzes.length
          )
        : 0;

    // recent activity
    const recentDocuments = await Document.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title fileName lastAccessed status");

    const recentQuizzes = await Quiz.find({ userId })
      .sort({ completedAt: -1 })
      .limit(5)
      .select("title score totalQuestions completedAt");

    // study streak (number of consecutive days with activity)
    let studyStreak = Math.floor(Math.random() * 7) + 1; // Placeholder for actual streak calculation

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalDocuments,
          totalFlashCardSets,
          totalFlashCards,
          reviewedFlashCards,
          starredFlashCards,
          totalQuizzes,
          completedQuizzes,
          averageScore,
          studyStreak,
        },
        recentActivity: {
          documents: recentDocuments,
          quizzes: recentQuizzes,
        },
      },
    });
  } catch (error: any) {
    next(error);
  }
};
