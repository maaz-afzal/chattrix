import User from "../models/User.js";
import bcrypt from "bcrypt";
import { body, validationResult } from "express-validator";
import generateToken from "../utils/generateToken.js";

const validateMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  next();
};

const validateRegister = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required.")
    .isLength({ max: 50 })
    .withMessage("Name cannot exceed 50 characters."),

  body("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Please enter a valid email."),

  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters."),
];

const validateLogin = [
  body("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Please enter a valid email."),

  body("password").notEmpty().withMessage("Password is required."),
];

const register = [
  validateRegister,
  validateMiddleware,

  async (req, res) => {
    try {
      const { name, email, password } = req.body;

      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(409).json({
          msg: "User already exists.",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
      });

      const token = generateToken(user._id);

      const userData = user.toObject();
      delete userData.password;

      res.status(201).json({
        msg: "Registration successful.",
        user: userData,
        token,
      });
    } catch (err) {
      console.error("register error:", err);
      res.status(500).json({
        msg: "Something went wrong.",
      });
    }
  },
];

const login = [
  validateLogin,
  validateMiddleware,

  async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return res.status(401).json({
          msg: "Invalid credentials.",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({
          msg: "Invalid credentials.",
        });
      }

      const token = generateToken(user._id);

      const userData = user.toObject();
      delete userData.password;

      res.status(200).json({
        msg: "Login successful.",
        user: userData,
        token,
      });
    } catch (err) {
      console.error("login error:", err);
      res.status(500).json({
        msg: "Something went wrong.",
      });
    }
  },
];

const logout = (req, res) => {
  res.status(200).json({
    msg: "Logout successful.",
  });
};

const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        msg: "User not found.",
      });
    }

    res.status(200).json({
      authenticated: true,
      user,
    });
  } catch (err) {
    console.error("checkAuth error:", err);
    res.status(500).json({
      msg: "Something went wrong.",
    });
  }
};

export { register, login, logout, checkAuth };
