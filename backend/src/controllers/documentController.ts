import { Request, Response, NextFunction } from "express";
import Document from "../models/Document.js";
import FlashCard from "../models/FlashCard.js";
import Quiz from "../models/Quiz.js";
import { extractFromPDF } from "../utils/pdfParser.js";
import { chunkText } from "../utils/textChunker.js";
import fs from "fs/promises";
import mongoose from "mongoose";
import { count } from "console";
/**
 * Get all documents
 */
export const getDocuments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
   const documents = await Document.aggregate([
    {
      $match: { userId: new mongoose.Types.ObjectId(req.user!._id) }
    },{
      $lookup: {
        from: "flashcards",
        localField: "_id",
        foreignField: "documentId",
        as: "flashcardSets"
    }},{
      $lookup: {
        from: "quizzes",
        localField: "_id",
        foreignField: "documentId",
        as: "quizzes"
      }
    },{
      $addFields: {
        flashcardCount: { $size: "$flashcardSets" },
        quizCount: { $size: "$quizzes" }
      }
    }, {
      $project: {
        extractedText: 0,
        chunks: 0,
        flashcardSets: 0,
        quizzes: 0
      }
    },{
      $sort: { uploadDate: -1 }
    }
   ])

   res.status(200).json({ success: true, data: documents,
    count : documents.length
    });
  } catch (error) {
    if (req.file) {
      await fs.unlink(req.file.path).catch();
    }
    next(error);
  }
};

// helper function to process PDF
const processPDF = async (
  documentId: mongoose.Types.ObjectId,
  filePath: string
) => {
  try {
    const { text } = await extractFromPDF(filePath);

    // create chunks
    const chunks = chunkText(text, 500, 50);

    // update document record
    await Document.findByIdAndUpdate(documentId, {
      extractedText: text,
      chunk: chunks,
      status: "ready",
    });

    console.log(`Document ${documentId} processed successfully.`);
  } catch (error) {
    console.error(`Error processing document ${documentId}:`, error);
    // update document status to failed
    await Document.findByIdAndUpdate(documentId, {
      status: "failed",
    });
  }
};

/**
 * Get a single document by ID
 */
export const getDocumentById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res
        .status(404)
        .json({ success: false, message: "Document not found" });
    }
    res.status(200).json({ success: true, data: document });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new document
 */
export const uploadDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded", statusCode: 400 });
    }
    const { title } = req.body;
    if (!title || title.trim() === "") {
      // delete the uploaded file if no title provided
      await fs.unlink(req.file.path);
      return res.status(400).json({
        success: false,
        message: "Title is required",
        statusCode: 400,
      });
    }

    // construct the url for the uploaded file
    const baseUrl = `http://localhost:${process.env.PORT || 5000}`;
    const fileUrl = `${baseUrl}/uploads/documents/${req.file.filename}`;

    // create document record
    const document = await Document.create({
      userId: req.user._id,
      title,
      fileName: req.file.originalname,
      filePath: fileUrl,
      fileSize: req.file.size,
      status: "processing",
    });

    // proces in backdground (in production, use a queue like bull)
    processPDF(document._id, req.file.path).catch((err: any) => {
      console.error("Error processing PDF:", err);
    });

    res.status(201).json({
      success: true,
      data: document,
      message: "Document uploaded successfully. Processing in background.",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a document by ID
 */
export const updateDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const document = await Document.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!document) {
      return res
        .status(404)
        .json({ success: false, message: "Document not found" });
    }
    res.status(200).json({ success: true, data: document });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a document by ID
 */
export const deleteDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const document = await Document.findByIdAndDelete(req.params.id);
    if (!document) {
      return res
        .status(404)
        .json({ success: false, message: "Document not found" });
    }
    res.status(200).json({ success: true, message: "Document deleted" });
  } catch (error) {
    next(error);
  }
};
