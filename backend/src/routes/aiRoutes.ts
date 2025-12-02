import express from "express";
import { Router } from "express";
import {
    generateFlashCards, generateQuiz,
    generateSummary, chat,
    explainConcept,
    getChatHistory
} from "../controllers/aiController.js";
import { protect } from "../middleware/auth.js";

const router = Router();
router.use(protect)
router.get("/", (req, res) => {
    res.status(200).json({ success: true, message: "AI Route is working" });
})
router.post("/generate-flashcards", generateFlashCards);
router.post("/generate-quiz", generateQuiz);
router.post("/generate-summary", generateSummary);
router.post("/chat", chat);
router.post("/explain-concept", explainConcept);
router.get("/chat-history/:documentId", getChatHistory);

export default router;