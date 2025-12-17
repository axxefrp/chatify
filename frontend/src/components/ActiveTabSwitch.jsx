import { useChatStore } from "../store/useChatStore";

function ActiveTabSwitch() {
  const { activeTab, setActiveTab } = useChatStore();

  return (
    <div className="px-4 py-3 border-b border-white/10">
      <div className="flex bg-white/5 rounded-xl p-1 backdrop-blur-sm">
        <button
          onClick={() => setActiveTab("chats")}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === "chats"
              ? "bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-white shadow-lg"
              : "text-slate-400 hover:text-slate-300"
          }`}
        >
          Chats
        </button>

        <button
          onClick={() => setActiveTab("contacts")}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === "contacts"
              ? "bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-white shadow-lg"
              : "text-slate-400 hover:text-slate-300"
          }`}
        >
          Contacts
        </button>
      </div>
    </div>
  );
}
export default ActiveTabSwitch;
