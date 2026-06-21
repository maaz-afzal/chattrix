import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      validate: {
        validator: function () {
          return this.text || this.image;
        },
      },
    },
    image: {
      type: String,
      validate: {
        validator: function () {
          return this.text || this.image;
        },
      },
    },
    deletedFor: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Message = mongoose.model("Message", MessageSchema);

export default Message;
