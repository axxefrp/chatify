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
      <div className="flex-1 px-6 overflow-y-auto py-8">
        {messages.length > 0 && !isMessagesLoading ? (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`chat group ${msg.senderId === authUser._id ? "chat-end" : "chat-start"}`}
              >
                <div
                  className={`chat-bubble relative ${
                    msg.senderId === authUser._id
                      ? "bg-gradient-to-r from-brand-primary to-brand-secondary text-white"
                      : "bg-slate-800 text-slate-200"
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
                  {msg.text && <p className="mt-2">{msg.text}</p>}
                  <p className="text-xs mt-1 opacity-75 flex items-center gap-1">
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
                        className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs transition-all ${
                          reaction.users.includes(authUser._id)
                            ? "bg-brand-primary/20 text-brand-primary border border-brand-primary/30"
                            : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50"
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
                  className="absolute -bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-700 hover:bg-slate-600 rounded-full p-1"
                >
                  <PlusIcon className="w-3 h-3 text-slate-300" />
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

      {/* Reaction Picker */}
      {showReactionPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-slate-800 rounded-lg p-4 max-w-xs w-full mx-4">
            <div className="grid grid-cols-6 gap-2">
              {["❤️", "👍", "😂", "😮", "😢", "😡", "🔥", "👏", "🙌", "💯", "🎉", "💔"].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleReaction(showReactionPicker, emoji)}
                  className="text-2xl hover:bg-slate-700 rounded p-2 transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowReactionPicker(null)}
              className="w-full mt-3 bg-slate-700 hover:bg-slate-600 text-white rounded py-2 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <MessageInput />
    </>
  );
}

export default ChatContainer;
