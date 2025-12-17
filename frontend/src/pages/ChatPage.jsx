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
      <div className="relative w-full max-w-6xl h-[800px]">
        <BorderAnimatedContainer>
          {/* STORIES SECTION */}
          <StoriesList onAddStory={() => setShowStoryCreator(true)} />

          {/* LEFT SIDE */}
          <div className="w-80 bg-gradient-to-b from-slate-800/60 to-slate-900/60 backdrop-blur-sm flex flex-col border-r border-brand-primary/20">
            <ProfileHeader />
            <ActiveTabSwitch />

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {activeTab === "chats" ? <ChatsList /> : <ContactList />}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex-1 flex flex-col bg-gradient-to-b from-slate-900/60 to-brand-darker/60 backdrop-blur-sm">
            {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
          </div>
        </BorderAnimatedContainer>
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
