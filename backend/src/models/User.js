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
    bio: {
      type: String,
      default: "Hello World!",
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["online", "offline"],
      default: "offline",
    },
    avatar: {
      type: String,
      default: function () {
        return this.name
          ? this.name.charAt(0).toUpperCase()
          : "https://ui-avatars.com/api/?name=Chattrix&background=random&bold=true";
      },
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", UserSchema);

export default User;
