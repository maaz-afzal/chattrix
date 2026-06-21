import mongoose from "mongoose";
import User from "../models/User.js";
import Message from "../models/Message.js";
import bcrypt from "bcrypt";

const getAllUsers = async (req, res) => {
  try {
    const userId = req.user.id;
    const users = await User.find({ _id: { $ne: userId } }).select("-password");

    res.status(200).json(users);
  } catch (err) {
    console.error("getAllUsers error:", err.message);
    res.status(500).json({ msg: "Something went wrong" });
  }
};

const getUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("getUser error:", err.message);
    res.status(500).json({ msg: "Something went wrong" });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid user ID" });
    }

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("getUserById error:", err.message);
    res.status(500).json({ msg: "Something went wrong" });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, avatar, bio, currPassword, newPassword, confirmPassword } =
      req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (name !== undefined) user.name = name.trim() || user.name;
    if (avatar !== undefined) user.avatar = avatar || user.avatar;
    if (bio !== undefined) user.bio = bio || user.bio;

    if (currPassword && newPassword && confirmPassword) {
      const isMatch = await bcrypt.compare(currPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Current password is incorrect" });
      }
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ msg: "New passwords do not match" });
      }
      if (newPassword.length < 6) {
        return res
          .status(400)
          .json({ msg: "Password must be at least 6 characters" });
      }
      user.password = await bcrypt.hash(newPassword, 12);
    }

    const updatedUser = await user.save();
    const userData = updatedUser.toObject();
    delete userData.password;

    res.status(200).json({ msg: "User updated successfully!", user: userData });
  } catch (err) {
    console.error("updateUser error:", err.message);
    res.status(500).json({ msg: "Something went wrong" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    await Message.deleteMany({
      $or: [{ sender: userId }, { receiver: userId }],
    });

    await User.findByIdAndDelete(userId);

    res.status(200).json({ msg: "User deleted successfully!" });
  } catch (err) {
    console.error("deleteUser error:", err.message);
    res.status(500).json({ msg: "Something went wrong" });
  }
};

export { getAllUsers, getUser, getUserById, updateUser, deleteUser };
