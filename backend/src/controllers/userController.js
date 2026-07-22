import { userService } from "../services/index.js";
import { catchAsync } from "../middlewares/errorHandler.js";
import { sendResponse } from "../utils/responseHandler.js";

export const getAllUsers = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const users = await userService.getAllUsers(req.user.id, page, limit);
  sendResponse(res, 200, users);
});

export const getCurrentUser = catchAsync(async (req, res) => {
  const user = await userService.getCurrentUser(req.user.id);
  sendResponse(res, 200, user);
});

export const getUserById = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  sendResponse(res, 200, user);
});

export const searchUsers = catchAsync(async (req, res) => {
  const users = await userService.searchUsers(req.query.query, req.user.id);
  sendResponse(res, 200, users);
});

export const updateProfile = catchAsync(async (req, res) => {
  const user = await userService.updateProfile(req.user.id, req.body);
  sendResponse(res, 200, user, "Profile updated successfully.");
});