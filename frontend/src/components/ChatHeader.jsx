import { XIcon, VideoIcon } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import VideoCall from "./VideoCall";

function ChatHeader() {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showVideoCall, setShowVideoCall] = useState(false);
  const isOnline = onlineUsers.includes(selectedUser._id);

  const handleVideoCall = () => {
    setShowVideoCall(true);
  };

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") setSelectedUser(null);
    };

    window.addEventListener("keydown", handleEscKey);

    // cleanup function
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [setSelectedUser]);

  return (
    <>
      <div
        className="flex justify-between items-center bg-slate-800/50 border-b
   border-slate-700/50 max-h-[84px] px-6 flex-1"
      >
        <div className="flex items-center space-x-3">
          <div className={`avatar ${isOnline ? "online" : "offline"}`}>
            <div className="w-12 rounded-full">
              <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} />
            </div>
          </div>

          <div>
            <h3 className="text-slate-200 font-medium">{selectedUser.fullName}</h3>
            <p className="text-slate-400 text-sm">{isOnline ? "Online" : "Offline"}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleVideoCall}
            disabled={!isOnline}
            className={`p-2 rounded-lg transition-colors ${
              isOnline
                ? 'bg-brand-primary hover:bg-brand-secondary text-white'
                : 'bg-slate-600 text-slate-500 cursor-not-allowed'
            }`}
            title={isOnline ? "Start video call" : "User is offline"}
          >
            <VideoIcon className="w-5 h-5" />
          </button>
          <button onClick={() => setSelectedUser(null)}>
            <XIcon className="w-5 h-5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer" />
          </button>
        </div>
      </div>

      {showVideoCall && <VideoCall onClose={() => setShowVideoCall(false)} />}
    </>
  );
}
export default ChatHeader;
