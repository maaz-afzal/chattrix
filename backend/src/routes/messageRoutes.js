import {
  sendMessage,
  getConversation,
  deleteMessage,
  clearChat,
  aiChat,
} from "../controllers/messageController.js";

import express from "express";
import { rateLimit } from "express-rate-limit";

const router = express.Router();

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { msg: "Too many AI requests. Please wait a moment." },
});

router.post("/ai", aiLimiter, aiChat);
router.delete("/clear/:id", clearChat);
router.post("/:id", sendMessage);
router.get("/:id", getConversation);
router.delete("/:id", deleteMessage);

export default router;
