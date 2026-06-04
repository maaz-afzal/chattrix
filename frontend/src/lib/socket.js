import { io } from "socket.io-client";

const socketUrl = import.meta.env.VITE_SOCKET_URL;

let socket = null;

export const connectSocket = (userId) => {
  if (!userId) return null;
  if (socket) return socket;

  socket = io(socketUrl, {
    query: { userId: userId },
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) return null;
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
