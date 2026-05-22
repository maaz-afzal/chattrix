import { config } from "dotenv";
import express from "express";
import db from "./config/db.js";

config();

const app = express();
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await db();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.log("Failed to start server:", err);
  }
};

startServer();
