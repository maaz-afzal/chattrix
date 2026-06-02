import React from "react";
import { MoreHorizontal, ChevronLeft } from "lucide-react";
import Avatar from "../common/Avatar";
import IconButton from "../common/IconButton";

const ChatHeader = ({ selected }) => {
  if (!selected) {
    return (
      <div className="px-6 py-4 border-b border-gray-700/50">
        <p className="text-gray-400 text-center">Select a chat</p>
      </div>
    );
  }

  const { name, avatar, status } = selected;
  const isOnline = status === "online";
  const avatarLetter = avatar || name?.charAt(0).toUpperCase() || "U";

  return (
    <div className="px-6 py-4 border-b border-gray-700/50 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <button className="lg:hidden p-1.5 hover:bg-gray-700/60 rounded-xl transition">
          <ChevronLeft className="w-5 h-5 text-gray-400" />
        </button>
        <Avatar name={avatarLetter} size="md" online={isOnline} />
        <div className="min-w-0">
          <p className="text-gray-200 font-semibold truncate">{name}</p>
          <p className="text-gray-500 text-xs flex items-center gap-1">
            <span
              className={`w-1.5 h-1.5 rounded-full ${isOnline ? "bg-green-500" : "bg-gray-500"}`}
            />
            {isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <IconButton icon={MoreHorizontal} ariaLabel="More" />
      </div>
    </div>
  );
};

export default ChatHeader;
