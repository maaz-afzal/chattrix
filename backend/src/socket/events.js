import User from "../models/User.js";

export const handleConnection = async (socket, io) => {
  const { userId } = socket;
  socket.join(userId);

  try {
    const sockets = await io.in(userId).fetchSockets();
    const wasOnline = sockets.length > 1;

    await User.findByIdAndUpdate(userId, { isOnline: true });

    if (!wasOnline) {
      socket.broadcast.emit("user-online", userId);
    }

    const onlineUsers = await User.find({
      isOnline: true,
      isDeleted: false,
    }).select("_id");

    socket.emit(
      "online-users",
      onlineUsers.map((user) => user._id.toString()),
    );
  } catch (err) {
    console.error("Socket connect DB error:", err);
  }
};

export const handleDisconnect = async (socket, io) => {
  const { userId } = socket;

  try {
    const sockets = await io.in(userId).fetchSockets();
    const stillConnected = sockets.length > 0;

    if (!stillConnected) {
      io.emit("user-stop-typing", { userId });
      const lastSeen = new Date();
      await User.findByIdAndUpdate(userId, {
        isOnline: false,
        lastSeen,
      });
      socket.broadcast.emit("user-offline", { userId, lastSeen });
    }
  } catch (err) {
    console.error("Socket disconnect DB error:", err);
  }
};
