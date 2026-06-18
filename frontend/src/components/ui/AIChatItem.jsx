import React from "react";
import { Bot } from "lucide-react";

const AIChatItem = ({ isSelected, onClick }) => {
  const handleClick = () => {
    if (onClick) onClick();
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full px-4 py-3 flex items-center gap-4 text-left rounded-xl ${
        isSelected ? "bg-neutral-800" : "hover:bg-neutral-800/50"
      }`}
    >
      <div className="relative shrink-0">
        <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full" />
      </div>

      <div className="flex-1 min-w-0">
        <p
          className={`text-base ${isSelected ? "text-white" : "text-neutral-300"}`}
        >
          AI Assistant
        </p>
        <p className="text-xs text-neutral-500 truncate">Powered by Gemini</p>
      </div>
    </button>
  );
};

export default AIChatItem;
