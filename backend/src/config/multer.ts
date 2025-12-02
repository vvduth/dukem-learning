import multer from "multer";
import path from "path";
import {fileURLToPath   } from "url"
import fs from "fs";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "../../uploads/documents");

// ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename:  (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
})

// file filter to accept only pdf, md files
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    console.log("File MIME type:", file.mimetype);
    const allowedTypes = ['application/pdf', 'text/markdown', 'text/x-markdown'];
    if (allowedTypes.includes(file.mimetype) || file.originalname.endsWith('.md')) {
        console.log("File accepted by filter");
        return cb(null, true);
    } else {
        console.log("File rejected by filter");
        return cb(null, false);
    }
};

// configure multer
const upload = multer({ 
    storage, 
    fileFilter,
    limits: { fileSize: 20 * 1024 * 1024 } // 20MB file size limit
});

export default upload;