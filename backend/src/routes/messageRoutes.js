import {
  sendMessage,
  getConversation,
  deleteMessage,
  clearChat,
  aiChat,
} from "../controllers/messageController.js";

import express from "express";
const router = express.Router();

router.post("/ai", aiChat);
router.post("/:id", sendMessage);
router.get("/:id", getConversation);
router.delete("/clear/:id", clearChat);
router.delete("/:id", deleteMessage);

export default router;
