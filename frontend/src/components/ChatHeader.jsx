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
        className="flex justify-between items-center bg-white/5 backdrop-blur-sm border-b border-white/10 px-6 py-4 flex-1"
      >
        <div className="flex items-center space-x-4">
          <div className={`avatar ${isOnline ? "online" : "offline"}`}>
            <div className="w-10 rounded-full ring-2 ring-white/20">
              <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} />
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg">{selectedUser.fullName}</h3>
            <p className={`text-sm font-medium flex items-center gap-1 ${
              isOnline ? 'text-emerald-400' : 'text-slate-400'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'
              }`}></div>
              {isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleVideoCall}
            disabled={!isOnline}
            className={`p-3 rounded-xl transition-all duration-200 ${
              isOnline
                ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 hover:from-purple-500/30 hover:to-cyan-500/30 text-white shadow-lg hover:shadow-purple-500/20'
                : 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
            }`}
            title={isOnline ? "Start video call" : "User is offline"}
          >
            <VideoIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => setSelectedUser(null)}
            className="p-3 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {showVideoCall && <VideoCall onClose={() => setShowVideoCall(false)} />}
    </>
  );
}
export default ChatHeader;
