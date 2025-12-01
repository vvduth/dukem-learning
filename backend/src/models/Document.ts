
import mongoose from "mongoose";


const documentSchema = new mongoose.Schema({
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
  fileSize: {
    type: Number,
    required:true
  },
  extractedText: {
    type: String,
    required: true,
  },
  chunk: [
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
        enum: ['processing', 'completed', 'failed'],
        default: 'processing',
    },
}, {
    timestamps: true,
});


// index to optimize queries by userId and title
documentSchema.index({ userId: 1, title: 1 });

const Document = mongoose.model("Document", documentSchema);

export default Document;