import { Router } from "express";
import {

uploadDocument,
getDocuments,
getDocumentById,
updateDocument,
deleteDocument,
} from "../controllers/documentController.js";
import { protect } from "../middleware/auth.js";
import upload from "../config/multer.js"
const router = Router();

router.use(protect)

router.post("/upload", (req, res, next) => {
    console.log("Route handler reached, calling multer...");
    upload.single("file")(req, res, (err) => {
        if (err) {
            console.error("Multer error:", err);
            return res.status(400).json({ success: false, message: err.message });
        }
        console.log("Multer processing complete, file:", req.file ? 'uploaded' : 'missing');
        next();
    });
}, uploadDocument);

router.get("/", getDocuments);
router.get("/:id", getDocumentById);
router.put("/:id", updateDocument);
router.delete("/:id", deleteDocument);

export default router;