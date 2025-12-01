import express from "express";
import { body } from "express-validator";

import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  changePassword,
} from "../controllers/authController.js";
import {protect} from "../middleware/auth.js";

const router = express.Router();

// validation middlewares

const registerValidation = [
  body("username")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Username is required"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

const loginValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

// public routes
router.post("/register", registerValidation, registerUser);
router.post("/login", loginValidation, loginUser);


// protected routes
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);
export default router;  