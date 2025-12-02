import { Request, Response, NextFunction } from "express";
import FlashCard from "../models/FlashCard.js";
import { count } from "console";
/**
 * Get all flashcards in a specific set
 */
export const getFlashCards = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const flashCards = await FlashCard.find({
      userId: req.user!._id,
      documentId: req.params.documentId,
    })
      .populate("documentId", "title fileName")
      .sort({ createdAt: -1 });

    res
      .status(200)
      .json({ success: true, data: flashCards, count: flashCards.length });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all flashcard sets (distinct set IDs)
 */
export const getAllFlashCardsSet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const flashCardSets = await FlashCard.find({
      userId: req.user!._id,
    })
      .populate("documentId", "title")
      .sort({ createdAt: -1 });
    res
      .status(200)
      .json({
        success: true,
        data: flashCardSets,
        count: flashCardSets.length,
      });
  } catch (error) {
    next(error);
  }
};

/**
 * Review flashcards (e.g., mark as reviewed or update review stats)
 */
export const reviewFlashCards = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const flashCardSet  = await FlashCard.findOne({
        'cards._id': req.params.cardId,
        userId: req.user!._id,
    })

    if (!flashCardSet) {
      return res
        .status(404)
        .json({ success: false, message: "Flashcard not found",
            statusCode: 404
         });
    }
    const cardIndex = flashCardSet.cards
    .findIndex(card => card!._id!.toString() === req.params.cardId);

    if (cardIndex === -1) {
        return res
        .status(404)
        .json({ success: false, message: "Flashcard not found",
            statusCode: 404
         });
    }

    // Update review stats
    flashCardSet.cards[cardIndex].lastReviewed = new Date();
    flashCardSet.cards[cardIndex].reviewCount += 1;
    await flashCardSet.save();
    res.status(200).json({ success: true, data: flashCardSet,
        message: "Flashcard reviewed successfully"
        });
  } catch (error) {
    next(error);
  }
};

/**
 * Toggle star (favorite) on a flashcard
 */
export const toogleStarFlashcard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const flashCardSet  = await FlashCard.findOne({
        'cards._id': req.params.cardId,
        userId: req.user!._id,
    })
    if (!flashCardSet) {
        return res.status(404)
        .json({ success: false, message: "Flashcard not found",
            statusCode: 404
         });
    }

    const cardIndex = flashCardSet.cards
    .findIndex(card => card!._id!.toString() === req.params.cardId);

    if (cardIndex === -1) {
        return res.status(404)
        .json({ success: false, message: "Flashcard not found",
            statusCode: 404
         });
    }
    // toggle isStarred
    flashCardSet.cards[cardIndex].isStarred = !flashCardSet.cards[cardIndex].isStarred;
    await flashCardSet.save();
    res.status(200).json({ success: true, data: flashCardSet,
        message: "Flashcard star status toggled successfully"
     });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete all flashcards in a set
 */
export const deleteFlashCardSet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const flashCardSet = await FlashCard.findOne({
        _id: req.params.id,
        userId: req.user!._id,
    })

    if (!flashCardSet) {
        return res.status(404).json({
        success: false,
        message: "Flashcard set not found",
        statusCode: 404
        })
    }
    await flashCardSet.deleteOne();
    res.status(200).json({
      success: true,
      message: "Flashcard set deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
