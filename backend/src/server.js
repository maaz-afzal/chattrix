import { config } from "dotenv";
import db from "./config/db.js";
import app from "./app.js";
import http from "http";
import initSocket from "./socket/socket.js";
import { setIo } from "./controllers/messageController.js";

config();

const server = http.createServer(app);
const io = initSocket(server);
setIo(io);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await db();
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.log("Failed to start server:", err);
  }
};

startServer();
