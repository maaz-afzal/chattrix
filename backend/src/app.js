import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

import authMiddleware from "./middlewares/authMiddleware.js";

const app = express();

app.use(express.json());

// cors
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);

// app routes
app.use("/auth", authRoutes);
app.use("/users", authMiddleware, userRoutes);
app.use("/message", authMiddleware, messageRoutes);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ MessageEvent: "Route not found" });
});


// global error handler
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV === "production") {
    res.status(500).json({ message: "Server error" });
  } else {
    res.status(500).json({ message: err.message });
  }
});

export default app;
