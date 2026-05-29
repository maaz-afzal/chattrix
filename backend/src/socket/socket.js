import { Server } from "socket.io";

const initSocket = (server) => {
  const io = new Server(server, {});
  io.on("connection", (socket) => {
    console.log("User connected");
    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

export default initSocket;
