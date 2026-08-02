import mongoose from "mongoose";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import AppError from "../utils/AppError.js";

const findOrCreateConversation = async (userId, receiverId) => {
  if (!mongoose.Types.ObjectId.isValid(receiverId)) {
    throw new AppError("Invalid user ID", 400);
  }

  if (userId === receiverId) {
    throw new AppError("Cannot create conversation with yourself", 400);
  }

  let conversation = await Conversation.findOne({
    participants: { $all: [userId, receiverId] },
    isAIChat: false,
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [userId, receiverId],
      isAIChat: false,
    });
  } else if (
    conversation.deletedFor?.some((id) => id.toString() === userId)
  ) {
    conversation.deletedFor = conversation.deletedFor.filter(
      (id) => id.toString() !== userId,
    );
    await conversation.save();
  }

  return conversation;
};

const getConversations = async (userId) => {
  const conversations = await Conversation.find({
    participants: userId,
    deletedFor: { $ne: userId },
  })
    .populate("participants", "name profileImage isOnline lastSeen email bio")
    .populate({
      path: "lastMessage",
      select: "text image sender createdAt status deletedFor deletedForEveryone",
    })
    .sort({ updatedAt: -1 });

  return conversations;
};

const getConversationById = async (userId, conversationId) => {
  if (!mongoose.Types.ObjectId.isValid(conversationId)) {
    throw new AppError("Invalid conversation ID", 400);
  }

  const conversation = await Conversation.findOne({
    _id: conversationId,
    participants: userId,
    deletedFor: { $ne: userId },
  })
    .populate("participants", "name profileImage isOnline lastSeen email bio")
    .populate("lastMessage");

  if (!conversation) {
    throw new AppError("Conversation not found", 404);
  }

  return conversation;
};

const deleteConversation = async (userId, conversationId) => {
  const conversation = await Conversation.findOne({
    _id: conversationId,
    participants: userId,
  });

  if (!conversation) {
    throw new AppError("Conversation not found", 404);
  }

  if (!conversation.deletedFor?.some((id) => id.toString() === userId)) {
    conversation.deletedFor.push(userId);
    await conversation.save();
  }

  await Message.updateMany(
    { conversationId, deletedFor: { $ne: userId } },
    { $push: { deletedFor: userId } },
  );

  return true;
};

const updateLastMessage = async (conversationId, messageId) => {
  await Conversation.findByIdAndUpdate(conversationId, {
    lastMessage: messageId,
  });
};

export default {
  findOrCreateConversation,
  getConversations,
  getConversationById,
  deleteConversation,
  updateLastMessage,
};