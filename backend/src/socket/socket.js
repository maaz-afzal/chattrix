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

  io.on("connection", async (socket) => {
    await handleConnection(socket, io);

    socket.on("typing", ({ receiverId }) => {
      io.to(receiverId).emit("user-typing", { userId: socket.userId });
    });

    socket.on("stop-typing", ({ receiverId }) => {
      io.to(receiverId).emit("user-stop-typing", { userId: socket.userId });
    });

    socket.on("disconnect", async () => {
      await handleDisconnect(socket, io);
    });
  });

  return io;
};

export default initSocket;
