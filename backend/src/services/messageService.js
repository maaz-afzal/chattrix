import mongoose from "mongoose";
import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";
import cloudinary from "../config/cloudinary.js";
import AppError from "../utils/AppError.js";

const sendMessage = async (
  senderId,
  conversationId,
  receiverId,
  { text, image },
) => {
  if (!mongoose.Types.ObjectId.isValid(conversationId)) {
    throw new AppError("Invalid conversation ID", 400);
  }

  if (!mongoose.Types.ObjectId.isValid(receiverId)) {
    throw new AppError("Invalid receiver ID", 400);
  }

  if (!text && !image) {
    throw new AppError("Message must contain text or image", 400);
  }

  if (text && text.length > 2000) {
    throw new AppError("Message cannot exceed 2000 characters", 400);
  }

  let imageUrl = null;

  if (image) {
    const result = await cloudinary.uploader.upload(image, {
      folder: "chattrix/messages",
      resource_type: "image",
    });

    imageUrl = result.secure_url;
  }

  const message = await Message.create({
    conversationId,
    sender: senderId,
    text: text?.trim(),
    image: imageUrl,
  });

  await Conversation.findByIdAndUpdate(conversationId, {
    $set: { lastMessage: message._id },
    $inc: { [`unreadCount.${receiverId}`]: 1 },
  });

  return message;
};

const getMessages = async (userId, conversationId) => {
  if (!mongoose.Types.ObjectId.isValid(conversationId)) {
    throw new AppError("Invalid conversation ID", 400);
  }

  const messages = await Message.find({
    conversationId,
    deletedFor: { $ne: userId },
  }).sort({ createdAt: 1 });

  await Conversation.findByIdAndUpdate(conversationId, {
    $set: { [`unreadCount.${userId}`]: 0 },
  });

  return messages;
};

const updateMessage = async (userId, messageId, text) => {
  const message = await Message.findById(messageId);

  if (!message) {
    throw new AppError("Message not found", 404);
  }

  if (message.sender.toString() !== userId) {
    throw new AppError("You can only edit your own messages", 403);
  }

  if (!text?.trim()) {
    throw new AppError("Message text is required", 400);
  }

  message.text = text.trim();

  await message.save();

  return message;
};

const deleteMessage = async (userId, messageId, everyone = false) => {
  const message = await Message.findById(messageId);

  if (!message) {
    throw new AppError("Message not found", 404);
  }

  if (everyone) {
    if (message.sender.toString() !== userId) {
      throw new AppError("Only sender can delete message for everyone", 403);
    }

    message.deletedForEveryone = true;
    message.text = "";
    message.image = null;
  } else {
    message.deletedFor.push(userId);
  }

  await message.save();

  return true;
};

const markAsRead = async (messageId) => {
  const message = await Message.findById(messageId);

  if (!message) {
    throw new AppError("Message not found", 404);
  }

  message.status = "read";

  await message.save();

  return message;
};

const clearChat = async (userId, conversationId) => {
  await Message.updateMany(
    {
      conversationId,
      deletedFor: { $ne: userId },
    },
    {
      $push: { deletedFor: userId },
    },
  );

  return true;
};

export default {
  sendMessage,
  getMessages,
  updateMessage,
  deleteMessage,
  markAsRead,
  clearChat,
};