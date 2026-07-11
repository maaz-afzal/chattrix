import User from "../models/User.js";
import bcrypt from "bcrypt";
import { body, validationResult } from "express-validator";

const validateMiddleware = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  next();
};

const validateUpdateProfile = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Name must be between 1 and 50 characters."),

  body("bio")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Bio cannot exceed 100 characters."),

  body("profileImage")
    .optional()
    .isURL()
    .withMessage("Invalid profile image URL."),
];

// Get all users except current user
const getAllUsers = async (req, res) => {
  try {
    const userId = req.user.id;

    const users = await User.find({
      _id: { $ne: userId },
      isDeleted: false,
    })
      .select("-password")
      .limit(50);

    res.status(200).json(users);
  } catch (err) {
    console.error("getAllUsers error:", err.message);

    res.status(500).json({
      msg: "Something went wrong.",
    });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        msg: "User not found.",
      });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("getCurrentUser error:", err.message);

    res.status(500).json({
      msg: "Something went wrong.",
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({
      _id: id,
      isDeleted: false,
    }).select("-password");

    if (!user) {
      return res.status(404).json({
        msg: "User not found.",
      });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("getUserById error:", err.message);

    res.status(500).json({
      msg: "Something went wrong.",
    });
  }
};

const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        msg: "Search query is required.",
      });
    }

    const users = await User.find({
      _id: {
        $ne: req.user.id,
      },

      isDeleted: false,

      $or: [
        {
          name: {
            $regex: query,
            $options: "i",
          },
        },

        {
          email: {
            $regex: query,
            $options: "i",
          },
        },
      ],
    })
      .select("-password")
      .limit(20);

    res.status(200).json(users);
  } catch (err) {
    console.error("searchUsers error:", err.message);

    res.status(500).json({
      msg: "Something went wrong.",
    });
  }
};

const updateProfile = [
  validateUpdateProfile,
  validateMiddleware,

  async (req, res) => {
    try {
      const { name, bio, profileImage, currentPassword, newPassword } =
        req.body;

      const user = await User.findById(req.user.id).select("+password");

      if (!user) {
        return res.status(404).json({
          msg: "User not found.",
        });
      }

      if (name !== undefined) {
        user.name = name;
      }

      if (bio !== undefined) {
        user.bio = bio;
      }

      if (profileImage !== undefined) {
        user.profileImage = profileImage;
      }

      if (currentPassword && newPassword) {
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
      }

      const updatedUser = await user.save();

      const userData = updatedUser.toObject();

      delete userData.password;

      res.status(200).json({
        msg: "Profile updated successfully.",
        user: userData,
      });
    } catch (err) {
      console.error("updateProfile error:", err.message);

      res.status(500).json({
        msg: "Something went wrong.",
      });
    }
  },
];

const deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      isDeleted: true,
      isOnline: false,
    });

    res.status(200).json({
      msg: "Account deleted successfully.",
    });
  } catch (err) {
    console.error("deleteAccount error:", err.message);

    res.status(500).json({
      msg: "Something went wrong.",
    });
  }
};

export {
  getAllUsers,
  getCurrentUser,
  getUserById,
  searchUsers,
  updateProfile,
  deleteAccount,
};
