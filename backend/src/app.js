import express from "express";
import cors from "cors";
import helmet from "helmet";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

import authMiddleware from "./middlewares/authMiddleware.js";

const app = express();

app.use(helmet());

// cors
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json({ limit: "5mb" }));

// app routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/ai", aiRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ msg: "Route not found" });
});

// global error handler
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV === "production") {
    res.status(500).json({ msg: "Server error" });
  } else {
    res.status(500).json({ msg: err.message });
  }
});

export default app;
