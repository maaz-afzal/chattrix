import React from "react";

const ChatItem = ({ chat, isSelected, onClick }) => {
  const { name, avatar, status } = chat;

  const avatarLetter = avatar || name?.charAt(0).toUpperCase() || "U";
  const isOnline = status === "online";

  return (
    <button
      onClick={onClick}
      className={`w-full p-3 flex items-center gap-3 rounded-2xl transition text-left ${
        isSelected
          ? "bg-indigo-600/80 shadow-lg shadow-indigo-500/30"
          : "hover:bg-gray-700/60"
      }`}
    >
      {/* avatar */}
      <div className="relative shrink-0">
        <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center shadow">
          <span className="text-white font-semibold text-sm">
            {avatarLetter}
          </span>
        </div>
        {isOnline && (
          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-gray-800" />
        )}
      </div>

      {/* chat info */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center gap-2">
          <p
            className={`text-sm truncate ${
              isSelected
                ? "text-white font-semibold"
                : "text-gray-200 font-semibold"
            }`}
          >
            {name}
          </p>
        </div>
      </div>
    </button>
  );
};

export default ChatItem;
