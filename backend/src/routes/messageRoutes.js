import express from "express";

import {
  sendMessage,
  getMessages,
  updateMessage,
  deleteMessage,
  markAsRead,
  clearChat,
} from "../controllers/messageController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import { apiLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

router.post("/:conversationId/:receiverId", apiLimiter, authMiddleware, sendMessage);
router.get("/:conversationId", authMiddleware, getMessages);
router.put("/:id", authMiddleware, updateMessage);
router.delete("/:id", authMiddleware, deleteMessage);
router.patch("/:id/read", authMiddleware, markAsRead);
router.delete("/clear/:conversationId", authMiddleware, clearChat);

export default router;
