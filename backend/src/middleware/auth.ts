import { NextFunction, Request, Response } from "express";


export const protect = (req: Request, res: Response, next: NextFunction) => {
  try {
    // authentication logic here}
  } catch (error) {
    next(error);
  }

};