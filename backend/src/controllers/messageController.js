import mongoose from "mongoose";
import Message from "../models/Message.js";
import User from "../models/User.js";
import { userSocketMap } from "../socket/socket.js";
import cloudinary from "../config/cloudinary.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

let io;

export const setIo = (socketIo) => {
  io = socketIo;
};

const aiChat = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return res.status(400).json({ msg: "Message text is required" });
    }

    const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent(text.trim());
    const resText = result.response.text();
    res.json({ reply: resText });
  } catch (err) {
    console.error("AI chat error:", err.message);
    res.status(500).json({ msg: "AI service unavailable. Try again later." });
  }
};

const sendMessage = async (req, res) => {
  try {
    const receiverId = req.params.id;
    const { text, image } = req.body;
    const senderId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({ msg: "Invalid receiver ID" });
    }

    if (!text && !image) {
      return res.status(400).json({ msg: "Message must have text or image" });
    }

    if (text && text.length > 2000) {
      return res
        .status(400)
        .json({ msg: "Message cannot exceed 2000 characters" });
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ msg: "Receiver not found" });
    }

    let imageUrl = null;

    if (image) {
      try {
        const result = await cloudinary.uploader.upload(image, {
          folder: "chattrix/messages",
          resource_type: "image",
          allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
        });
        imageUrl = result.secure_url;
      } catch (cloudinaryError) {
        console.error("Cloudinary error:", cloudinaryError.message);
        return res.status(500).json({ msg: "Image upload failed" });
      }
    }

    const message = new Message({
      sender: senderId,
      receiver: receiverId,
      text: text?.trim() || undefined,
      image: imageUrl,
    });
    await message.save();

    if (io) {
      const receiverSocketId = userSocketMap.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receive-message", message);
      }

      const senderSocketId = userSocketMap.get(senderId);
      if (senderSocketId) {
        io.to(senderSocketId).emit("message-sent", message);
      }
    }

    res.status(201).json({ msg: "Message sent successfully!", message });
  } catch (err) {
    console.error("sendMessage error:", err.message);
    res.status(500).json({ msg: "Something went wrong" });
  }
};

const getConversation = async (req, res) => {
  try {
    const userId = req.user.id;
    const receiverId = req.params.id;

    // Validate receiverId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({ msg: "Invalid user ID" });
    }

    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: receiverId },
        { sender: receiverId, receiver: userId },
      ],
      deletedFor: { $ne: userId },
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (err) {
    console.error("getConversation error:", err.message);
    res.status(500).json({ msg: "Something went wrong" });
  }
};

const clearChat = async (req, res) => {
  try {
    const userId = req.user.id;
    const receiverId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({ msg: "Invalid user ID" });
    }

    const result = await Message.updateMany(
      {
        $or: [
          { sender: userId, receiver: receiverId },
          { sender: receiverId, receiver: userId },
        ],
        deletedFor: { $ne: userId },
      },
      {
        $push: { deletedFor: userId },
      }
    );

    res.status(200).json({
      msg: "Chat cleared successfully!",
      clearedCount: result.modifiedCount,
    });
  } catch (err) {
    console.error("clearChat error:", err.message);
    res.status(500).json({ msg: "Something went wrong" });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const messageId = req.params.id;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      return res.status(400).json({ msg: "Invalid message ID" });
    }

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ msg: "Message not found" });
    }

    if (message.sender.toString() !== userId) {
      return res
        .status(403)
        .json({ msg: "You can only delete your own messages" });
    }

    await Message.findByIdAndDelete(messageId);

    res.status(200).json({ msg: "Message deleted successfully!" });
  } catch (err) {
    console.error("deleteMessage error:", err.message);
    res.status(500).json({ msg: "Something went wrong" });
  }
};

export { aiChat, sendMessage, getConversation, deleteMessage, clearChat };
