import Message from "../models/Message.js";
import User from "../models/User.js";
import { Server } from "socket.io";
import { userSocketMap } from "../socket/socket.js";
import cloudinary from "../config/cloudinary.js";

let io;

export const setIo = (socketIo) => {
  io = socketIo;
};

const sendMessage = async (req, res) => {
  try {
    const receiverId = req.params.id;
    const { text, image } = req.body;
    const senderId = req.user.id;

    if (!senderId || !receiverId || (!text && !image)) {
      return res.status(400).json({ msg: "Invalid request" });
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
          resource_type: "auto",
        });
        imageUrl = result.secure_url;
      } catch (cloudinaryError) {
        console.error("Cloudinary error:", cloudinaryError.message);
        return res
          .status(500)
          .json({ msg: "Image upload failed: " + cloudinaryError.message });
      }
    }

    const message = new Message({
      sender: senderId,
      receiver: receiverId,
      text,
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
    res.status(500).json({ msg: "Something went wrong" });
    console.log(err.message);
  }
};

const getConversation = async (req, res) => {
  try {
    const userId = req.user.id;
    const receiverId = req.params.id;
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: receiverId },
        { sender: receiverId, receiver: userId },
      ],
      deletedFor: { $ne: userId },
    }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ msg: "Something went wrong" });
  }
};

const clearChat = async (req, res) => {
  try {
    const userId = req.user.id;
    const receiverId = req.params.id;

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
      },
    );  
    res.status(200).json({
      msg: "Chat cleared successfully!",
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Something went wrong" });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const messageId = req.params.id;
    const userId = req.user.id;

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
    console.error(err);
    res.status(500).json({ msg: "Something went wrong" });
  }
};

export { sendMessage, getConversation, deleteMessage, clearChat };
