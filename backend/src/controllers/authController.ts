import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { Request, Response, NextFunction } from "express";
import { IUser } from "../types/index.js";
import mongoose from "mongoose";

// generate jwt token
const regerateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: "30d",
  });
};

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email, password }: Partial<IUser> = req.body;

    const userExists = await User.findOne({
      $or: [{ email }],
    });

    if (userExists) {
      return res.status(400).json({
        success: false,
        error: "User already exists",
        statusCode: 400,
      });
    }

    // create user
    const user = await User.create({
      username,
      email,
      password,
    });

    // generate token for the user to login immediately after registration
    const token = regerateToken(user._id.toString());

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          profileImage: user.profileImage,
          createdAt: user.createdAt,
        },
        token,
      },
    });
  } catch (error) {
    // pass to error handler middleware
    next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    // validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Please provide email and password",
        statusCode: 400,
      });
    }

    // check for user include password for compare
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
        statusCode: 401,
      });
    }

    // check if password matches
    const isMatch = await user.matchPassword!(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
        statusCode: 401,
      });
    }
    // generate token
    const token = regerateToken(user._id.toString());

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: {
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          profileImage: user.profileImage,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("Request userId:", req.userId);
    const user = await User.findById(req.userId);
    console.log("Fetched user:", user);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
        statusCode: 404,
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.userId || !mongoose.Types.ObjectId.isValid(req.userId)) {
    return res.status(400).json({
      success: false,
      error: "Invalid or missing userId",
      statusCode: 400,
    });
  }
  try {
    const { username, email, profileImage } = req.body;
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
        statusCode: 404,
      });
    }
    
    if (username) user.username = username;
    if (email) user.email = email;
    if (profileImage !== undefined) user.profileImage = profileImage;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: "Please provide current and new password",
        statusCode: 400,
      });
    }
    const user = await User.findById(req.userId).select("+password");
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
        statusCode: 404,
      });
    }

    const isMatch = await user.matchPassword!(currentPassword); 
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Current password is incorrect",
        statusCode: 401,
      });
    }

    // update to new password
    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    next(error);
  }
};
