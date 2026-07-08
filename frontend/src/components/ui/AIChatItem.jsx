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
        isSelected
          ? "bg-cyan-500/10 border border-cyan-400/30 shadow-[0_0_10px_rgba(34,211,238,0.1)]"
          : "hover:bg-cyan-500/5 border border-transparent"
      }`}
    >
      <div className="relative shrink-0">
        <div className="w-10 h-10 bg-cyan-500/10 rounded-full border border-cyan-400/40 flex items-center justify-center shadow-[0_0_12px_rgba(34,211,238,0.15)]">
          <Bot className="w-5 h-5 text-cyan-400" />
        </div>
        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full shadow-[0_0_6px_rgba(74,222,128,0.5)]" />
      </div>

      <div className="flex-1 min-w-0">
        <p
          className={`text-base ${isSelected ? "text-cyan-400" : "text-gray-300"}`}
        >
          AI Assistant
        </p>
        <p className="text-xs text-gray-500 truncate">Powered by Gemini</p>
      </div>
    </button>
  );
};

export default AIChatItem;
