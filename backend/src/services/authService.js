import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import AppError from "../utils/AppError.js";

const register = async (userData) => {
  const { name, email, password } = userData;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError("User already exists.", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const token = generateToken(user._id);

  const userDataObj = user.toObject();
  delete userDataObj.password;

  return { user: userDataObj, token };
};

const login = async (email, password) => {
  const user = await User.findOne({
    email,
    isDeleted: false,
  }).select("+password");

  if (!user) {
    throw new AppError("Invalid credentials.", 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new AppError("Invalid credentials.", 401);
  }

  const token = generateToken(user._id);

  const userData = user.toObject();
  delete userData.password;

  return { user: userData, token };
};

const changePassword = async (userId, passwordData) => {
  const { currentPassword, newPassword, confirmPassword } = passwordData;

  if (!currentPassword || !newPassword || !confirmPassword) {
    throw new AppError("All fields are required.", 400);
  }

  if (newPassword !== confirmPassword) {
    throw new AppError("New password and confirm password do not match.", 400);
  }

  if (newPassword.length < 6) {
    throw new AppError("Password must be at least 6 characters.", 400);
  }

  const user = await User.findById(userId).select("+password");

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    throw new AppError("Current password is incorrect.", 400);
  }

  user.password = await bcrypt.hash(newPassword, 12);
  await user.save();

  return true;
};

const deleteAccount = async (userId) => {
  const user = await User.findByIdAndUpdate(
    userId,
    {
      isDeleted: true,
      isOnline: false,
    },
    { new: true },
  );

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  return true;
};

const checkAuth = async (userId) => {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  return user;
};

export default {
  register,
  login,
  changePassword,
  deleteAccount,
  checkAuth,
};