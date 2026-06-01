import React from "react";

const MessageBubble = ({ text, sender, time, seen }) => {
  const isMe = sender === "me";

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div className="max-w-[75%]">
        <div
          className={`rounded-3xl px-4 py-2.5 ${
            isMe
              ? "bg-linear-to-br from-indigo-500 to-purple-500 rounded-br-lg shadow-md shadow-indigo-500/30"
              : "bg-gray-700/80 rounded-bl-lg shadow-sm"
          }`}
        >
          <p className={isMe ? "text-white text-sm" : "text-gray-200 text-sm"}>
            {text}
          </p>
        </div>
        <p
          className={`text-xs text-gray-500 mt-1 ${isMe ? "mr-2 text-right" : "ml-2"}`}
        >
          {time} {isMe && seen && <span className="text-indigo-400">✓✓</span>}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;
