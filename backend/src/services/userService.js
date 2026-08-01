import User from "../models/User.js";
import AppError from "../utils/AppError.js";
import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.js";

const getAllUsers = async (userId, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;

  const users = await User.find({
    _id: { $ne: userId },
    isDeleted: false,
  })
    .select("-password")
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  return users;
};

const getCurrentUser = async (userId) => {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  return user;
};

const getUserById = async (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new AppError("Invalid user id", 400);
  }

  const user = await User.findOne({
    _id: userId,
    isDeleted: false,
  }).select("-password");

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  return user;
};

const searchUsers = async (query, currentUserId) => {
  if (!query) {
    throw new AppError("Search query is required.", 400);
  }

  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const users = await User.find({
    _id: { $ne: currentUserId },
    isDeleted: false,
    $or: [
      { name: { $regex: escaped, $options: "i" } },
      { email: { $regex: escaped, $options: "i" } },
    ],
  })
    .select("-password")
    .limit(20);

  return users;
};

const updateProfile = async (userId, updateData) => {
  const { name, bio, profileImage } = updateData;

  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  if (name !== undefined) user.name = name;
  if (bio !== undefined) user.bio = bio;
  if (profileImage !== undefined) {
    if (profileImage === "" || profileImage === null) {
      user.profileImage = null;
    } else if (profileImage.startsWith("data:image")) {
      const result = await cloudinary.uploader.upload(profileImage, {
        folder: "chattrix/profile",
        resource_type: "image",
      });
      user.profileImage = result.secure_url;
    } else {
      user.profileImage = profileImage;
    }
  }

  const updatedUser = await user.save();

  return updatedUser.toObject();
};

export default {
  getAllUsers,
  getCurrentUser,
  getUserById,
  searchUsers,
  updateProfile,
};