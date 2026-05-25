import express from "express";
const router = express.Router();

import {
  getUser,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

router.get("/profile", getUser);
router.get("/profile/:id", getUserById);
router.put("/profile", updateUser);
router.delete("/profile", deleteUser);

export default router;