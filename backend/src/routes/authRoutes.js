import { register, login, logout, checkAuth, deleteAccount, changePassword } from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import express from "express";
import { authLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/logout", authMiddleware, logout);
router.get("/check", authMiddleware, checkAuth);
router.put("/password", authMiddleware, changePassword);
router.delete("/delete", authMiddleware, deleteAccount);

export default router;
