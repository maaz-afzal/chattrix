import React, { useState } from "react";
import { Send, Image as ImageIcon } from "lucide-react";
import * as messageService from "../../services/messageService.js";

const MessageInput = ({ selected }) => {
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!selected?._id) {
      console.log("select the chat first.");
      return;
    }

    if (!message.trim() && !image) {
      return;
    }

    try {
      setSending(true);

      const payload = {
        text: message.trim(),
        image: image || null,
      };

      const res = await messageService.sendMessage(selected._id, payload);
      console.log("sent:", res);

      setMessage("");
      setImage(null);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !sending) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageSelect = () => {
    console.log("select img");
  };

  return (
    <div className="p-4">
      <div className="flex items-center gap-2 bg-gray-700/70 backdrop-blur rounded-3xl p-2 shadow-lg border border-gray-600/60">
        <button
          onClick={handleImageSelect}
          disabled={sending || !selected}
          aria-label="Image"
          className="p-2 hover:bg-gray-600 rounded-2xl transition focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ImageIcon className="w-5 h-5 text-gray-400" />
        </button>

        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={sending || !selected}
          placeholder={
            selected ? "Write a message..." : "Select a chat to start messaging"
          }
          className="flex-1 bg-transparent px-2 py-2 text-gray-200 placeholder-gray-500 focus:outline-none text-sm min-w-0 disabled:opacity-50 disabled:cursor-not-allowed"
        />

        <button
          onClick={handleSend}
          disabled={(!message.trim() && !image) || sending || !selected}
          aria-label="Send"
          className="p-2.5 bg-linear-to-br from-indigo-500 to-purple-500 hover:shadow-lg hover:shadow-indigo-500/30 rounded-2xl transition focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5 text-white" />
        </button>
      </div>

      {image && (
        <div className="mt-2 p-2 bg-gray-700/50 rounded-xl flex items-center gap-2">
          <span className="text-xs text-gray-400">Image selected</span>
          <button
            onClick={() => setImage(null)}
            className="text-xs text-red-400 hover:text-red-300"
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
};

export default MessageInput;
