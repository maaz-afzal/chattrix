import User from "../models/User.js";
import bcrypt from "bcrypt";

const getAllUsers = async (req, res) => {
  try {
    const userId = req.user.id;
    const users = await User.find({ _id: { $ne: userId } }).select("-password");

    if (!users) {
      return res.status(404).json({ msg: "Users not found" });
    }

    res.status(200).json(users);
  } catch (err) {
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
    res.status(500).json({ msg: "Something went wrong" });
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ msg: "Something went wrong" });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      name,
      email,
      avatar,
      bio,
      currPassword,
      newPassword,
      confirmPassword,
    } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (name || email || avatar || bio) {
      user.name = name || user.name;
      user.email = email || user.email;
      user.avatar = avatar || user.avatar;
      user.bio = bio || user.bio;
    }
    if (currPassword && newPassword && confirmPassword) {
      const isMatch = await bcrypt.compare(currPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ msg: "Passwords do not match" });
      }
      user.password = await bcrypt.hash(newPassword, 12);
      await user.save();
      return res.status(200).json({ msg: "Password updated successfully!" });
    }

    await user.save();

    res.status(200).json({ msg: "User updated successfully!" });
  } catch (err) {
    res.status(500).json({ msg: "Something went wrong" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({ msg: "User deleted successfully!" });
  } catch (err) {
    res.status(500).json({ msg: "Something went wrong" });
  }
};

export { getAllUsers, getUser, getUserById, updateUser, deleteUser };
