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
      return res.status(404).json({
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
      cards: cards.map((card) => ({
        question: card.question,
        answer: card.answer,
        difficulty: card.difficulty,
        reviewCount: 0,
        isStarred: false,
      })),
    });
    res.status(201).json({
      success: true,
      data: flashcardSet,
      message: "Flashcards generated successfully",
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
    const { documentId, numQuestion = 5, title } = req.body;
    if (!documentId) {
      return res.status(400).json({
        success: false,
        message: "documentId is required",
        statusCode: 400,
      });
    }
    const document = await Document.findOne({
      _id: documentId,
      userId: req.user!._id,
      status: "ready",
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found or not ready",
        statusCode: 404,
      });
    }

    // generate quiz using gemini
    const question = await geminiService.generateQuizQuestions(
      document.extractedText,
      parseInt(numQuestion)
    );

    // save quiz to database
    const quiz = await Quiz.create({
      userId: req.user!._id,
      documentId: document._id,
      title: title || `Quiz for ${document.title}`,
      questions: question,
      totalQuestions: question.length,
      userAnswers: [],
      score: 0,
    });

    res.status(201).json({
      success: true,
      data: quiz,
      message: "Quiz generated successfully",
    });
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
    const { documentId } = req.body;
    if (!documentId) {
      return res.status(400).json({
        success: false,
        message: "documentId is required",
        statusCode: 400,
      });
    }

    const document = await Document.findOne({
      _id: documentId,
      userId: req.user!._id,
      status: "ready",
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found or not ready",
        statusCode: 404,
      });
    }
    // generate summary using gemini
    const summary = await geminiService.generateSummary(document.extractedText);

    res.status(200).json({
      success: true,
      data: summary,
      message: "Summary generated successfully",
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/ai/chat
export const chat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // TODO: Implement chat logic
    const { documentId, question } = req.body;
    if (!documentId || !question) {
      return res.status(400).json({
        success: false,
        message: "documentId and question are required",
        statusCode: 400,
      });
    }

    const document = await Document.findOne({
      _id: documentId,
      userId: req.user!._id,
      status: "ready",
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found or not ready",
        statusCode: 404,
      });
    }

    // find relevant chunks
    const relevantChunks = findRelevantChunks(document.chunks, question, 3);
    const chunkIndices = relevantChunks.map((c) => c.chunkIndex);

    // get or create chat history
    let chatHistory = await ChatHistory.findOne({
      userId: req.user!._id,
      documentId: document._id,
    });
    if (!chatHistory) {
      chatHistory = await ChatHistory.create({
        userId: req.user!._id,
        documentId: document._id,
        messages: [],
      });
    }

    // generate answer using gemini
    const answer = await geminiService.chatWithConText(
      question,
      relevantChunks
    );

    // save conversation to chat history
    chatHistory.messages.push(
      {
        role: "user",
        content: question,
        timestamp: new Date(),
        // empty array for user messages
        relevantChunks: [],
      },
      {
        role: "assistant",
        content: answer,
        timestamp: new Date(),
        relevantChunks: chunkIndices,
      }
    );

    await chatHistory.save();
    res.status(200).json({
      success: true,
      data: {
        question,
        answer,
        relevantChunks: chunkIndices,
        chatHistoryId: chatHistory._id,
      },
      message: "Chat answer generated successfully",
    });
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
    const { documentId, concept } = req.body;
    if (!documentId || !concept) {
      return res.status(400).json({
        success: false,
        error: "documentId and concept are required",
        statusCode: 400,
      });
    }

    const document = await Document.findOne({
      _id: documentId,
      userId: req.user!._id,
      status: "ready",
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        error: "Document not found or not ready",
        statusCode: 404,
      });
    }

    // find relevant chunks of the concept
    const relevantChunks = findRelevantChunks(document.chunks, concept, 3);
    const context = relevantChunks.map((c) => c.content).join("\n\n");

    // generate explanation using gemini
    const explanation = await geminiService.explainConcept(concept, context);

    res.status(200).json({
      success: true,
      data: {
        concept,
        explanation,
        relevantChunks: relevantChunks.map((c) => c.chunkIndex),
      },
      message: "Concept explanation generated successfully",
    });
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
    const { documentId } = req.params;
    if (!documentId) {
      return res.status(400).json({
        success: false,
        message: "documentId is required",
        statusCode: 400,
      });
    }

    const chatHistory = await ChatHistory.findOne({
      userId: req.user!._id,
      documentId: documentId,
    }).select("messages"); // only return messages array

    if (!chatHistory) {
      return res.status(404).json({
        success: false,
        message: "Chat history not found",
        statusCode: 404,
      });
    }

    res
      .status(200)
      .json({
        success: true,
        data: chatHistory.messages,
        message: "Chat history retrieved successfully",
      });
  } catch (error) {
    next(error);
  }
};
