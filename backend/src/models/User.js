import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    bio: {
      type: String,
      default: "Hello World!",
      maxlength: 100,
    },
    status: {
      type: Boolean,
      default: false,
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
    profileImage: {
      type: String,
      default: `https://ui-avatars.com/api/?name=${this.name.charAt(0).toUpperCase()}&background=random&bold=true`,
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", UserSchema);

export default User;
