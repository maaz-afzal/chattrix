import mongoose from "mongoose";
import Conversation from "../models/Conversation.js";
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
  }

  return conversation;
};

const getConversations = async (userId) => {
  const conversations = await Conversation.find({
    participants: userId,
  })
    .populate("participants", "name profileImage isOnline lastSeen")
    .populate({
      path: "lastMessage",
      select: "text image sender createdAt status",
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
  })
    .populate("participants", "name profileImage isOnline lastSeen")
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

  conversation.participants = conversation.participants.filter(
    (id) => id.toString() !== userId,
  );

  await conversation.save();

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