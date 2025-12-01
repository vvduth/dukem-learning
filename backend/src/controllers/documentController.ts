import { Request, Response, NextFunction } from "express";
import Document from "../models/Document.js";
import FlashCard from "../models/FlashCard.js";
import Quiz from "../models/Quiz.js";
import { extractFromPDf } from "../utils/pdfParser.js";
import { chunkText } from "../utils/textChunker.js";
import fs from "fs/promises";
import mongoose from "mongoose";
/**
 * Get all documents
 */
export const getDocuments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const documents = await Document.find();
    res.status(200).json({ success: true, data: documents });
  } catch (error) {
    if (req.file) {
      await fs.unlink(req.file.path).catch();
    }
    next(error);
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
    const document = await Document.create(req.body);
    res.status(201).json({ success: true, data: document });
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
