import { useEffect } from "react";
import { useStoryStore } from "../store/useStoryStore";
import { useAuthStore } from "../store/useAuthStore";
import { PlusIcon } from "lucide-react";

function StoriesList({ onAddStory }) {
  const { stories, getStories, getMyStories, myStories, setSelectedStoryUser } = useStoryStore();
  const { authUser } = useAuthStore();

  useEffect(() => {
    getStories();
    getMyStories();
  }, [getStories, getMyStories]);

  const handleStoryClick = (userStories) => {
    setSelectedStoryUser(userStories);
  };

  const handleAddStory = () => {
    // TODO: Open story creation modal
    console.log("Add new story");
  };

  return (
    <div className="flex space-x-4 p-4 border-b border-slate-700/50 overflow-x-auto">
      {/* Add Story Button */}
      <div className="flex flex-col items-center space-y-1 flex-shrink-0">
        <div
          onClick={onAddStory}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent p-0.5 cursor-pointer hover:scale-105 transition-transform"
        >
          <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center">
            <PlusIcon className="w-6 h-6 text-brand-primary" />
          </div>
        </div>
        <span className="text-xs text-slate-400 text-center">Your story</span>
      </div>

      {/* My Stories (if any) */}
      {myStories.length > 0 && (
        <div className="flex flex-col items-center space-y-1 flex-shrink-0">
          <div
            onClick={() => handleStoryClick({ user: authUser, stories: myStories })}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent p-0.5 cursor-pointer hover:scale-105 transition-transform"
          >
            <img
              src={authUser.profilePic || "/avatar.png"}
              alt={authUser.fullName}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <span className="text-xs text-slate-400 text-center">Your story</span>
        </div>
      )}

      {/* Other Users' Stories */}
      {stories.map((userStories) => (
        <div key={userStories.user._id} className="flex flex-col items-center space-y-1 flex-shrink-0">
          <div
            onClick={() => handleStoryClick(userStories)}
            className={`w-16 h-16 rounded-full p-0.5 cursor-pointer hover:scale-105 transition-transform ${
              userStories.hasUnviewed
                ? "bg-gradient-to-br from-brand-accent to-brand-primary"
                : "bg-slate-600"
            }`}
          >
            <img
              src={userStories.user.profilePic || "/avatar.png"}
              alt={userStories.user.fullName}
              className="w-full h-full rounded-full object-cover border-2 border-slate-800"
            />
          </div>
          <span className="text-xs text-slate-400 text-center truncate w-16">
            {userStories.user.fullName.split(" ")[0]}
          </span>
        </div>
      ))}
    </div>
  );
}

export default StoriesList;