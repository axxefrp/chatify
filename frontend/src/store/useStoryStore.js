import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useStoryStore = create((set, get) => ({
  stories: [],
  myStories: [],
  isLoading: false,
  selectedStoryUser: null,
  currentStoryIndex: 0,

  createStory: async (storyData) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.post("/stories/create", storyData);
      set((state) => ({
        myStories: [res.data, ...state.myStories],
      }));
      toast.success("Story created!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create story");
    } finally {
      set({ isLoading: false });
    }
  },

  getStories: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/stories");
      set({ stories: res.data });
    } catch (error) {
      toast.error("Failed to load stories");
    } finally {
      set({ isLoading: false });
    }
  },

  getMyStories: async () => {
    try {
      const res = await axiosInstance.get("/stories/my");
      set({ myStories: res.data });
    } catch (error) {
      toast.error("Failed to load your stories");
    }
  },

  viewStory: async (storyId) => {
    try {
      await axiosInstance.put(`/stories/${storyId}/view`);
    } catch (error) {
      console.error("Failed to mark story as viewed");
    }
  },

  deleteStory: async (storyId) => {
    try {
      await axiosInstance.delete(`/stories/${storyId}`);
      set((state) => ({
        myStories: state.myStories.filter(story => story._id !== storyId),
      }));
      toast.success("Story deleted");
    } catch (error) {
      toast.error("Failed to delete story");
    }
  },

  setSelectedStoryUser: (user) => set({ selectedStoryUser: user, currentStoryIndex: 0 }),
  setCurrentStoryIndex: (index) => set({ currentStoryIndex: index }),
  clearSelectedStory: () => set({ selectedStoryUser: null, currentStoryIndex: 0 }),
}));