import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { Request, Response, NextFunction } from "express";

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
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (
  req: Request,
  res: Response,
    next: NextFunction  ) => {
        try {
            
        } catch (error) {
            next(error);
        }
    }

export const changePassword = async (
  req: Request,
  res: Response,    
  next: NextFunction
) => {
    try{

    }   catch (error) {
        next(error);
    }
    
}
