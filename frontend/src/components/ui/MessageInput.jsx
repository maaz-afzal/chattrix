import React, { useState } from "react";
import { Send, Image as ImageIcon } from "lucide-react";

const MessageInput = () => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center gap-2 bg-gray-700/70 backdrop-blur rounded-3xl p-2 shadow-lg border border-gray-600/60">
        <button
          aria-label="Image"
          className="p-2 hover:bg-gray-600 rounded-2xl transition focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <ImageIcon className="w-5 h-5 text-gray-400" />
        </button>

        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Write a message..."
          className="flex-1 bg-transparent px-2 py-2 text-gray-200 placeholder-gray-500 focus:outline-none text-sm min-w-0"
        />

        <button
          onClick={handleSend}
          aria-label="Send"
          className="p-2.5 bg-linear-to-br from-indigo-500 to-purple-500 hover:shadow-lg hover:shadow-indigo-500/30 rounded-2xl transition focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
        >
          <Send className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
