import userService from "../services/userService.js";
import { sendResponse } from "../utils/responseHandler.js";
import { getIo } from "../socket/socket.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const users = await userService.getAllUsers(req.user.id, page, limit);
    sendResponse(res, 200, users);
  } catch (err) {
    next(err);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await userService.getCurrentUser(req.user.id);
    sendResponse(res, 200, user);
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    sendResponse(res, 200, user);
  } catch (err) {
    next(err);
  }
};

export const searchUsers = async (req, res, next) => {
  try {
    const users = await userService.searchUsers(req.query.query, req.user.id);
    sendResponse(res, 200, users);
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const user = await userService.updateProfile(req.user.id, req.body);

    getIo().emit("user-updated", user);

    sendResponse(res, 200, user, "Profile updated successfully.");
  } catch (err) {
    next(err);
  }
};