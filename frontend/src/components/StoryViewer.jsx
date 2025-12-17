import { useEffect, useState, useRef } from "react";
import { useStoryStore } from "../store/useStoryStore";
import { XIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

function StoryViewer() {
  const {
    selectedStoryUser,
    currentStoryIndex,
    setCurrentStoryIndex,
    clearSelectedStory,
    viewStory,
  } = useStoryStore();

  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const progressRef = useRef(null);
  const storyDuration = 5000; // 5 seconds per story

  useEffect(() => {
    if (!selectedStoryUser) return;

    const story = selectedStoryUser.stories[currentStoryIndex];
    if (story) {
      viewStory(story._id);
    }

    // Start progress animation
    setProgress(0);
    const startTime = Date.now();

    const updateProgress = () => {
      if (isPaused) return;

      const elapsed = Date.now() - startTime;
      const newProgress = (elapsed / storyDuration) * 100;

      if (newProgress >= 100) {
        nextStory();
      } else {
        setProgress(newProgress);
        progressRef.current = requestAnimationFrame(updateProgress);
      }
    };

    progressRef.current = requestAnimationFrame(updateProgress);

    return () => {
      if (progressRef.current) {
        cancelAnimationFrame(progressRef.current);
      }
    };
  }, [selectedStoryUser, currentStoryIndex, isPaused, viewStory]);

  const nextStory = () => {
    if (currentStoryIndex < selectedStoryUser.stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    } else {
      clearSelectedStory();
    }
  };

  const prevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
    }
  };

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const isLeft = clickX < rect.width / 2;

    if (isLeft) {
      prevStory();
    } else {
      nextStory();
    }
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  if (!selectedStoryUser) return null;

  const currentStory = selectedStoryUser.stories[currentStoryIndex];

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Close Button */}
      <button
        onClick={clearSelectedStory}
        className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors"
      >
        <XIcon className="w-8 h-8" />
      </button>

      {/* Progress Bars */}
      <div className="absolute top-4 left-4 right-4 z-10 flex space-x-1">
        {selectedStoryUser.stories.map((_, index) => (
          <div
            key={index}
            className="flex-1 h-1 bg-gray-600 rounded-full overflow-hidden"
          >
            <div
              className="h-full bg-white transition-all duration-100 ease-linear"
              style={{
                width: index < currentStoryIndex ? "100%" : index === currentStoryIndex ? `${progress}%` : "0%",
              }}
            />
          </div>
        ))}
      </div>

      {/* Navigation Areas */}
      <div className="absolute left-0 top-0 bottom-0 w-1/2 z-10" onClick={prevStory} />
      <div className="absolute right-0 top-0 bottom-0 w-1/2 z-10" onClick={nextStory} />

      {/* Story Content */}
      <div className="w-full h-full flex items-center justify-center" onClick={handleClick}>
        {currentStory.mediaType === "image" ? (
          <img
            src={currentStory.media}
            alt="Story"
            className="max-w-full max-h-full object-contain"
            onClick={togglePause}
          />
        ) : (
          <video
            src={currentStory.media}
            className="max-w-full max-h-full object-contain"
            autoPlay
            muted
            onClick={togglePause}
          />
        )}
      </div>

      {/* User Info */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center space-x-3">
        <img
          src={selectedStoryUser.user.profilePic || "/avatar.png"}
          alt={selectedStoryUser.user.fullName}
          className="w-10 h-10 rounded-full border-2 border-white"
        />
        <div className="text-white">
          <p className="font-semibold">{selectedStoryUser.user.fullName}</p>
          <p className="text-sm opacity-75">
            {new Date(currentStory.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Pause Indicator */}
      {isPaused && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
          <div className="text-white text-6xl">⏸️</div>
        </div>
      )}
    </div>
  );
}

export default StoryViewer;