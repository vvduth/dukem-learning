import { Router } from "express";
import {
getFlashCards , 
getAllFlashCardsSet,
reviewFlashCards,
toogleStarFlashcard,
deleteFlashCardSet
} from "../controllers/flashCardController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect)

router.get("/", getAllFlashCardsSet)
router.get("/:documentId", getFlashCards)
router.put("/:cardId/review", reviewFlashCards)
router.put("/:cardId/star", toogleStarFlashcard)
router.delete("/:setId", deleteFlashCardSet)
export default router;