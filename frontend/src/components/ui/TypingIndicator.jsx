import React from "react";

const TypingIndicator = () => {
  return (
    <div className="flex justify-start" aria-label="typing">
      <div className="bg-white/2 rounded-3xl rounded-bl-lg px-4 py-3 border border-cyan-500/20 shadow-[0_0_10px_rgba(34,211,238,0.06)]">
        <div className="flex gap-1">
          <span
            className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce shadow-[0_0_6px_rgba(34,211,238,0.5)]"
            style={{ animationDelay: "0ms" }}
          />
          <span
            className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce shadow-[0_0_6px_rgba(34,211,238,0.5)]"
            style={{ animationDelay: "150ms" }}
          />
          <span
            className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce shadow-[0_0_6px_rgba(34,211,238,0.5)]"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
