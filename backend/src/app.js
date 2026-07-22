import express from "express";
import cors from "cors";
import helmet from "helmet";

import {
  authRoutes,
  userRoutes,
  messageRoutes,
  conversationRoutes,
  aiRoutes,
} from "./routes/index.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173" || "*",
    credentials: true,
  }),
);

app.use(express.json({ limit: "5mb" }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/ai", aiRoutes);

app.use((req, res) => {
  res.status(404).json({ msg: "Route not found" });
});

app.use(errorHandler);

export default app;
