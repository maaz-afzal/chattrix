import React, { useState } from "react";
import { ChevronRight, Trash2 } from "lucide-react";
import Avatar from "../common/Avatar";
import { formatLastSeen } from "../../utils/formatLastSeen.js";
import conversationService from "../../services/conversationService.js";
import toast from "react-hot-toast";

const ChatItem = ({ chat, isSelected, onClick, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { name, status, lastSeen, lastMessage, unreadCount } = chat;
  const isOnline = status === "online";
  const subtitle = lastMessage
    ? lastMessage
    : isOnline
      ? "Online"
      : lastSeen
        ? `Last seen ${formatLastSeen(lastSeen)}`
        : "Offline";

  const handleDelete = async (e) => {
    e.stopPropagation();
    setMenuOpen(false);
    if (chat.conversationId) {
      try {
        await conversationService.deleteConversation(chat.conversationId);
        toast.success("Deleted");
        if (onDelete) onDelete(chat.conversationId);
      } catch {
        toast.error("Failed to delete");
      }
    }
  };

  return (
    <div className="relative group">
      <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
          isSelected ? "bg-[#1D1E1F]" : "hover:bg-[#1D1E1F]/60"
        }`}
      >
        <Avatar
          name={name}
          profileImage={chat.profileImage}
          size="md"
          online={isOnline}
        />
        <div className="flex-1 min-w-0">
          <p
            className={`truncate text-[13px] ${unreadCount > 0 ? "text-white font-semibold" : "text-[#ddd] font-medium"}`}
          >
            {name}
          </p>
          <p
            className={`truncate text-[11px] mt-0.5 ${isOnline && !lastMessage ? "text-emerald-500" : "text-[#666]"}`}
          >
            {subtitle}
          </p>
        </div>
        {unreadCount > 0 && (
          <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-[#A37CFF] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          setMenuOpen(!menuOpen);
        }}
        className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-[#555] hover:text-white hover:bg-[#2E2E2F] opacity-0 group-hover:opacity-100 transition-all"
      >
        <ChevronRight className="w-3.5 h-3.5" />
      </button>

      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute right-1.5 top-full mt-1 z-50 w-40 rounded-xl border border-[#2E2E2F] bg-[#1D1E1F] overflow-hidden shadow-xl">
            <button
              onClick={handleDelete}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-left text-[12px] text-[#f87171] hover:bg-[#2E2E2F] transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatItem;
