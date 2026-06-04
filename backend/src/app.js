import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

import authMiddleware from "./middlewares/authMiddleware.js";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.use("/auth", authRoutes);
app.use("/users", authMiddleware, userRoutes);
app.use("/message", authMiddleware, messageRoutes);

export default app;
