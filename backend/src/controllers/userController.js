import User from "../models/User.js";
import bcrypt from "bcryptjs";
import {
  validateMiddleware,
  validateProfile,
} from "../middlewares/userValidation.js";
import mongoose from "mongoose";

// Get all users except current user
const getAllUsers = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // count user documents (passing filter(user docs))
    const totalUsers = await User.countDocuments(filter);

    // exclude current user and deleted users +  fetch users with filter, pagination, and sorting
    const users = await User.find({ _id: { $ne: userId, isDeleted: false } })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    return res.status(200).json(users);
  } catch (err) {
    console.error("getAllUsers error:", err.message);

    return res.status(500).json({
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

    return res.status(200).json(user);
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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        msg: "Invalid user id",
      });
    }

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
  validateProfile,
  validateMiddleware,

  async (req, res) => {
    try {
      const { name, bio, profileImage } = req.body;

      const user = await User.findById(req.user.id);

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

      const updatedUser = await user.save();

      const userData = updatedUser.toObject();

      res.status(200).json({
        success: true,
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

export { getAllUsers, getCurrentUser, getUserById, searchUsers, updateProfile };
