import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { handleConnection, handleDisconnect } from "./events.js";

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication error: No token provided."));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
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
