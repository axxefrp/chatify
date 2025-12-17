import { useChatStore } from "../store/useChatStore";

import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import ProfileHeader from "../components/ProfileHeader";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatsList from "../components/ChatsList";
import ContactList from "../components/ContactList";
import ChatContainer from "../components/ChatContainer";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";
import StoriesList from "../components/StoriesList";
import StoryViewer from "../components/StoryViewer";
import StoryCreator from "../components/StoryCreator";
import { useState } from "react";

function ChatPage() {
  const { activeTab, selectedUser } = useChatStore();
  const [showStoryCreator, setShowStoryCreator] = useState(false);

  return (
    <>
      <div className="h-screen w-full flex flex-col bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950">
        {/* STORIES SECTION - Modern floating design */}
        <div className="flex-shrink-0 p-4 pb-2">
          <StoriesList onAddStory={() => setShowStoryCreator(true)} />
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 flex overflow-hidden px-4 pb-4 gap-4 min-h-0">
          {/* LEFT SIDEBAR - Modern glassmorphism design */}
          <div className="w-80 flex-shrink-0">
            <div className="h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-purple-500/10 flex flex-col overflow-hidden">
              <ProfileHeader />
              <ActiveTabSwitch />

              <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
                {activeTab === "chats" ? <ChatsList /> : <ContactList />}
              </div>
            </div>
          </div>

          {/* RIGHT CHAT AREA - Modern design */}
          <div className="flex-1 min-w-0">
            <div className="h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-purple-500/10 flex flex-col overflow-hidden">
              {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
            </div>
          </div>
        </div>
      </div>

      {/* STORY MODALS */}
      <StoryViewer />
      <StoryCreator
        isOpen={showStoryCreator}
        onClose={() => setShowStoryCreator(false)}
      />
    </>
  );
}
export default ChatPage;
