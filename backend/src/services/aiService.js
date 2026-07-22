import { GoogleGenerativeAI } from "@google/generative-ai";
import mongoose from "mongoose";
import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";
import AppError from "../utils/AppError.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const createAIConversation = async (userId) => {
  let conversation = await Conversation.findOne({
    participants: userId,
    isAIChat: true,
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [userId],
      isAIChat: true,
    });
  }

  return conversation;
};

const sendAIMessage = async (userId, conversationId, text) => {
  if (!text || !text.trim()) {
    throw new AppError("Message text is required", 400);
  }

  if (!mongoose.Types.ObjectId.isValid(conversationId)) {
    throw new AppError("Invalid conversation ID", 400);
  }

  await Message.create({
    conversationId,
    sender: userId,
    text: text.trim(),
  });

  const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";

  const model = genAI.getGenerativeModel({
    model: modelName,
  });

  const result = await model.generateContent(text.trim());

  const aiReply = result.response.text();

  const aiMessage = await Message.create({
    conversationId,
    sender: userId,
    receiver: userId,
    text: aiReply,
  });

  return aiMessage;
};

const getAIHistory = async (conversationId) => {
  const messages = await Message.find({
    conversationId,
  }).sort({ createdAt: 1 });

  return messages;
};

const clearAIHistory = async (conversationId) => {
  await Message.deleteMany({
    conversationId,
  });

  return true;
};

export default {
  createAIConversation,
  sendAIMessage,
  getAIHistory,
  clearAIHistory,
};