import express from "express";
import cors from "cors";
import helmet from "helmet";
import {
  authLimiter,
  apiLimiter,
  aiLimiter,
} from "./middlewares/rateLimiter.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://chattrix-frontend-ecru.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.options("*", cors());

app.use(express.json({ limit: "8mb" }));

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Chattrix backend is running",
  });
});

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/ai", aiLimiter, aiRoutes);
app.use("/api/users", apiLimiter, userRoutes);
app.use("/api/conversations", apiLimiter, conversationRoutes);
app.use("/api/messages", apiLimiter, messageRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Chattrix backend is running",
  });
});

app.use((req, res) => {
  res.status(404).json({ msg: "Route not found" });
});

app.use(errorHandler);

export default app;
