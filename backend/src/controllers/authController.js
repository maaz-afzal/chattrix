import { authService } from "../services/index.js";
import { catchAsync } from "../middlewares/errorHandler.js";
import { sendResponse } from "../utils/responseHandler.js";

export const register = catchAsync(async (req, res) => {
  const { user, token } = await authService.register(req.body);
  sendResponse(res, 201, { user, token }, "Registration successful.");
});

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const { user, token } = await authService.login(email, password);
  sendResponse(res, 200, { user, token }, "Login successful.");
});

export const logout = (req, res) => {
  sendResponse(res, 200, null, "Logout successful.");
};

export const checkAuth = catchAsync(async (req, res) => {
  const user = await authService.checkAuth(req.user.id);
  sendResponse(res, 200, { authenticated: true, user });
});

export const changePassword = catchAsync(async (req, res) => {
  await authService.changePassword(req.user.id, req.body);
  sendResponse(res, 200, null, "Password changed successfully.");
});

export const deleteAccount = catchAsync(async (req, res) => {
  await authService.deleteAccount(req.user.id);
  sendResponse(res, 200, null, "Account deleted successfully.");
});
