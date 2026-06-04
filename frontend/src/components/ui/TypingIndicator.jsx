import React from "react";

const TypingIndicator = () => {
  return (
    <div className="flex justify-start" aria-label="typing">
      <div className="bg-neutral-800 rounded-3xl rounded-bl-lg px-4 py-3 shadow-sm">
        <div className="flex gap-1">
          <span
            className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <span
            className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <span
            className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
