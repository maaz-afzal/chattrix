import React from "react";
import Avatar from "../common/Avatar";
import { formatLastSeen } from "../../utils/formatLastSeen.js";

const ChatItem = ({ chat, isSelected, onClick }) => {
  const { name, status, lastSeen, lastMessage } = chat;
  const isOnline = status === "online";

  const subtitle = isOnline
    ? "Online"
    : lastMessage
      ? lastMessage
      : lastSeen
        ? `Last seen ${formatLastSeen(lastSeen)}`
        : "Offline";

  return (
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
  );
};

export default ChatItem;
