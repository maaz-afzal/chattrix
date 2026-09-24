import { useState, useEffect, useRef } from "react";
import { Send, ImageIcon, X, Trash2, X as XIcon } from "lucide-react";
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
  replyingTo,
  onCancelReply,
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
    editingMessage,
    cancelEditing,
  } = useSelect();
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
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

  useEffect(() => {
    if (editingMessage) {
      setMessage(editingMessage.text || "");
      setImage(null);
      setImagePreview(null);
    }
  }, [editingMessage]);

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
    } catch (error) {
      console.error("Error sending AI message:", error);

      setAiMessages((prev) => prev.filter((msg) => msg._id !== userMsg._id));

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
      if (editingMessage) {
        if (!message.trim()) {
          toast.error("Message cannot be empty.");
          return;
        }
        await messageService.updateMessage(editingMessage._id, {
          text: message.trim(),
        });
        cancelEditing();
        setSendTrigger((prev) => prev + 1);
      } else {
        await messageService.sendMessage(selectedConversationId, selected._id, {
          text: message.trim() || undefined,
          image: image || undefined,
          replyTo: replyingTo?._id,
        });
      }
      if (replyingTo) onCancelReply();
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
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file.");
        return;
      }
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
      ? replyingTo
        ? "Reply..."
        : editingMessage
          ? "Edit message"
          : "Message"
      : "Select a chat";

  if (selectMode) {
    return (
      <div className="w-full pt-2 pb-4">
        <div className="mx-auto max-w-3xl px-4">
          <div className="flex items-center justify-between rounded-[22px] bg-[#f2f2f2] dark:bg-[#2a2a2a] ring-1 ring-black/4 dark:ring-white/6 pl-1.5 pr-1.5 py-1.5">
            <div className="flex items-center gap-1.5 min-w-0">
              <button
                onClick={disableSelectMode}
                aria-label="Cancel selection"
                className="w-9 h-9 rounded-full flex items-center justify-center text-[#8a8a8a] dark:text-[#888] hover:text-[#111] dark:hover:text-[#f0f0f0] hover:bg-black/5 dark:hover:bg-white/6 active:scale-95 transition shrink-0"
              >
                <X className="w-4.5 h-4.5" strokeWidth={1.75} />
              </button>
              <div className="flex items-baseline gap-1.5 min-w-0 ml-0.5">
                <span className="text-[14px] font-semibold text-[#111] dark:text-[#f0f0f0] tabular-nums leading-none">
                  {selectedMessages.length}
                </span>
                <span className="text-[12.5px] text-[#8a8a8a] dark:text-[#9a9a9a] leading-none truncate">
                  {selectedMessages.length === 1
                    ? "message selected"
                    : "messages selected"}
                </span>
              </div>
            </div>

            <button
              onClick={handleDeleteSelected}
              disabled={selectedMessages.length === 0}
              aria-label="Delete selected"
              className="w-9 h-9 rounded-full flex items-center justify-center text-red-500 dark:text-red-400 hover:bg-red-500/10 dark:hover:bg-red-500/[0.14] disabled:opacity-30 disabled:hover:bg-transparent active:scale-95 transition shrink-0"
            >
              <Trash2 className="w-4.5 h-4.5" strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pt-2 pb-4">
      <div className="mx-auto max-w-3xl px-4">
        <div
          className={`flex flex-col rounded-[22px] bg-[#f2f2f2] dark:bg-[#2a2a2a] transition-all duration-200 ${
            focused
              ? "ring-1 ring-[#2563eb]/30 shadow-[0_2px_12px_rgba(37,99,235,0.08)]"
              : "ring-1 ring-transparent"
          }`}
        >
          {replyingTo && !isAISelected && (
            <div className="flex items-center gap-2.5 px-3.5 pt-3 pb-1.5">
              <div className="w-[2.5px] h-8 rounded-full bg-[#2563eb] shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-medium text-[#2563eb] truncate leading-tight">
                  {replyingTo.isMe
                    ? "Replying to yourself"
                    : `Replying to ${replyingTo.senderName}`}
                </p>
                <p className="text-[12px] text-[#8a8a8a] truncate leading-tight mt-0.5">
                  {replyingTo.text || (replyingTo.image ? "Photo" : "Message")}
                </p>
              </div>
              <button
                onClick={onCancelReply}
                aria-label="Cancel reply"
                className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[#8a8a8a] hover:text-[#111] dark:hover:text-[#f0f0f0] hover:bg-black/5 dark:hover:bg-white/6 active:scale-95 transition"
              >
                <XIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {editingMessage && !isAISelected && (
            <div className="flex items-center gap-2.5 px-3.5 pt-3 pb-1.5">
              <div className="w-[2.5px] h-8 rounded-full bg-[#2563eb] shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-medium text-[#2563eb] truncate leading-tight">
                  Editing message
                </p>
                <p className="text-[12px] text-[#8a8a8a] truncate leading-tight mt-0.5">
                  {editingMessage.text || "Original message"}
                </p>
              </div>
              <button
                onClick={cancelEditing}
                aria-label="Cancel editing"
                className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[#8a8a8a] hover:text-[#111] dark:hover:text-[#f0f0f0] hover:bg-black/5 dark:hover:bg-white/6 active:scale-95 transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {imagePreview && !isAISelected && !editingMessage && (
            <div className="flex items-center gap-2.5 px-3.5 pt-3 pb-1.5">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-9 h-9 rounded-lg object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-[12px] text-[#111] dark:text-[#f0f0f0] truncate leading-tight">
                  Image attached
                </p>
                <p className="text-[11px] text-[#8a8a8a] truncate leading-tight mt-0.5">
                  Ready to send
                </p>
              </div>
              <button
                onClick={removeImage}
                aria-label="Remove image"
                className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[#8a8a8a] hover:text-red-500 hover:bg-red-500/8 active:scale-95 transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="flex items-center gap-1 px-1.5 py-1.5">
            {!isAISelected && !editingMessage && (
              <button
                onClick={handleImageSelect}
                disabled={isDisabled}
                aria-label="Attach image"
                className="w-9 h-9 rounded-full flex items-center justify-center text-[#8a8a8a] hover:text-[#111] dark:hover:text-[#f0f0f0] hover:bg-black/5dark:hover:bg-white/[0.06] disabled:opacity-30 disabled:hover:bg-transparent active:scale-95 transition shrink-0"
              >
                <ImageIcon className="w-4.25 h-4.25" strokeWidth={1.75} />
              </button>
            )}

            <input
              type="text"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                if (!isAISelected && selected?.conversationId) {
                  const socket = getSocket();
                  if (socket && e.target.value.trim()) {
                    socket.emit("typing", { receiverId: selected._id });
                    clearTimeout(typingTimeout.current);
                    typingTimeout.current = setTimeout(() => {
                      socket.emit("stop-typing", { receiverId: selected._id });
                    }, 2000);
                  }
                }
              }}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onKeyDown={handleKeyDown}
              disabled={isDisabled}
              placeholder={placeholder}
              className="flex-1 bg-transparent py-2 px-1 text-sm text-[#111] dark:text-[#f0f0f0] placeholder:text-[#8a8a8a] outline-none disabled:opacity-40 min-w-0"
            />

            <button
              onClick={handleSend}
              disabled={!canSend}
              aria-label="Send"
              className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
                canSend
                  ? "bg-[#2563eb] text-white hover:bg-[#1d4ed8] active:scale-95"
                  : "bg-transparent text-[#8a8a8a] cursor-not-allowed"
              }`}
            >
              {loading ? (
                <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="w-4.25 h-4.25" strokeWidth={1.75} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
