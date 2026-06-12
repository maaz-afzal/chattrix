import {
  sendMessage,
  getConversation,
  deleteMessage,
  clearChat,
} from "../controllers/messageController.js";

import express from "express";
const router = express.Router();

router.post("/:id", sendMessage);
router.get("/:id", getConversation);
router.delete("/clear/:id", clearChat);
router.delete("/:id", deleteMessage);

export default router;
