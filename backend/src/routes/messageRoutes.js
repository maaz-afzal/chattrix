import {
  sendMessage,
  getConversation,
  deleteMessage,
} from "../controllers/messageController.js";

import express from "express";
const router = express.Router();

router.post("/:id", sendMessage);
router.get("/:id", getConversation);
router.delete("/:id", deleteMessage);

export default router;
