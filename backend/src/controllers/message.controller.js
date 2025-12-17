import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/Message.js";
import User from "../models/User.js";

export const getAllContacts = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in getAllContacts:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMessagesByUserId = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: userToChatId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image, audio } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    if (!text && !image && !audio) {
      return res.status(400).json({ message: "Text, image, or audio is required." });
    }
    if (senderId.equals(receiverId)) {
      return res.status(400).json({ message: "Cannot send messages to yourself." });
    }
    const receiverExists = await User.exists({ _id: receiverId });
    if (!receiverExists) {
      return res.status(404).json({ message: "Receiver not found." });
    }

    let imageUrl;
    if (image) {
      // upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    let audioUrl;
    if (audio) {
      // upload base64 audio to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(audio, {
        resource_type: "video", // Cloudinary treats audio as video
        format: "mp3"
      });
      audioUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
      audio: audioUrl,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getChatPartners = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    // find all the messages where the logged-in user is either sender or receiver
    const messages = await Message.find({
      $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
    });

    const chatPartnerIds = [
      ...new Set(
        messages.map((msg) =>
          msg.senderId.toString() === loggedInUserId.toString()
            ? msg.receiverId.toString()
            : msg.senderId.toString()
        )
      ),
    ];

    const chatPartners = await User.find({ _id: { $in: chatPartnerIds } }).select("-password");

    res.status(200).json(chatPartners);
  } catch (error) {
    console.error("Error in getChatPartners: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const addReaction = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { emoji } = req.body;
    const userId = req.user._id;

    if (!emoji) {
      return res.status(400).json({ message: "Emoji is required" });
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Check if user can react to this message (must be sender or receiver)
    if (
      message.senderId.toString() !== userId.toString() &&
      message.receiverId.toString() !== userId.toString()
    ) {
      return res.status(403).json({ message: "Cannot react to this message" });
    }

    // Find existing reaction or create new one
    let reaction = message.reactions.find(r => r.emoji === emoji);
    if (!reaction) {
      reaction = { emoji, users: [], count: 0 };
      message.reactions.push(reaction);
    }

    // Check if user already reacted
    if (reaction.users.includes(userId)) {
      return res.status(400).json({ message: "Already reacted with this emoji" });
    }

    reaction.users.push(userId);
    reaction.count += 1;

    await message.save();

    // Emit real-time update
    const receiverSocketId = getReceiverSocketId(
      message.senderId.toString() === userId.toString() ? message.receiverId : message.senderId
    );
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("reactionUpdate", {
        messageId,
        reactions: message.reactions,
      });
    }

    res.status(200).json(message.reactions);
  } catch (error) {
    console.log("Error in addReaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const removeReaction = async (req, res) => {
  try {
    const { messageId, emoji } = req.params;
    const userId = req.user._id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    const reactionIndex = message.reactions.findIndex(r => r.emoji === emoji);
    if (reactionIndex === -1) {
      return res.status(404).json({ message: "Reaction not found" });
    }

    const reaction = message.reactions[reactionIndex];
    const userIndex = reaction.users.indexOf(userId);

    if (userIndex === -1) {
      return res.status(400).json({ message: "User has not reacted with this emoji" });
    }

    reaction.users.splice(userIndex, 1);
    reaction.count -= 1;

    // Remove reaction if no users left
    if (reaction.count === 0) {
      message.reactions.splice(reactionIndex, 1);
    }

    await message.save();

    // Emit real-time update
    const receiverSocketId = getReceiverSocketId(
      message.senderId.toString() === userId.toString() ? message.receiverId : message.senderId
    );
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("reactionUpdate", {
        messageId,
        reactions: message.reactions,
      });
    }

    res.status(200).json(message.reactions);
  } catch (error) {
    console.log("Error in removeReaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
