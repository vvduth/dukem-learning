import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
   let token;
  try {
    // authentication logic here}
    console.log("Protect Middleware Invoked");
   

    // check if token exists in authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      console.log("Authorization header found");
      token = req.headers.authorization.split(" ")[1];

      // verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        id: string;
      };
      req.user = await User.findById(decoded.id).select("-password");
      req.userId = decoded.id;

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Not authorized, user not found",
          statusCode: 401,
        });
      }
    }
    console.log("User authenticated:", req.user?.username);
    next();
  } catch (error:any) {
    console.error("Auth Middleware Error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired",
        statusCode: 401,
      });
    }
    return res.status(401).json({
      success: false,
      message: "Not authorized, token failed",
      statusCode: 401,
    });
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, no token",
      statusCode: 401,
    });
  }
};


