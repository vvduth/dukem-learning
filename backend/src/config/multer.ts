import multer from "multer";
import multerS3 from "multer-s3";
import { s3Client } from "./s3.js";
import path from "path";
import { Request } from "express";

// Configure multer-s3 storage
const storage = multerS3({
  s3: s3Client,
  bucket: process.env.AWS_BUCKET_NAME!,
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname });
  },
  key: function (req: Request, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `documents/${uniqueSuffix}-${file.originalname}`);
  },
});

// File filter (same as before)
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedTypes = [
    "application/pdf",
    "text/markdown",
    "text/x-markdown",
    "application/octet-stream", // Sometimes markdown comes as octet-stream
  ];
  
  if (
    allowedTypes.includes(file.mimetype) ||
    file.originalname.toLowerCase().endsWith(".md")
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

export default upload;