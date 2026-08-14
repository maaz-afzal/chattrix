import { createSlice } from "@reduxjs/toolkit";
import { logout } from "./authSlice.js";

const initialState = {
  selectedConversationId: null,
  typingUsers: {},
  lastSeenByUser: {},
  defaultListRefresh: 0,
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setSelectedConversationId(state, action) {
      state.selectedConversationId = action.payload;
    },
    setTyping(state, action) {
      state.typingUsers[action.payload] = true;
    },
    clearTyping(state, action) {
      delete state.typingUsers[action.payload];
    },
    setLastSeen(state, action) {
      const { userId, lastSeen } = action.payload;
      state.lastSeenByUser[userId] = lastSeen;
    },
    bumpListRefresh(state) {
      state.defaultListRefresh += 1;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout, () => initialState);
  },
});

export const {
  setSelectedConversationId,
  setTyping,
  clearTyping,
  setLastSeen,
  bumpListRefresh,
} = userSlice.actions;

export default userSlice.reducer;
