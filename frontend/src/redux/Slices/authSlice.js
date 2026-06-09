import { createSlice } from "@reduxjs/toolkit";

const savedUser = localStorage.getItem("user");
const savedToken = localStorage.getItem("token");

const initialState = {
  isLoggedIn: savedToken ? true : false,
  user: savedUser ? JSON.parse(savedUser) : null,
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
