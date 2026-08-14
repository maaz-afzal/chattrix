import authService from "../services/authService.js";
import { sendResponse } from "../utils/responseHandler.js";

export const register = async (req, res, next) => {
  try {
    const { user, token } = await authService.register(req.body);
    sendResponse(res, 201, { user, token }, "Registration successful.");
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.login(email, password);
    sendResponse(res, 200, { user, token }, "Login successful.");
  } catch (err) {
    next(err);
  }
};

export const logout = (req, res) => {
  sendResponse(res, 200, null, "Logout successful.");
};

export const checkAuth = async (req, res, next) => {
  try {
    const user = await authService.checkAuth(req.user.id);
    sendResponse(res, 200, { authenticated: true, user });
  } catch (err) {
    next(err);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    await authService.changePassword(req.user.id, req.body);
    sendResponse(res, 200, null, "Password changed successfully.");
  } catch (err) {
    next(err);
  }
};

export const deleteAccount = async (req, res, next) => {
  try {
    await authService.deleteAccount(req.user.id);
    sendResponse(res, 200, null, "Account deleted successfully.");
  } catch (err) {
    next(err);
  }
};
