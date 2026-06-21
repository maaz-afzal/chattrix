import React, { useState } from "react";
import { Send, Image as ImageIcon } from "lucide-react";
import { getSocket } from "../../lib/socket.js";
import * as messageService from "../../services/messageService.js";
import toast from "react-hot-toast";

const MessageInput = ({ selected, isAISelected, setAiMessages, aiMessages }) => {
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const sendTextMessage = (text) => {
    const socket = getSocket();
    if (!socket) return;

    socket.emit("send-message", {
      receiverId: selected._id,
      message: text,
      imageUrl: null,
    });
  };

  const handleAISend = async () => {
    if (!message.trim()) return;

    try {
      setLoading(true);

      // Add user message to AI chat
      const userMsg = {
        _id: Date.now().toString(),
        text: message.trim(),
        sender: "user",
        createdAt: new Date().toISOString(),
        status: "sent"
      };
      setAiMessages((prev) => [...prev, userMsg]);
      setMessage("");

      // Call Gemini API
      const response = await messageService.aiChat({ text: message.trim() });

      // Add AI response
      const aiMsg = {
        _id: (Date.now() + 1).toString(),
        text: response.reply,
        sender: "ai",
        createdAt: new Date().toISOString(),
        status: "sent"
      };
      setAiMessages((prev) => [...prev, aiMsg]);

    } catch (error) {
      console.error("AI error:", error);
      toast.error("Failed to get AI response");
    } finally {
      setLoading(false);
    }
  };

  const handleNormalSend = async () => {
    if (!selected?._id) return;
    if (!message.trim() && !image) return;

    try {
      setLoading(true);

      if (message.trim() && !image) {
        sendTextMessage(message.trim());
        setMessage("");
      } else if (image) {
        const response = await messageService.sendMessage(selected._id, {
          text: message.trim() || "",
          image: image,
        });
        setMessage("");
        setImage(null);
        setImagePreview(null);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (isAISelected) {
      await handleAISend();
    } else {
      await handleNormalSend();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageSelect = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const isDisabled = loading || (!selected && !isAISelected);
  const placeholder = isAISelected 
    ? "Ask Gemini..." 
    : selected 
      ? "Write a message..." 
      : "Select a chat to start messaging";

  return (
    <div className="p-4">
      {imagePreview && !isAISelected && (
        <div className="mb-2 p-2 bg-neutral-800 rounded-xl flex items-center justify-between">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-12 h-12 rounded-lg object-cover"
          />
          <button
            onClick={() => {
              setImage(null);
              setImagePreview(null);
            }}
            className="text-xs text-red-400 hover:text-red-300"
          >
            Remove
          </button>
        </div>
      )}

      <div className="flex items-center gap-2 bg-neutral-800/70 rounded-3xl p-2 shadow-lg border border-neutral-700">
        {/* Image button - disabled in AI mode */}
        <button
          onClick={handleImageSelect}
          disabled={isDisabled || isAISelected}
          aria-label="Image"
          className="p-2 hover:bg-neutral-700 rounded-2xl transition focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ImageIcon className="w-5 h-5 text-neutral-400" />
        </button>

        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isDisabled}
          placeholder={placeholder}
          className="flex-1 bg-transparent px-2 py-2 text-neutral-200 placeholder-neutral-500 focus:outline-none text-sm min-w-0 disabled:opacity-50 disabled:cursor-not-allowed"
        />

        <button
          onClick={handleSend}
          disabled={(!message.trim() && !image) || loading || (!selected && !isAISelected)}
          aria-label="Send"
          className={`p-2.5 rounded-2xl transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
            isAISelected 
              ? "bg-linear-to-br from-blue-600 to-purple-600 hover:shadow-lg hover:shadow-blue-500/30" 
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {loading ? "..." : <Send className="w-5 h-5 text-white" />}
        </button>
      </div>
    </div>
  );
};

export default MessageInput;