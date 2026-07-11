import mongoose from "mongoose";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

const findOrCreateConversation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { receiverId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({
        msg: "Invalid user ID",
      });
    }

    if (userId === receiverId) {
      return res.status(400).json({
        msg: "Cannot create conversation with yourself",
      });
    }

    let conversation = await Conversation.findOne({
      participants: {
        $all: [userId, receiverId],
      },
      isAIChat: false,
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [userId, receiverId],
        isAIChat: false,
      });
    }

    res.status(200).json({
      conversation,
    });
  } catch (err) {
    console.error("findOrCreateConversation error:", err.message);

    res.status(500).json({
      msg: "Something went wrong",
    });
  }
};

const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const conversations = await Conversation.find({
      participants: userId,
    })

      .populate("participants", "name profileImage status lastSeen")
      .populate({
        path: "lastMessage",
        select: "text image sender createdAt status",
      })

      .sort({
        updatedAt: -1,
      });

    res.status(200).json(conversations);
  } catch (err) {
    console.error("getConversations error:", err.message);

    res.status(500).json({
      msg: "Something went wrong",
    });
  }
};

const getConversationById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        msg: "Invalid conversation ID",
      });
    }

    const conversation = await Conversation.findOne({
      _id: id,
      participants: userId,
    })

      .populate("participants", "name profileImage status lastSeen")

      .populate("lastMessage");

    if (!conversation) {
      return res.status(404).json({
        msg: "Conversation not found",
      });
    }

    res.status(200).json(conversation);
  } catch (err) {
    console.error("getConversationById error:", err.message);

    res.status(500).json({
      msg: "Something went wrong",
    });
  }
};

const deleteConversation = async (req, res) => {
  try {
    const { id } = req.params;

    const userId = req.user.id;

    const conversation = await Conversation.findOne({
      _id: id,
      participants: userId,
    });

    if (!conversation) {
      return res.status(404).json({
        msg: "Conversation not found",
      });
    }

    // Remove user from participants
    conversation.participants = conversation.participants.filter(
      (id) => id.toString() !== userId,
    );

    await conversation.save();
    res.status(200).json({
      msg: "Conversation deleted",
    });
  } catch (err) {
    console.error("deleteConversation error:", err.message);

    res.status(500).json({
      msg: "Something went wrong",
    });
  }
};

const updateLastMessage = async (conversationId, messageId) => {
  await Conversation.findByIdAndUpdate(conversationId, {
    lastMessage: messageId,
  });
};

export {
  findOrCreateConversation,
  getConversations,
  getConversationById,
  deleteConversation,
  updateLastMessage,
};
