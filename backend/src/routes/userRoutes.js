import express from "express";

import {
  getAllUsers,
  getCurrentUser,
  getUserById,
  searchUsers,
  updateProfile,
} from "../controllers/userController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import { apiLimiter } from "../middlewares/rateLimiter.js";
import { validateMiddleware } from "../middlewares/validationMiddleware.js";
import { validateProfile } from "../validations/userValidation.js"

const router = express.Router();

router.get("/", authMiddleware, getAllUsers);
router.get("/me", authMiddleware, getCurrentUser);
router.get("/search", apiLimiter, authMiddleware, searchUsers);
router.get("/:id", authMiddleware, getUserById);
router.put("/update", authMiddleware, validateProfile, validateMiddleware, updateProfile);

export default router;
