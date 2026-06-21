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
router.delete("/clear/:id", clearChat);
router.post("/:id", sendMessage);
router.get("/:id", getConversation);
router.delete("/:id", deleteMessage);

export default router;
