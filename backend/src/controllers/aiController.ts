import { Request, Response, NextFunction } from "express";
import Document from "../models/Document.js";
import Quiz from "../models/Quiz.js";
import FlashCard from "../models/FlashCard.js";
import ChatHistory from "../models/ChatHistory.js";
import * as geminiService from "../utils/geminiServices.js";
import { findRelevantChunks } from "../utils/textChunker.js";
// POST /api/ai/flashcards
export const generateFlashCards = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("generateFlashCards called with body:", req.body);
  try {
    // TODO: Implement flashcard generation logic
    const { documentId, count = 5 } = req.body;
    if (!documentId) {
      return res
        .status(400)
        .json({ success: false, message: "documentId is required" });
    }

    const document = await Document.findOne({
      _id: documentId,
      userId: req.user!._id,
      status: "ready",
    });

    if (!document) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Document not found or not ready",
          statusCode: 404,
        });
    }

    // generate flashcards using gemini
    const cards = await geminiService.generateFlashcards(
      document.extractedText,
      parseInt(count)
    );

    // save flashcards to database
    const flashcardSet = await FlashCard.create({
        userId: req.user!._id,
        documentId: document._id,
        cards: cards.map(card => (
            {
            question: card.question,
            answer: card.answer,
            difficulty: card.difficulty,
            reviewCount: 0,
            isStarred: false,
            }
        ))
    })
    res.status(201).json({ success: true, data: flashcardSet,
        message: "Flashcards generated successfully"
     });
  } catch (error) {
    console.error("Error generating flashcards:", error);
    next(error);
  }
};

// POST /api/ai/quiz
export const generateQuiz = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // TODO: Implement quiz generation logic
    res.status(200).json({ success: true, data: [] });
  } catch (error) {
    next(error);
  }
};

// POST /api/ai/summary
export const generateSummary = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // TODO: Implement summary generation logic
    res.status(200).json({ success: true, data: "" });
  } catch (error) {
    next(error);
  }
};

// POST /api/ai/chat
export const chat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // TODO: Implement chat logic
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

// POST /api/ai/explain
export const explainConcept = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // TODO: Implement concept explanation logic
    res.status(200).json({ success: true, data: "" });
  } catch (error) {
    next(error);
  }
};

// GET /api/ai/chat/history
export const getChatHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // TODO: Implement chat history retrieval logic
    res.status(200).json({ success: true, data: [] });
  } catch (error) {
    next(error);
  }
};
