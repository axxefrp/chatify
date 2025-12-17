import Story from "../models/Story.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";

export const createStory = async (req, res) => {
  try {
    const { media, mediaType } = req.body;
    const userId = req.user._id;

    if (!media || !mediaType) {
      return res.status(400).json({ message: "Media and media type are required" });
    }

    if (!["image", "video"].includes(mediaType)) {
      return res.status(400).json({ message: "Invalid media type" });
    }

    // Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(media, {
      resource_type: mediaType === "video" ? "video" : "image",
    });

    const newStory = new Story({
      user: userId,
      media: uploadResponse.secure_url,
      mediaType,
    });

    await newStory.save();

    res.status(201).json(newStory);
  } catch (error) {
    console.log("Error in createStory:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getStories = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all users except current user
    const users = await User.find({ _id: { $ne: userId } }).select("_id");

    // Get active stories from these users (not expired and not viewed by current user)
    const stories = await Story.find({
      user: { $in: users.map(u => u._id) },
      expiresAt: { $gt: new Date() },
    })
    .populate("user", "fullName profilePic")
    .sort({ createdAt: -1 });

    // Group stories by user
    const storiesByUser = {};
    stories.forEach(story => {
      const userId = story.user._id.toString();
      if (!storiesByUser[userId]) {
        storiesByUser[userId] = {
          user: story.user,
          stories: [],
          hasUnviewed: !story.viewers.includes(userId)
        };
      }
      storiesByUser[userId].stories.push(story);
      if (!story.viewers.includes(userId)) {
        storiesByUser[userId].hasUnviewed = true;
      }
    });

    res.status(200).json(Object.values(storiesByUser));
  } catch (error) {
    console.log("Error in getStories:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMyStories = async (req, res) => {
  try {
    const userId = req.user._id;

    const stories = await Story.find({
      user: userId,
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    res.status(200).json(stories);
  } catch (error) {
    console.log("Error in getMyStories:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const viewStory = async (req, res) => {
  try {
    const { storyId } = req.params;
    const userId = req.user._id;

    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    // Check if user already viewed
    if (!story.viewers.includes(userId)) {
      story.viewers.push(userId);
      await story.save();
    }

    res.status(200).json(story);
  } catch (error) {
    console.log("Error in viewStory:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteStory = async (req, res) => {
  try {
    const { storyId } = req.params;
    const userId = req.user._id;

    const story = await Story.findOne({ _id: storyId, user: userId });
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    // Delete from Cloudinary
    if (story.media) {
      const publicId = story.media.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId, {
        resource_type: story.mediaType === "video" ? "video" : "image"
      });
    }

    await Story.findByIdAndDelete(storyId);

    res.status(200).json({ message: "Story deleted successfully" });
  } catch (error) {
    console.log("Error in deleteStory:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};