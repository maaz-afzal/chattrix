import { Server } from "socket.io";
import Message from "../models/Message.js";

const userSocketMap = new Map();

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("setup", (userData) => {
      socket.userId = userData.id;

      userSocketMap.set(userData.id, socket.id);

      console.log(`User ${userData.id} connected with socket ${socket.id}`);
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
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("disconnect", () => {
      if (socket.userId) {
        userSocketMap.delete(socket.userId);

        console.log(`user ${socket.userId} removed from map`);
      }
    });
  });

  return io;
};

export default initSocket;
