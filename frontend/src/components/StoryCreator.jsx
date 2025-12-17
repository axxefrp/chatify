import { useState, useRef } from "react";
import { useStoryStore } from "../store/useStoryStore";
import { XIcon, ImageIcon, VideoIcon, UploadIcon } from "lucide-react";
import toast from "react-hot-toast";

function StoryCreator({ isOpen, onClose }) {
  const { createStory, isLoading } = useStoryStore();
  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      toast.error("Please select an image or video file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setMediaPreview(reader.result);
      setMediaType(file.type.startsWith("image/") ? "image" : "video");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!mediaPreview || !mediaType) return;

    await createStory({ media: mediaPreview, mediaType });
    handleClose();
  };

  const handleClose = () => {
    setMediaPreview(null);
    setMediaType(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Create Story</h2>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        {!mediaPreview ? (
          <div className="space-y-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center cursor-pointer hover:border-brand-primary transition-colors"
            >
              <UploadIcon className="w-12 h-12 mx-auto text-slate-400 mb-4" />
              <p className="text-slate-300 mb-2">Click to upload media</p>
              <p className="text-sm text-slate-500">Images or videos up to 10MB</p>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white rounded-lg py-3 flex items-center justify-center space-x-2 transition-colors"
              >
                <ImageIcon className="w-5 h-5" />
                <span>Photo</span>
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white rounded-lg py-3 flex items-center justify-center space-x-2 transition-colors"
              >
                <VideoIcon className="w-5 h-5" />
                <span>Video</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative rounded-xl overflow-hidden">
              {mediaType === "image" ? (
                <img
                  src={mediaPreview}
                  alt="Story preview"
                  className="w-full h-64 object-cover"
                />
              ) : (
                <video
                  src={mediaPreview}
                  className="w-full h-64 object-cover"
                  controls
                />
              )}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setMediaPreview(null);
                  setMediaType(null);
                }}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white rounded-lg py-3 transition-colors"
              >
                Change
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-brand-primary to-brand-accent text-white rounded-lg py-3 font-medium hover:from-brand-primary/90 hover:to-brand-accent/90 transition-all disabled:opacity-50"
              >
                {isLoading ? "Posting..." : "Share Story"}
              </button>
            </div>
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/*,video/*"
          className="hidden"
        />
      </div>
    </div>
  );
}

export default StoryCreator;