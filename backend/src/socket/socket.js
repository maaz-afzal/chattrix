import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

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
    const { userId } = socket;

    socket.join(userId);

    try {
      await User.findByIdAndUpdate(userId, {
        isOnline: true,
      });

      socket.broadcast.emit("user-online", userId);
    } catch (err) {
      console.error("Socket connect DB error:", err);
    }

    socket.on("typing", ({ receiverId }) => {
      io.to(receiverId).emit("user-typing", {
        userId,
      });
    });

    socket.on("stop-typing", ({ receiverId }) => {
      io.to(receiverId).emit("user-stop-typing", {
        userId,
      });
    });

    socket.on("disconnect", async () => {
      const sockets = await io.in(userId).fetchSockets();

      if (sockets.length === 0) {
        try {
          const lastSeen = new Date();

          await User.findByIdAndUpdate(userId, {
            isOnline: false,
            lastSeen,
          });

          socket.broadcast.emit("user-offline", {
            userId,
            lastSeen,
          });
        } catch (err) {
          console.error("Socket disconnect DB error:", err);
        }
      }
    });
  });

  return io;
};

export default initSocket;
