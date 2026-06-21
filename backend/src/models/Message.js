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
      maxlength: [2000, "Message cannot exceed 2000 characters"],
      validate: {
        validator: function () {
          return this.text || this.image;
        },
        message: "Message must have text or image",
      },
    },
    image: {
      type: String,
      validate: {
        validator: function () {
          return this.text || this.image;
        },
        message: "Message must have text or image",
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

MessageSchema.index({ sender: 1, receiver: 1 });
MessageSchema.index({ createdAt: -1 });

const Message = mongoose.model("Message", MessageSchema);

export default Message;
