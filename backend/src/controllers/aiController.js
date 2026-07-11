import { GoogleGenerativeAI } from "@google/generative-ai";
import mongoose from "mongoose";
import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const createAIConversation = async (req, res) => {
  try {
    const userId = req.user.id;

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

    res.status(200).json({
      conversation,
    });
  } catch (err) {
    console.error("createAIConversation error:", err.message);
    res.status(500).json({
      msg: "Something went wrong",
    });
  }
};

const sendAIMessage = async (req, res) => {
  try {
    const { conversationId, text } = req.body;

    const userId = req.user.id;

    if (!text || !text.trim()) {
      return res.status(400).json({
        msg: "Message text is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({
        msg: "Invalid conversation ID",
      });
    }

    await Message.create({
      conversationId,
      sender: userId,
      receiver: null,
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

    res.status(200).json({
      msg: "AI response generated",
      reply: aiMessage,
    });
  } catch (err) {
    console.error("sendAIMessage error:", err.message);
    res.status(500).json({
      msg: "AI service unavailable",
    });
  }
};

const getAIHistory = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await Message.find({
      conversationId,
    }).sort({
      createdAt: 1,
    });

    res.status(200).json(messages);
  } catch (err) {
    console.error("getAIHistory error:", err.message);

    res.status(500).json({
      msg: "Something went wrong",
    });
  }
};

const clearAIHistory = async (req, res) => {
  try {
    const { conversationId } = req.params;
    await Message.deleteMany({
      conversationId,
    });

    res.status(200).json({
      msg: "AI history cleared",
    });
  } catch (err) {
    console.error("clearAIHistory error:", err.message);
    res.status(500).json({
      msg: "Something went wrong",
    });
  }
};

export { createAIConversation, sendAIMessage, getAIHistory, clearAIHistory };
