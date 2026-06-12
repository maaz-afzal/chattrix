import React from "react";

const ChatItem = ({ chat, isSelected, onClick }) => {
  const { name, avatar, status } = chat;

  const avatarLetter = avatar || name?.charAt(0).toUpperCase() || "U";
  const isOnline = status === "online";

  return (
    <button
      onClick={onClick}
      className={`w-full px-4 py-3 flex items-center gap-4 text-left rounded-xl ${
        isSelected ? "bg-neutral-800" : "hover:bg-neutral-800/50"
      }`}
    >
      <div className="relative shrink-0">
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-medium">{avatarLetter}</span>
        </div>
        {isOnline && (
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-black" />
        )}
      </div>

      <p
        className={`text-base ${isSelected ? "text-white" : "text-neutral-300"}`}
      >
        {name}
      </p>
    </button>
  );
};

export default ChatItem;
