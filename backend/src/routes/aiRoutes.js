import express from "express";

import {
  createAIConversation,
  sendAIMessage,
  getAIHistory,
  clearAIHistory,
} from "../controllers/aiController.js";

import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/conversation", authMiddleware, createAIConversation);
router.post("/message", authMiddleware, sendAIMessage);
router.get("/history/:conversationId", authMiddleware, getAIHistory);
router.delete("/history/:conversationId", authMiddleware, clearAIHistory);

export default router;
