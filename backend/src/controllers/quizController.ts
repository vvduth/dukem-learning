import { Request, Response, NextFunction } from "express";
import Quiz from "../models/Quiz.js";
import { IUserAnswer } from "../types/index.js";

// get all quizzes for a document
export const getQuizzes = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // TODO: Implement quiz fetching logic
    const quizzes = await Quiz.find({
      documentId: req.params.documentId,
    })
      .populate("documentId", "title fileName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: quizzes,
      count: quizzes.length,
      message: "Quizzes retrieved successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getQuizById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const quiz = await Quiz.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
        statusCode: 404,
      });
    }

    // TODO: Implement single quiz fetching logic
    res.status(200).json({
      success: true,
      data: quiz,
      message: "Quiz retrieved successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const submitQuiz = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { answers } = req.body;
    if (!Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: "Answers must be an array",
        statusCode: 400,
      });
    }
    const quiz = await Quiz.findOne({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
        statusCode: 404,
      });
    }
    if (quiz.completedAt) {
      return res.status(400).json({
        success: false,
        message: "Quiz has already been submitted",
        statusCode: 400,
      });
    }

    // process answers
    let correctCount = 0;
    const userAnswers: IUserAnswer[] = [];
    answers.forEach((answer) => {
      const { questionIndex, selectedAnswer } = answer;
      if (questionIndex < quiz.questions.length) {
        const question = quiz.questions[questionIndex];
        const isCorrect = question.correctAnswer === selectedAnswer;
        if (isCorrect) correctCount++;
        userAnswers.push({
          questionIndex,
          selectedAnswer,
          isCorrect,
          answeredAt: new Date(),
        });
      }
    });

    // calculate score
    const score = Math.round((correctCount / quiz.questions.length) * 100);

    // update quiz with results
    quiz.userAnswers = userAnswers;
    quiz.score = score;
    quiz.completedAt = new Date();
    await quiz.save();
    res.status(200).json({
      success: true,
      data: {
        quizId: quiz._id,
        score,
        correctCount,
        totalQuestions: quiz.totalQuestions,
        percentage: score,
        userAnswers,
      },
      message: "Quiz submitted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getQuizResults = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // TODO: Implement quiz results fetching logic
    const quiz = await Quiz.findOne({
      _id: req.params.id,
      userId: req.userId,
    }).populate("documentId", "title fileName");

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
        statusCode: 404,
      });
    }

    if (!quiz.completedAt) {
      return res.status(400).json({
        success: false,
        message: "Quiz has not been submitted yet",
        statusCode: 400,
      });
    }

    // build detailed results
    const detailedResults = quiz.questions.map((question, index) => {
      const userAnswer = quiz.userAnswers.find(
        (ua) => ua.questionIndex === index
      );
      return {
        questionIndex: index,
        question: question.question,
        options: question.options,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        selectedAnswer: userAnswer ? userAnswer.selectedAnswer : null,
        isCorrect: userAnswer ? userAnswer.isCorrect : false,
      };
    });

    res.status(200).json({
      success: true,
      data: {
        quiz: {
          id: quiz._id,
          title: quiz.title,
          document: quiz.documentId,
          score: quiz.score,
          totalQuestions: quiz.totalQuestions,
          completedAt: quiz.completedAt,
        },
        results: detailedResults,
      },
      message: "Quiz results retrieved successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteQuiz = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // TODO: Implement quiz deletion logic
    const quiz = await Quiz.findOne({
        _id: req.params.id,
        userId: req.userId,
    })

    if (!quiz) {
        return res.status(404).json({
            success: false,
            message: "Quiz not found",
            statusCode: 404,
        });
    }

    await Quiz.deleteOne({ _id: req.params.id
    });
    res.status(200).json({
      success: true,
      message: "Quiz deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
