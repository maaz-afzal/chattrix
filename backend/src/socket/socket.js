import { Server } from "socket.io";
import Message from "../models/Message.js";
import User from "../models/User.js";

export const userSocketMap = new Map();

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
    },
  });

  io.on("connection", async (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
      socket.userId = userId;
      userSocketMap.set(userId, socket.id);
      await User.findByIdAndUpdate(userId, { status: "online" });
      socket.broadcast.emit("user-online", userId);
    }

    socket.on("send-message", async ({ receiverId, message }) => {
      if (!socket.userId) return;

      try {
        const newMessage = await Message.create({
          sender: socket.userId,
          receiver: receiverId,
          text: message,
        });

        const receiverSocketId = userSocketMap.get(receiverId);

        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receive-message", newMessage);
        }

        io.to(socket.id).emit("message-sent", newMessage);
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("disconnect", async () => {
      if (socket.userId) {
        userSocketMap.delete(socket.userId);
        await User.findByIdAndUpdate(socket.userId, { status: "offline" });

        socket.broadcast.emit("user-offline", socket.userId);
      }
    });
  });

  return io;
};

export default initSocket;
