import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { errorHandler } from "./middleware/errorHandler.js";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoute.js"

// es6 module __dirname alternative
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// connect to database
connectDB();

// Middleware
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static folder for uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes)


// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    statusCode: 404,
  });
});

app.use(errorHandler)

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port  ${PORT}`);
});

process.on("unhandledRejection", (reason: any, promise: Promise<any>) => {
  console.log("Unhandled Rejection at:", promise, "reason:", reason);
});