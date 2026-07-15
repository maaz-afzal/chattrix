import { createSlice } from "@reduxjs/toolkit";

const token = localStorage.getItem("token");
let user = null;

try {
  const saved = localStorage.getItem("user");
  if (saved) user = JSON.parse(saved);
} catch {
  localStorage.removeItem("user");
}

const initialState = {
  isLoggedIn: Boolean(token),
  user: user,
  token: token || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      const { token, user } = action.payload;
      state.isLoggedIn = true;
      state.token = token;
      state.user = { ...user, isOnline: true };
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(state.user));
    },
    logout(state) {
      state.isLoggedIn = false;
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
