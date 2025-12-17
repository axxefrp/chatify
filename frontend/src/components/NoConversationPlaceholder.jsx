import { MessageCircleIcon } from "lucide-react";

const NoConversationPlaceholder = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <div className="size-24 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center mb-8 shadow-lg">
        <MessageCircleIcon className="size-12 text-white" />
      </div>
      <h3 className="text-2xl font-bold text-white mb-3">Select a conversation</h3>
      <p className="text-slate-400 max-w-md text-lg leading-relaxed">
        Choose a contact from the sidebar to start chatting or continue a previous conversation.
      </p>
    </div>
  );
};

export default NoConversationPlaceholder;
