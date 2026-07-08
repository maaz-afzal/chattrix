import React from "react";

const ChatItem = ({ chat, isSelected, onClick }) => {
  const { name, avatar, status } = chat;

  const avatarLetter = avatar || name?.charAt(0).toUpperCase() || "U";
  const isOnline = status === "online";

  return (
    <button
      onClick={onClick}
      className={`w-full px-4 py-3 flex items-center gap-4 text-left rounded-xl ${
        isSelected
          ? "bg-cyan-500/10 border border-cyan-400/30 shadow-[0_0_10px_rgba(34,211,238,0.1)]"
          : "hover:bg-cyan-500/5 border border-transparent"
      }`}
    >
      <div className="relative shrink-0">
        <div className="w-10 h-10 bg-cyan-500/10 rounded-full border border-cyan-400/40 flex items-center justify-center shadow-[0_0_12px_rgba(34,211,238,0.15)]">
          <span className="text-cyan-400 text-sm font-medium">
            {avatarLetter}
          </span>
        </div>
        {isOnline && (
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full ring-2 ring-black shadow-[0_0_6px_rgba(74,222,128,0.5)]" />
        )}
      </div>

      <p
        className={`text-base ${isSelected ? "text-cyan-400" : "text-gray-300"}`}
      >
        {name}
      </p>
    </button>
  );
};

export default ChatItem;
