import express from "express";

import {
  getAllUsers,
  getCurrentUser,
  getUserById,
  searchUsers,
  updateProfile,
  deleteAccount,
} from "../controllers/userController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import { apiLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

router.get("/", authMiddleware, getAllUsers);
router.get("/me", authMiddleware, getCurrentUser);
router.get("/search", apiLimiter, authMiddleware, searchUsers);
router.get("/:id", authMiddleware, getUserById);
router.put("/profile", authMiddleware, updateProfile);
router.delete("/account", authMiddleware, deleteAccount);

export default router;
