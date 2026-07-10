import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const userSocketMap = new Map();

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication error: no token provided"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch {
      next(new Error("Authentication error: invalid token"));
    }
  });

  io.on("connection", async (socket) => {
    const userId = socket.userId;

    userSocketMap.set(userId, socket.id);

    try {
      await User.findByIdAndUpdate(userId, { status: true });
      socket.broadcast.emit("user-online", userId);
    } catch (err) {
      console.error("Socket connect DB error:", err.message);
    }

    socket.on("typing", ({ receiverId }) => {
      const receiverSocketId = userSocketMap.get(receiverId);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("userTyping", {
          userId,
        });
      }
    });

    socket.on("stop-typing", ({ receiverId }) => {
      const receiverSocketId = userSocketMap.get(receiverId);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("userStopTyping", {
          userId,
        });
      }
    });

    socket.on("disconnect", async () => {
      userSocketMap.delete(userId);

      try {
        const lastSeen = new Date();
        await User.findByIdAndUpdate(userId, {
          status: false,
          lastSeen: lastSeen,
        });
        socket.broadcast.emit("user-offline", {
          userId,
          lastSeen: lastSeen,
        });
      } catch (err) {
        console.error("Socket disconnect DB error:", err.message);
      }
    });
  });

  return io;
};

export default initSocket;
