import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { handleConnection, handleDisconnect } from "./events.js";
import messageService from "../services/messageService.js";

let io;

export const getIo = () => io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication error: No token provided."));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("isDeleted");
      if (!user || user.isDeleted) {
        return next(new Error("Authentication error: Invalid token."));
      }
      socket.userId = decoded.id;
      next();
    } catch {
      next(new Error("Authentication error: Invalid token."));
    }
  });

  io.on("connection", async (socket) => {
    await handleConnection(socket, io);

    socket.on("typing", async ({ receiverId }) => {
      try {
        // Check if a conversation exists between the sender and receiver
        const conversation = await Conversation.findOne({
          participants: { $all: [socket.userId, receiverId] }
        });
        if (conversation) {
          io.to(receiverId).emit("user-typing", { userId: socket.userId });
        }
      } catch (err) {
        console.error("typing error:", err);
      }
    });

    socket.on("stop-typing", async ({ receiverId }) => {
      try {
        // Check if a conversation exists between the sender and receiver
        const conversation = await Conversation.findOne({
          participants: { $all: [socket.userId, receiverId] }
        });
        if (conversation) {
          io.to(receiverId).emit("user-stop-typing", { userId: socket.userId });
        }
      } catch (err) {
        console.error("stop-typing error:", err);
      }
    });

    socket.on("mark-delivered", async ({ messageId, senderId }) => {
      try {
        const message = await Message.findById(messageId);
        if (!message) {
          throw new Error("Message not found");
        }

        const conversation = await Conversation.findById(message.conversationId);
        if (!conversation) {
          throw new Error("Conversation not found");
        }

        // Check that the socket user is a participant in the conversation
        const isParticipant = conversation.participants.some(
          (p) => p.toString() === socket.userId
        );
        if (!isParticipant) {
          throw new Error("You are not a participant in this conversation");
        }

        // Check that the provided senderId matches the message's sender
        if (message.sender.toString() !== senderId) {
          throw new Error("Sender ID does not match message sender");
        }

        // Prevent users from marking their own messages as delivered
        if (message.sender.toString() === socket.userId) {
          throw new Error("You cannot mark your own message as delivered");
        }

        const updatedMessage = await messageService.markDelivered(messageId);
        io.to(senderId).emit("message-delivered", updatedMessage);
      } catch (err) {
        console.error("mark-delivered error:", err);
      }
    });

    socket.on("disconnect", async () => {
      await handleDisconnect(socket, io);
    });
  });

  return io;
};

export default initSocket;