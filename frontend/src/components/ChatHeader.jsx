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
      <div className="flex justify-between items-center backdrop-blur-lg bg-white/[0.08] border-b border-white/[0.12] px-6 py-4 flex-1 sticky top-0 z-40">
        <div className="flex items-center space-x-4">
          <div className={`avatar ${isOnline ? "online" : "offline"}`}>
            <div className="w-11 h-11 rounded-full ring-2 ring-brand-primary/50 overflow-hidden">
              <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="flex-1">
            <h3 className="text-white font-semibold text-base">{selectedUser.fullName}</h3>
            <p className={`text-xs font-medium flex items-center gap-1.5 ${
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
            className={`p-2.5 rounded-xl transition-all duration-300 ${
              isOnline
                ? 'bg-gradient-to-r from-brand-primary/20 to-brand-accent/20 hover:from-brand-primary/30 hover:to-brand-accent/30 text-brand-primary hover:text-brand-accent shadow-lg hover:shadow-brand-primary/20'
                : 'bg-slate-700/30 text-slate-500 cursor-not-allowed'
            }`}
            title={isOnline ? "Start video call" : "User is offline"}
          >
            <VideoIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => setSelectedUser(null)}
            className="p-2.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300"
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
