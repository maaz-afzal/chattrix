import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  bio: "",
  profileImage: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,

  reducers: {
    updateProfile(state, action) {
      state.name = action.payload.name;
      state.bio = action.payload.bio;
      state.profileImage = action.payload.profileImage;
    },
  },
});

export const { updateProfile } = userSlice.actions;
export default userSlice.reducer;