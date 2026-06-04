import { io } from "socket.io-client";

let socket = null;

export const connectSocket = (userId) => {
  if (!userId) {
    return null;
  }

  if (socket) {
    return socket;
  }

  socket = io("http://localhost:5000", {
    query: { userId: userId },
  });

  socket.on("connect", () => {
    console.log("connected:", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("disconnected");
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    console.log("Socket not connected. Call connectSocket first");
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
