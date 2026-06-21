import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";

const validateMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const validateRegister = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ max: 50 })
    .withMessage("Name cannot exceed 50 characters"),
  body("email").trim().notEmpty().isEmail().withMessage("Invalid email"),
  body("password")
    .trim()
    .notEmpty()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

const validateLogin = [
  body("email").trim().notEmpty().isEmail().withMessage("Invalid email"),
  body("password").trim().notEmpty().withMessage("Password is required"),
];

const register = [
  validateRegister,
  validateMiddleware,
  async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ msg: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = new User({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
      });

      await newUser.save();

      const userData = newUser.toObject();
      delete userData.password;

      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      res.status(201).json({
        msg: "User created successfully!",
        user: userData,
        token,
      });
    } catch (err) {
      console.error("register error:", err.message);
      res.status(500).json({ msg: "Something went wrong" });
    }
  },
];

const login = [
  validateLogin,
  validateMiddleware,
  async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      const userData = user.toObject();
      delete userData.password;

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      res.status(200).json({
        msg: "User logged in successfully!",
        user: userData,
        token,
      });
    } catch (err) {
      console.error("login error:", err.message);
      res.status(500).json({ msg: "Something went wrong" });
    }
  },
];

export { register, login };
