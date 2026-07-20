import React, { useState } from "react";
import { MoreVertical, Trash2 } from "lucide-react";
import Avatar from "../common/Avatar";
import { formatLastSeen } from "../../utils/formatLastSeen.js";
import conversationService from "../../services/conversationService.js";
import toast from "react-hot-toast";

const ChatItem = ({ chat, isSelected, onClick, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { name, status, lastSeen, lastMessage } = chat;
  const isOnline = status === "online";

  const subtitle = isOnline
    ? "Online"
    : lastMessage
      ? lastMessage
      : lastSeen
        ? `Last seen ${formatLastSeen(lastSeen)}`
        : "Offline";

  const handleDelete = async (e) => {
    e.stopPropagation();
    setMenuOpen(false);
    if (chat.conversationId) {
      try {
        await conversationService.deleteConversation(chat.conversationId);
        toast.success("Conversation deleted");
        if (onDelete) onDelete(chat.conversationId);
      } catch {
        toast.error("Failed to delete conversation");
      }
    }
  };

  return (
    <div className="relative group">
      <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 p-2.5 rounded-2xl text-left ${
          isSelected
            ? "bg-cyan-500/10 border border-cyan-400/30 shadow-[0_0_10px_rgba(34,211,238,0.1)]"
            : "hover:bg-cyan-500/5 border border-transparent"
        }`}
      >
        <Avatar name={name} profileImage={chat.profileImage} size="md" online={isOnline} />
        <div className="flex-1 min-w-0">
          <p className="text-gray-200 font-medium text-sm truncate">{name}</p>
          <p className="text-gray-500 text-xs truncate">{subtitle}</p>
        </div>
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
        className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-cyan-500/10 text-gray-500 hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {menuOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-50 w-44 bg-black/90 rounded-xl border border-cyan-500/20 shadow-lg overflow-hidden">
            <button
              onClick={handleDelete}
              className="w-full px-4 py-2.5 flex items-center gap-2 text-left text-sm text-red-400 hover:bg-red-500/10 transition"
            >
              <Trash2 className="w-4 h-4" />
              Delete conversation
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatItem;
