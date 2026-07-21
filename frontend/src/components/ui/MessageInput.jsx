import React, { useState, useEffect, useRef } from "react";
import { Send, Paperclip, X, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";
import { getSocket } from "../../lib/socket.js";
import * as messageService from "../../services/messageService.js";
import { useSelect } from "../layout/ChatArea.jsx";
import toast from "react-hot-toast";

const MessageInput = ({ selected, isAISelected, setAiMessages }) => {
  const selectedConversationId = useSelector(
    (state) => state.users.selectedConversationId,
  );
  const {
    setSendTrigger,
    selectMode,
    selectedMessages,
    disableSelectMode,
    handleDeleteSelected,
  } = useSelect();
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const typingTimeout = useRef(null);

  const handleAISend = async () => {
    if (!message.trim()) return;
    const userMsg = {
      _id: Date.now().toString(),
      text: message.trim(),
      sender: "user",
      createdAt: new Date().toISOString(),
      status: "sent",
    };
    setAiMessages((prev) => [...prev, userMsg]);
    setMessage("");
    try {
      setLoading(true);
      const response = await messageService.aiChat({ text: userMsg.text });
      setAiMessages((prev) => [
        ...prev,
        {
          _id: (Date.now() + 1).toString(),
          text: response.reply,
          sender: "ai",
          createdAt: new Date().toISOString(),
          status: "sent",
        },
      ]);
    } catch {
      toast.error("Failed to get AI response.");
    } finally {
      setLoading(false);
    }
  };

  const handleNormalSend = async () => {
    if (!selected?._id) return;
    if (!selectedConversationId) {
      toast.error("Conversation not ready.");
      return;
    }
    if (!message.trim() && !image) return;
    try {
      setLoading(true);
      await messageService.sendMessage(selectedConversationId, selected._id, {
        text: message.trim() || undefined,
        image: image || undefined,
      });
      setMessage("");
      setImage(null);
      setImagePreview(null);
      setSendTrigger((prev) => prev + 1);
    } catch {
      toast.error("Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    isAISelected ? await handleAISend() : await handleNormalSend();
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !loading) {
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
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be under 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };
  const isDisabled = loading || (!selected && !isAISelected);
  const canSend =
    (message.trim() || image) && !loading && (selected || isAISelected);
  const placeholder = isAISelected
    ? "Ask Gemini..."
    : selected
      ? "Message"
      : "Select a chat";

  useEffect(() => {
    return () => clearTimeout(typingTimeout.current);
  }, []);

  if (selectMode) {
    return (
      <div className="shrink-0 border-t border-[#2E2E2F] bg-[#161616] px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={disableSelectMode}
              className="p-1.5 rounded-lg hover:bg-[#1D1E1F] transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
            <span className="text-[13px] text-white">
              {selectedMessages.length} selected
            </span>
          </div>
          <button
            onClick={handleDeleteSelected}
            disabled={selectedMessages.length === 0}
            className="p-2 rounded-lg text-[#f87171] hover:bg-[#1D1E1F] disabled:opacity-30 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="shrink-0 border-t border-[#2E2E2F] bg-[#161616] px-4 py-2">
      {imagePreview && !isAISelected && (
        <div className="mb-2 inline-flex items-center gap-2 rounded-lg bg-[#1D1E1F] px-2.5 py-2">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-9 h-9 rounded-md object-cover"
          />
          <button
            onClick={removeImage}
            className="p-1 rounded text-[#666] hover:text-[#f87171]"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      <div className="flex items-center gap-2">
        {!isAISelected && (
          <button
            onClick={handleImageSelect}
            disabled={isDisabled}
            className="p-2 rounded-lg text-[#666] hover:text-white hover:bg-[#1D1E1F] disabled:opacity-30 transition-colors"
          >
            <Paperclip className="w-[18px] h-[18px]" />
          </button>
        )}

        <div className="flex-1 bg-[#212120] rounded-lg px-3">
          <input
            type="text"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              if (!isAISelected && selected?.conversationId) {
                const socket = getSocket();
                if (socket) {
                  socket.emit("typing", { receiverId: selected._id });
                  clearTimeout(typingTimeout.current);
                  typingTimeout.current = setTimeout(() => {
                    socket.emit("stop-typing", { receiverId: selected._id });
                  }, 2000);
                }
              }
            }}
            onKeyDown={handleKeyDown}
            disabled={isDisabled}
            placeholder={placeholder}
            className="w-full bg-transparent py-2 text-[13px] text-white placeholder:text-[#666] outline-none disabled:opacity-30"
          />
        </div>

        <button
          onClick={handleSend}
          disabled={!canSend}
          className={`w-9 h-9 shrink-0 rounded-lg flex items-center justify-center transition-all ${
            canSend
              ? "bg-[#A37CFF] text-white hover:bg-[#9370f0]"
              : "bg-[#212120] text-[#555]"
          }`}
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
