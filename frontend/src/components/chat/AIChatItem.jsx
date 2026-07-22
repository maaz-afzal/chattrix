import React from "react";
import { Bot } from "lucide-react";

const AIChatItem = ({ isSelected, onClick }) => {
  return (
    <button
      onClick={() => onClick && onClick()}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
        isSelected ? "bg-[#1D1E1F]" : "hover:bg-[#1D1E1F]/60"
      }`}
    >
      <div className="relative shrink-0">
        <div className="w-10 h-10 rounded-full bg-[#A37CFF]/12 flex items-center justify-center">
          <Bot className="w-5 h-5 text-[#A37CFF]" />
        </div>
        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#161616] bg-emerald-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="truncate text-[13px] font-medium text-white">
          AI Assistant
        </p>
        <p className="truncate text-[11px] text-[#666] mt-0.5">Gemini</p>
      </div>
    </button>
  );
};

export default AIChatItem;
