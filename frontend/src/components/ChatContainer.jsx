import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";
import { PlayIcon, PauseIcon, PlusIcon } from "lucide-react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

function ChatContainer() {
  const {
    selectedUser,
    getMessagesByUserId,
    messages,
    isMessagesLoading,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const [playingAudio, setPlayingAudio] = useState(null);
  const [showReactionPicker, setShowReactionPicker] = useState(null);
  const [messagesWithReactions, setMessagesWithReactions] = useState(messages);

  // Update local messages when messages change
  useEffect(() => {
    setMessagesWithReactions(messages);
  }, [messages]);

  const handleReaction = async (messageId, emoji) => {
    try {
      await axiosInstance.post(`/messages/${messageId}/reactions`, { emoji });
      setShowReactionPicker(null);
    } catch (error) {
      toast.error("Failed to add reaction");
    }
  };

  const handleRemoveReaction = async (messageId, emoji) => {
    try {
      await axiosInstance.delete(`/messages/${messageId}/reactions/${encodeURIComponent(emoji)}`);
    } catch (error) {
      toast.error("Failed to remove reaction");
    }
  };

  // Listen for real-time reaction updates
  useEffect(() => {
    const handleReactionUpdate = (data) => {
      setMessagesWithReactions(prevMessages =>
        prevMessages.map(msg =>
          msg._id === data.messageId
            ? { ...msg, reactions: data.reactions }
            : msg
        )
      );
    };

    if (window.socket) {
      window.socket.on("reactionUpdate", handleReactionUpdate);
    }

    return () => {
      if (window.socket) {
        window.socket.off("reactionUpdate", handleReactionUpdate);
      }
    };
  }, []);

  const toggleAudioPlayback = (messageId, audioUrl) => {
    if (playingAudio === messageId) {
      setPlayingAudio(null);
    } else {
      setPlayingAudio(messageId);
    }
  };

  useEffect(() => {
    getMessagesByUserId(selectedUser._id);
    subscribeToMessages();

    // clean up
    return () => unsubscribeFromMessages();
  }, [selectedUser, getMessagesByUserId, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <>
      <ChatHeader />
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
        {messages.length > 0 && !isMessagesLoading ? (
            <div className="max-w-4xl mx-auto space-y-4">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`chat group ${msg.senderId === authUser._id ? "chat-end" : "chat-start"}`}
              >
                <div
                  className={`chat-bubble relative shadow-lg ${
                    msg.senderId === authUser._id
                      ? "bg-gradient-to-r from-purple-500 to-cyan-500 text-white"
                      : "bg-white/10 backdrop-blur-sm text-slate-200 border border-white/20"
                  }`}
                >
                  {msg.image && (
                    <img src={msg.image} alt="Shared" className="rounded-lg h-48 object-cover mb-2" />
                  )}
                  {msg.audio && (
                    <div className="flex items-center space-x-3 mb-2 p-3 bg-black/20 rounded-lg">
                      <button
                        onClick={() => toggleAudioPlayback(msg._id, msg.audio)}
                        className="text-white hover:text-brand-accent transition-colors"
                      >
                        {playingAudio === msg._id ? (
                          <PauseIcon className="w-5 h-5" />
                        ) : (
                          <PlayIcon className="w-5 h-5" />
                        )}
                      </button>
                      <div className="flex-1">
                        <div className="bg-white/20 rounded-full h-2">
                          <div className="bg-white h-2 rounded-full w-1/4"></div>
                        </div>
                      </div>
                      <span className="text-xs opacity-75">Voice</span>
                      {playingAudio === msg._id && (
                        <audio
                          src={msg.audio}
                          autoPlay
                          onEnded={() => setPlayingAudio(null)}
                          className="hidden"
                        />
                      )}
                    </div>
                  )}
                  {msg.text && <p className="text-sm leading-relaxed">{msg.text}</p>}
                  <p className={`text-xs mt-2 flex items-center gap-1 ${
                    msg.senderId === authUser._id ? 'text-cyan-200' : 'text-slate-400'
                  }`}>
                    {new Date(msg.createdAt).toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                {/* Reactions */}
                {messagesWithReactions.find(m => m._id === msg._id)?.reactions?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {messagesWithReactions.find(m => m._id === msg._id).reactions.map((reaction, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          const currentMsg = messagesWithReactions.find(m => m._id === msg._id);
                          const userReacted = reaction.users.includes(authUser._id);
                          if (userReacted) {
                            handleRemoveReaction(msg._id, reaction.emoji);
                          } else {
                            handleReaction(msg._id, reaction.emoji);
                          }
                        }}
                        className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                          reaction.users.includes(authUser._id)
                            ? "bg-purple-500/30 text-purple-200 border border-purple-400/50 shadow-lg"
                            : "bg-white/10 text-slate-300 hover:bg-white/20 backdrop-blur-sm"
                        }`}
                      >
                        <span>{reaction.emoji}</span>
                        <span>{reaction.count}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Add Reaction Button */}
                <button
                  onClick={() => setShowReactionPicker(showReactionPicker === msg._id ? null : msg._id)}
                  className="absolute -bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-1.5 shadow-lg border border-white/20"
                >
                  <PlusIcon className="w-3 h-3 text-white" />
                </button>
              </div>
            ))}
            {/* 👇 scroll target */}
            <div ref={messageEndRef} />
          </div>
        ) : isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : (
          <NoChatHistoryPlaceholder name={selectedUser.fullName} />
        )}
        </div>

        <MessageInput />
      </div>

      {/* Reaction Picker */}
      {showReactionPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 max-w-xs w-full mx-4 border border-white/20 shadow-2xl">
            <div className="grid grid-cols-6 gap-3">
              {["❤️", "👍", "😂", "😮", "😢", "😡", "🔥", "👏", "🙌", "💯", "🎉", "💔"].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleReaction(showReactionPicker, emoji)}
                  className="text-2xl hover:bg-white/20 rounded-xl p-3 transition-all duration-200 hover:scale-110"
                >
                  {emoji}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowReactionPicker(null)}
              className="w-full mt-4 bg-white/10 hover:bg-white/20 text-white rounded-xl py-3 font-medium transition-all duration-200 border border-white/20"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatContainer;
