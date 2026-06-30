import { createSlice } from "@reduxjs/toolkit";

const safeParseUser = () => {
  try {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

const savedToken = localStorage.getItem("token");

const initialState = {
  isLoggedIn: Boolean(savedToken),
  user: safeParseUser(),
  token: savedToken || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      state.token = action.payload.token;
      const updatedUser = {
        ...action.payload.user,
        status: "online",
      };
      state.user = updatedUser;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    },

    logout(state) {
      state.isLoggedIn = false;
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    updateUser(state, action) {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
  },
});

export const { login, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
