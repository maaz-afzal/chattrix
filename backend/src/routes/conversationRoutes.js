import express from "express";

import {
  findOrCreateConversation,
  getConversations,
  getConversationById,
  deleteConversation,
} from "../controllers/conversationController.js";

import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, findOrCreateConversation);
router.get("/", authMiddleware, getConversations);
router.get("/:id", authMiddleware, getConversationById);
router.delete("/:id", authMiddleware, deleteConversation);

export default router;
