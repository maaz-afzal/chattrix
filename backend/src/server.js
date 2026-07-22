import "dotenv/config";

import { database } from "./config/index.js";
import app from "./app.js";
import http from "http";
import initSocket from "./socket/index.js";
import { setIo } from "./controllers/messageController.js";

const requiredEnv = [
  "MONGODB_URI",
  "JWT_SECRET",
  "GEMINI_API_KEY",
  "GEMINI_MODEL",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

const missingEnv = requiredEnv.filter((key) => !process.env[key]);
if (missingEnv.length > 0) {
  console.error(
    "Missing required environment variables:",
    missingEnv.join(", "),
  );
  process.exit(1);
}

const server = http.createServer(app);
const io = initSocket(server);
setIo(io);

const PORT = process.env.PORT || 3000;

const start = async () => {
  await database();
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();