import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    image: {
      type: String,
    },
    audio: {
      type: String,
    },
    reactions: [{
      emoji: {
        type: String,
        required: true,
      },
      users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }],
      count: {
        type: Number,
        default: 0,
      },
    }],
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
