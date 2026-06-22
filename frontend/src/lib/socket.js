import { io } from "socket.io-client";

const socketUrl =
  import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

let socket = null;

export const connectSocket = (token) => {
  if (!token) return null;
  if (socket?.connected) return socket;

  socket = io(socketUrl, {
    auth: { token },
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