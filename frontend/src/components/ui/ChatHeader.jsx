import React, { useState } from "react";
import {
  MoreHorizontal,
  ChevronLeft,
  Trash2,
  X,
  CheckSquare,
} from "lucide-react";
import Avatar from "../common/Avatar";
import IconButton from "../common/IconButton";
import * as messageService from "../../services/messageService.js";
import { toast } from "react-hot-toast";

const ChatHeader = ({ selected }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!selected) {
    return (
      <div className="px-6 py-4 border-b border-neutral-800">
        <p className="text-neutral-400 text-center">Select a chat</p>
      </div>
    );
  }

  const { name, avatar, status } = selected;
  const isOnline = status === "online";
  const avatarLetter = avatar || name?.charAt(0).toUpperCase() || "U";

  const handleClearChat = async () => {
    try {
      await messageService.clearChat(selected._id);
      toast.success("Chat cleared successfully!");
      window.location.reload();
    } catch (err) {
      console.error("Error clearing chat:", err);
      toast.error("Failed to clear chat");
    }
    setIsModalOpen(false);
  };

  const handleSelectMessages = () => {
    console.log("Select messages for:", name);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button className="lg:hidden p-1.5 hover:bg-neutral-800 rounded-xl transition">
            <ChevronLeft className="w-5 h-5 text-neutral-400" />
          </button>
          <Avatar name={avatarLetter} size="md" online={isOnline} />
          <div className="min-w-0">
            <p className="text-neutral-200 font-semibold truncate">{name}</p>
            <p className="text-neutral-500 text-xs flex items-center gap-1">
              <span
                className={`w-1.5 h-1.5 rounded-full ${isOnline ? "bg-green-500" : "bg-neutral-500"}`}
              />
              {isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <IconButton
            icon={MoreHorizontal}
            ariaLabel="More"
            onClick={() => setIsModalOpen(true)}
          />
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Modal Content */}
          <div className="absolute top-20 right-6 z-50 w-56 bg-neutral-800 rounded-xl shadow-xl border border-neutral-700 overflow-hidden">
            {/* Select Messages Option */}
            <button
              onClick={handleSelectMessages}
              className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-neutral-700 transition-colors"
            >
              <CheckSquare className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-neutral-200">Select Messages</span>
            </button>

            {/* Clear Chat Option */}
            <button
              onClick={handleClearChat}
              className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-neutral-700 transition-colors border-t border-neutral-700"
            >
              <Trash2 className="w-4 h-4 text-red-400" />
              <span className="text-sm text-neutral-200">Clear Chat</span>
            </button>

            {/* Cancel Option */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-neutral-700 transition-colors border-t border-neutral-700"
            >
              <X className="w-4 h-4 text-neutral-400" />
              <span className="text-sm text-neutral-200">Cancel</span>
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default ChatHeader;
