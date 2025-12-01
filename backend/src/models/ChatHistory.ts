import mongoose from "mongoose";
import { IChatHistory } from "../types/index.js";

const chatHistorySchema = new mongoose.Schema<IChatHistory>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    documentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
        required: true,
    },
    messages: [{
        role: {
            type: String,
            enum: ['user', 'assistant', 'system'],
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
        relevantChunks: [{
            type: [Number],
            default: [],
        }]
    }]
}, {
    timestamps: true,
})

chatHistorySchema.index({ userId: 1, documentId: 1 });

const ChatHistory = mongoose.model<IChatHistory>("ChatHistory", chatHistorySchema);

export default ChatHistory;