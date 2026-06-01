import React from "react";
import { Users } from "lucide-react";
import Badge from "../common/Badge";

const ChatItem = ({ chat, isSelected, onClick }) => {
  const {
    name,
    avatar,
    bio,
    lastMessage,
    time,
    unread,
    status,
    isGroup,
    gradient,
    active,
  } = chat;

  return (
    <button
      onClick={onClick}
      className={`w-full p-3 flex items-center gap-3 rounded-2xl transition text-left ${
        isSelected
          ? `bg-linear-to-r ${gradient} shadow-lg shadow-indigo-500/30`
          : "hover:bg-gray-700/60"
      }`}
    >
      {/* avatar */}
      <div className="relative shrink-0">
        <div
          className={`w-12 h-12 bg-linear-to-br ${gradient} rounded-2xl flex items-center justify-center shadow`}
        >
          {isGroup ? (
            <Users className="w-5 h-5 text-white" />
          ) : (
            <span className="text-white font-semibold text-sm">{avatar}</span>
          )}
        </div>
        {status && (
          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-gray-800" />
        )}
      </div>

      {/* chat info */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center gap-2">
          <p
            className={`text-sm truncate ${isSelected ? "text-white font-semibold" : "text-gray-200 font-semibold"}`}
          >
            {name}
          </p>
          <p
            className={`text-xs shrink-0 ${isSelected ? "text-white/70" : "text-gray-500"}`}
          >
            {time}
          </p>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p
            className={`text-xs truncate ${isSelected ? "text-white/80" : "text-gray-400"}`}
          >
            {lastMessage}
          </p>
          {unread > 0 && <Badge count={unread} />}
        </div>
      </div>
    </button>
  );
};

export default ChatItem;
