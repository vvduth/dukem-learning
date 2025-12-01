import { NextFunction, Request, Response } from "express";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    // moongose bad objectId
    if (err.name === "CastError") {
        statusCode = 400;
        message = `Resource not found. Invalid: ${err.path}`;
    }

    // mongoose duplicate key
    if (err.code === 11000) {
        statusCode = 400;
        message = `Duplicate ${Object.keys(err.keyValue)[0]} entered`;
    }

    // mongoose validation error
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(err.errors).map((value: any) => value.message).join(", ");
    }

    // multer file size error
    if (err.code === "LIMIT_FILE_SIZE") {
        statusCode = 400;
        message = "File size is too large. Maximum limit is 2MB.";
    }
    
    // jwt error
    if (err.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "JSON Web Token is invalid. Try again.";
    }
}