import { register, login, logout, checkAuth } from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import express from "express";
import { rateLimit } from "express-rate-limit";

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    msg: "Too many requests from this IP, please try again after 15 minutes",
  },
});

const router = express.Router();

router.post("/register", apiLimiter, register);
router.post("/login", apiLimiter, login);
router.post("/logout", apiLimiter, authMiddleware, logout);
router.get("/check-auth", apiLimiter, authMiddleware, checkAuth);

export default router;
