import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import NoChatsFound from "./NoChatsFound";
import { useAuthStore } from "../store/useAuthStore";

function ChatsList() {
  const { getMyChatPartners, chats, isUsersLoading, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getMyChatPartners();
  }, [getMyChatPartners]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;
  if (chats.length === 0) return <NoChatsFound />;

  return (
    <>
      {chats.map((chat) => (
        <div
          key={chat._id}
          className="glass hover:glass-sm p-4 rounded-2xl cursor-pointer transition-all duration-300 hover:border-brand-primary/50 group animate-slideIn"
          onClick={() => setSelectedUser(chat)}
        >
          <div className="flex items-center gap-4">
            <div className={`avatar ${onlineUsers.includes(chat._id) ? "online" : "offline"}`}>
              <div className="size-13 rounded-full ring-2 ring-brand-primary/30 group-hover:ring-brand-primary/60 transition-all duration-300 overflow-hidden">
                <img src={chat.profilePic || "/avatar.png"} alt={chat.fullName} className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-slate-100 font-semibold text-sm group-hover:text-brand-primary transition-colors truncate">{chat.fullName}</h4>
              <p className={`text-xs ${onlineUsers.includes(chat._id) ? 'text-emerald-400' : 'text-slate-500'}`}>
                {onlineUsers.includes(chat._id) ? '● Online' : '○ Offline'}
              </p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
export default ChatsList;
