import { IUser } from '../index';

declare global {
  namespace Express {
    interface Request {
      user?: Partial<IUser>;
      userId?: string;
      file?: Express.Multer.File;
    }
  }
}