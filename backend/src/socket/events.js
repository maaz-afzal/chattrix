import User from "../models/User.js";

export const handleConnection = async (socket, io) => {
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
};

export const handleDisconnect = async (socket, io) => {
  const { userId } = socket;

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
};