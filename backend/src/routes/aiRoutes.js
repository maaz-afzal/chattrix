import express from "express";

import {
  createAIConversation,
  sendAIMessage,
  getAIHistory,
  clearAIHistory,
} from "../controllers/aiController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import { aiLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

router.post("/conversation", aiLimiter, authMiddleware, createAIConversation);
router.post("/message", aiLimiter, authMiddleware, sendAIMessage);
router.get("/history/:conversationId", authMiddleware, getAIHistory);
router.delete("/history/:conversationId", authMiddleware, clearAIHistory);

export default router;
