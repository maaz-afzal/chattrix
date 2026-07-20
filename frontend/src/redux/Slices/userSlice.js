import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allUsers: [],
  onlineUsers: [],
  selectedUser: null,
  selectedConversationId: null,
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setAllUsers(state, action) {
      state.allUsers = action.payload;
    },
    setOnlineUsers(state, action) {
      state.onlineUsers = action.payload;
    },
    addOnlineUser(state, action) {
      if (!state.onlineUsers.includes(action.payload)) {
        state.onlineUsers.push(action.payload);
      }
    },
    removeOnlineUser(state, action) {
      state.onlineUsers = state.onlineUsers.filter(
        (id) => id !== action.payload,
      );
    },
    setSelectedUser(state, action) {
      state.selectedUser = action.payload;
    },
    setSelectedConversationId(state, action) {
      state.selectedConversationId = action.payload;
    },
    updateUserStatus(state, action) {
      const { userId, isOnline } = action.payload;
      const user = state.allUsers.find((u) => u._id === userId);
      if (user) user.isOnline = isOnline;
    },
  },
});

export const {
  setAllUsers,
  setOnlineUsers,
  addOnlineUser,
  removeOnlineUser,
  setSelectedUser,
  setSelectedConversationId,
  updateUserStatus,
} = userSlice.actions;

export default userSlice.reducer;
