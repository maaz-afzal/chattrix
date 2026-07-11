import mongoose from "mongoose";
import Message from "../models/Message.js";
import cloudinary from "../config/cloudinary.js";

let io;

export const setIo = (socketIo) => {
  io = socketIo;
};

// Send Message
const sendMessage = async (req, res) => {
  try {
    const { conversationId, receiverId } = req.params;
    const { text, image } = req.body;

    const senderId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({
        msg: "Invalid conversation ID",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({
        msg: "Invalid receiver ID",
      });
    }

    if (!text && !image) {
      return res.status(400).json({
        msg: "Message must contain text or image",
      });
    }

    if (text && text.length > 2000) {
      return res.status(400).json({
        msg: "Message cannot exceed 2000 characters",
      });
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
      receiver: receiverId,
      text: text?.trim(),
      image: imageUrl,
    });

    if (io) {
      io.to(receiverId).emit("receive-message", message);

      io.to(senderId).emit("message-sent", message);
    }

    res.status(201).json({
      msg: "Message sent successfully",
      message,
    });
  } catch (err) {
    console.error("sendMessage error:", err.message);

    res.status(500).json({
      msg: "Something went wrong",
    });
  }
};

const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({
        msg: "Invalid conversation ID",
      });
    }

    const messages = await Message.find({
      conversationId,

      deletedFor: {
        $ne: userId,
      },
    }).sort({
      createdAt: 1,
    });

    res.status(200).json(messages);
  } catch (err) {
    console.error("getMessages error:", err.message);

    res.status(500).json({
      msg: "Something went wrong",
    });
  }
};

// Update message
const updateMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const userId = req.user.id;

    const message = await Message.findById(id);

    if (!message) {
      return res.status(404).json({
        msg: "Message not found",
      });
    }

    if (message.sender.toString() !== userId) {
      return res.status(403).json({
        msg: "You can only edit your own messages",
      });
    }

    if (!text?.trim()) {
      return res.status(400).json({
        msg: "Message text is required",
      });
    }

    message.text = text.trim();

    await message.save();

    res.status(200).json({
      msg: "Message updated",
      message,
    });
  } catch (err) {
    console.error("updateMessage error:", err.message);

    res.status(500).json({
      msg: "Something went wrong",
    });
  }
};

// Delete message
const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { everyone } = req.body;

    const message = await Message.findById(id);

    if (!message) {
      return res.status(404).json({
        msg: "Message not found",
      });
    }

    if (everyone) {
      if (message.sender.toString() !== userId) {
        return res.status(403).json({
          msg: "Only sender can delete message for everyone",
        });
      }

      message.deletedForEveryone = true;
      message.text = "";
      message.image = null;
    } else {
      message.deletedFor.push(userId);
    }

    await message.save();

    res.status(200).json({
      msg: "Message deleted successfully",
    });
  } catch (err) {
    console.error("deleteMessage error:", err.message);

    res.status(500).json({
      msg: "Something went wrong",
    });
  }
};

// Mark message as read
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await Message.findById(id);

    if (!message) {
      return res.status(404).json({
        msg: "Message not found",
      });
    }

    message.status = "read";

    await message.save();

    if (io) {
      io.to(message.sender.toString()).emit("message-read", id);
    }

    res.status(200).json({
      msg: "Message marked as read",
    });
  } catch (err) {
    console.error("markAsRead error:", err.message);

    res.status(500).json({
      msg: "Something went wrong",
    });
  }
};

// Clear chat for current user
const clearChat = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    await Message.updateMany(
      {
        conversationId,

        deletedFor: {
          $ne: userId,
        },
      },

      {
        $push: {
          deletedFor: userId,
        },
      },
    );

    res.status(200).json({
      msg: "Chat cleared successfully",
    });
  } catch (err) {
    console.error("clearChat error:", err.message);

    res.status(500).json({
      msg: "Something went wrong",
    });
  }
};

export {
  sendMessage,
  getMessages,
  updateMessage,
  deleteMessage,
  markAsRead,
  clearChat,
};
