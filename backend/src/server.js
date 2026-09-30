import "dotenv/config";
import { database } from "./config/index.js";
import app from "./app.js";
import http from "http";
import mongoose from "mongoose";
import initSocket from "./socket/index.js";

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
initSocket(server);

const PORT = process.env.PORT || 3000;

const start = async () => {
  await database();
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

const shutdown = async (signal) => {
  console.log(`${signal} received. Shutting down gracefully...`);

  server.close(async () => {
    try {
      await mongoose.connection.close();
      console.log("MongoDB connection closed");
      process.exit(0);
    } catch (err) {
      console.error("Error during shutdown:", err);
      process.exit(1);
    }
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

start();