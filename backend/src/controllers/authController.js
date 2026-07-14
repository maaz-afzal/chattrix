import User from "../models/User.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";
import {
  validateRegister,
  validateLogin,
  validateMiddleware,
} from "../middlewares/authValidation.js";

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

      const user = await User.findOne({ email, isDeleted: false }).select("+password");

      if (!user) {
        return res.status(401).json({
          msg: "Invalid credentials.",
        });
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
      }
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
    const user = await User.findById(req.user.id).select("-password");

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

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select("+password");

    if (!user) {
      return res.status(404).json({
        msg: "User not found.",
      });
    }

    if (!currentPassword || !newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);

      if (!isMatch) {
        return res.status(400).json({
          msg: "Current password is incorrect.",
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          msg: "Password must be at least 6 characters.",
        });
      }

      user.password = await bcrypt.hash(newPassword, 12);
      await user.save();

      return res.status(200).json({
        msg: "Password changed successfully.",
      });
    }
  } catch (err) {
    return res.status(500).json({
      msg: "Something went wrong",
    });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        isDeleted: true,
        isOnline: false,
      },
      { new: true },
    );

    if (!user) {
      return res.status(404).json({
        msg: "User not found.",
      });
    }

    return res.status(200).json({
      msg: "Account deleted successfully.",
    });
  } catch (err) {
    console.error("deleteAccount error:", err.message);
    return res.status(500).json({
      msg: "Something went wrong.",
    });
  }
};

export { register, login, logout, checkAuth, deleteAccount, changePassword };
