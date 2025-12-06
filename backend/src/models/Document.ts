import mongoose from "mongoose";
import { IDocument } from "../types/index.js";

const documentSchema = new mongoose.Schema<IDocument>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    fileName: {
      type: String,
      required: [true, "File name is required"],
    },
    filePath: {
      type: String,
      required: [true, "File path is required"],
    },
    s3Key: {
      type: String,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    extractedText: {
      type: String,
      default: "",
    },
    chunks: [
      {
        content: {
          type: String,
          required: true,
        },
        pageNumber: {
          type: Number,
          default: 0,
        },
        chunkIndex: {
          type: Number,
          required: true,
        },
      },
    ],
    uploadDate: {
      type: Date,
      default: Date.now,
    },
    lastAccessed: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["processing", "completed", "failed", "ready"],
      default: "processing",
    },
  },
  {
    timestamps: true,
  }
);

// index to optimize queries by userId and title
documentSchema.index({ userId: 1, title: 1 });

const Document = mongoose.model<IDocument>("Document", documentSchema);

export default Document;
