import express from "express";
import {
  createStory,
  getStories,
  getMyStories,
  viewStory,
  deleteStory,
} from "../controllers/story.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

const router = express.Router();

router.use(arcjetProtection, protectRoute);

router.post("/create", createStory);
router.get("/", getStories);
router.get("/my", getMyStories);
router.put("/:storyId/view", viewStory);
router.delete("/:storyId", deleteStory);

export default router;