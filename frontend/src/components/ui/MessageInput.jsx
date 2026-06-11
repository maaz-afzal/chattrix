import React, { useState } from "react";
import { Send, Image as ImageIcon } from "lucide-react";
import { getSocket } from "../../lib/socket.js";
import * as messageService from "../../services/messageService.js";

const MessageInput = ({ selected }) => {
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

  const handleSend = async () => {
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

  return (
    <div className="p-4">
      {imagePreview && (
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
        <button
          onClick={handleImageSelect}
          disabled={loading || !selected}
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
          disabled={loading || !selected}
          placeholder={
            selected ? "Write a message..." : "Select a chat to start messaging"
          }
          className="flex-1 bg-transparent px-2 py-2 text-neutral-200 placeholder-neutral-500 focus:outline-none text-sm min-w-0 disabled:opacity-50 disabled:cursor-not-allowed"
        />

        <button
          onClick={handleSend}
          disabled={(!message.trim() && !image) || loading || !selected}
          aria-label="Send"
          className="p-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-2xl transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "..." : <Send className="w-5 h-5 text-white" />}
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
