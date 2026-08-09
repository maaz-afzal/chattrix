import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { handleConnection, handleDisconnect } from "./events.js";
import { messageService } from "../services/index.js";

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
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

  const onlineUserIds = new Set();

  io.on("connection", async (socket) => {
    onlineUserIds.add(socket.userId);
    await handleConnection(socket, io);

    socket.emit("online-users", [...onlineUserIds]);
    socket.on("typing", ({ receiverId }) => {
      io.to(receiverId).emit("user-typing", { userId: socket.userId });
    });

    socket.on("stop-typing", ({ receiverId }) => {
      io.to(receiverId).emit("user-stop-typing", { userId: socket.userId });
    });

    socket.on("mark-delivered", async ({ messageId, senderId }) => {
      try {
        const message = await messageService.markDelivered(messageId);
        io.to(senderId).emit("message-delivered", message);
      } catch (err) {
        console.error("mark-delivered error:", err);
      }
    });

    socket.on("disconnect", async () => {
      const sockets = await io.in(socket.userId).fetchSockets();
      if (sockets.length === 0) {
        onlineUserIds.delete(socket.userId);
      }
      await handleDisconnect(socket, io);
    });
  });

  return io;
};

export default initSocket;
