import {
  register,
  login,
  logout,
  checkAuth,
} from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import express from "express";
import { authLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/logout", authMiddleware, logout);
router.get("/check-auth", authMiddleware, checkAuth);

export default router;
