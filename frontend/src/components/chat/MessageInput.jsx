import React, { useState, useEffect, useRef } from "react";
import { Send, Paperclip, X, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";
import { getSocket } from "../../lib/socket.js";
import messageService from "../../services/messageService.js";
import aiService from "../../services/aiService.js";
import { useSelect } from "../layout/ChatArea.jsx";
import toast from "react-hot-toast";

const MessageInput = ({
  selected,
  isAISelected,
  setAiMessages,
  aiConversationId,
}) => {
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
  const prevReceiverRef = useRef(null);

  useEffect(() => {
    const socket = getSocket();
    if (
      socket &&
      prevReceiverRef.current &&
      prevReceiverRef.current !== selected?._id
    ) {
      socket.emit("stop-typing", { receiverId: prevReceiverRef.current });
    }
    prevReceiverRef.current = selected?._id;
    clearTimeout(typingTimeout.current);
  }, [selected?._id]);

  useEffect(() => {
    return () => {
      clearTimeout(typingTimeout.current);
      const socket = getSocket();
      if (socket && prevReceiverRef.current) {
        socket.emit("stop-typing", { receiverId: prevReceiverRef.current });
      }
    };
  }, [selected?._id]);

  const handleAISend = async () => {
    if (!message.trim()) return;
    if (!aiConversationId) {
      toast.error("AI chat is still loading, please wait.");
      return;
    }
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
      const response = await aiService.sendAIMessage({
        text: userMsg.text,
        conversationId: aiConversationId,
      });
      setAiMessages((prev) => [
        ...prev,
        {
          _id: response.reply?._id || (Date.now() + 1).toString(),
          text: response.reply?.text || response.text || response,
          sender: "ai",
          createdAt: response.reply?.createdAt || new Date().toISOString(),
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
    const socket = getSocket();
    if (socket) {
      clearTimeout(typingTimeout.current);
      socket.emit("stop-typing", { receiverId: selected._id });
    }
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

  if (selectMode) {
    return (
      <div className="shrink-0 border-t border-[#e2e2e4] dark:border-[#2E2E2F] bg-[#f7f7f8] dark:bg-[#161616] px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={disableSelectMode}
              className="p-1.5 rounded-lg hover:bg-[#ececee] dark:hover:bg-[#1D1E1F] transition-colors"
            >
              <X className="w-4 h-4 text-[#1a1a1b] dark:text-white" />
            </button>
            <span className="text-[13px] text-[#1a1a1b] dark:text-white">
              {selectedMessages.length} selected
            </span>
          </div>
          <button
            onClick={handleDeleteSelected}
            disabled={selectedMessages.length === 0}
            className="p-2 rounded-lg text-[#f87171] hover:bg-[#ececee] dark:hover:bg-[#1D1E1F] disabled:opacity-30 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="shrink-0 border-t border-[#e2e2e4] dark:border-[#2E2E2F] bg-[#f7f7f8] dark:bg-[#161616] px-4 py-4">
      {imagePreview && !isAISelected && (
        <div className="mb-2 inline-flex items-center gap-2 rounded-lg bg-[#ececee] dark:bg-[#1D1E1F] px-2.5 py-2">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-10 h-10 rounded-md object-cover"
          />
          <button
            onClick={removeImage}
            className="p-1 rounded text-[#8a8a8c] dark:text-[#666] hover:text-[#f87171]"
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
            className="p-2 rounded-lg text-[#8a8a8c] dark:text-[#666] hover:text-[#1a1a1b] dark:hover:text-white hover:bg-[#ececee] dark:hover:bg-[#1D1E1F] disabled:opacity-30 transition-colors"
          >
            <Paperclip className="w-4.5 h-4.5" />
          </button>
        )}

        <div className="flex-1 bg-[#e4e4e6] dark:bg-[#212120] rounded-lg px-3">
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
            className="w-full bg-transparent py-3 text-[13px] text-[#1a1a1b] dark:text-white placeholder:text-[#9a9a9c] dark:placeholder:text-[#666] outline-none disabled:opacity-30"
          />
        </div>

        <button
          onClick={handleSend}
          disabled={!canSend}
          className={`w-10 h-10 shrink-0 rounded-lg flex items-center justify-center transition-all ${
            canSend
              ? "bg-[#A37CFF] text-white hover:bg-[#9370f0]"
              : "bg-[#e4e4e6] dark:bg-[#212120] text-[#9a9a9c] dark:text-[#555]"
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
