import { Server } from "socket.io";
import Message from "../models/Message.js";

const userSocketMap = new Map();

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
    },
  });

  io.on("connection", (socket) => {
    socket.on("setup", (userData) => {
      socket.userId = userData.id;
      userSocketMap.set(userData.id, socket.id);
    });

    socket.on("send-message", async ({ receiverId, message }) => {
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

    socket.on("disconnect", () => {
      if (socket.userId) {
        userSocketMap.delete(socket.userId);
      }
    });
  });

  return io;
};

export default initSocket;
