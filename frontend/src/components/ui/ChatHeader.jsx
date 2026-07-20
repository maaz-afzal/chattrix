import React, { useState } from "react";
import {
  MoreHorizontal,
  ChevronLeft,
  Trash2,
  X,
  CheckSquare,
  Bot,
} from "lucide-react";
import Avatar from "../common/Avatar";
import IconButton from "../common/IconButton";
import { useSelect } from "../layout/ChatArea.jsx";
import { formatLastSeen } from "../../utils/formatLastSeen.js";

const ChatHeader = ({ selected, isAISelected }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    selectMode,
    selectedMessages,
    enableSelectMode,
    disableSelectMode,
    handleClearChat,
    handleDeleteSelected,
  } = useSelect();

  if (isAISelected) {
    return (
      <div className="px-6 py-4 border-b border-cyan-500/20 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 bg-cyan-500/10 rounded-full border border-cyan-400/40 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.2)]">
            <Bot className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="min-w-0">
            <p className="text-gray-200 font-semibold truncate">
              AI Assistant
            </p>
            <p className="text-gray-500 text-xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.5)]" />
              Online
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!selected) {
    return (
      <div className="px-6 py-4 border-b border-cyan-500/20">
        <p className="text-gray-400 text-center">Select a chat</p>
      </div>
    );
  }

  const { name } = selected;
  const avatarLetter = name?.charAt(0).toUpperCase() || "U";
  const isOnline = false;

  if (selectMode) {
    return (
      <div className="px-6 py-4 border-b border-cyan-500/20 flex items-center justify-between gap-3 bg-black/40">
        <div className="flex items-center gap-3">
          <button
            onClick={disableSelectMode}
            aria-label="Cancel selection"
            className="p-1.5 hover:bg-cyan-500/10 rounded-xl"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
          <span className="text-white font-medium">
            {selectedMessages.length} selected
          </span>
        </div>
        <button
          onClick={handleDeleteSelected}
          disabled={selectedMessages.length === 0}
          aria-label="Delete selected messages"
          className="p-2 hover:bg-red-500/10 rounded-xl text-red-400 disabled:opacity-50"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="px-6 py-4 border-b border-cyan-500/20 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button
            className="lg:hidden p-1.5 hover:bg-cyan-500/10 rounded-xl"
            aria-label="Go back"
          >
            <ChevronLeft className="w-5 h-5 text-gray-400" />
          </button>
          <Avatar name={avatarLetter} size="md" online={isOnline} />
          <div className="min-w-0">
            <p className="text-gray-200 font-semibold truncate">{name}</p>
            <p className="text-gray-500 text-xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
              Offline
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <IconButton
            icon={MoreHorizontal}
            ariaLabel="More options"
            onClick={() => setIsModalOpen(true)}
          />
        </div>
      </div>

      {isModalOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="absolute top-20 right-6 z-50 w-56 bg-black/90 rounded-xl border border-cyan-500/20 shadow-[0_0_20px_rgba(34,211,238,0.1)] overflow-hidden backdrop-blur-xl">
            <button
              onClick={() => {
                enableSelectMode();
                setIsModalOpen(false);
              }}
              className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-cyan-500/10"
            >
              <CheckSquare className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-gray-200">Select Messages</span>
            </button>

            <button
              onClick={() => {
                handleClearChat();
                setIsModalOpen(false);
              }}
              className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-red-500/10 border-t border-cyan-500/20"
            >
              <Trash2 className="w-4 h-4 text-red-400" />
              <span className="text-sm text-gray-200">Clear Chat</span>
            </button>

            <button
              onClick={() => setIsModalOpen(false)}
              className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-cyan-500/10 border-t border-cyan-500/20"
            >
              <X className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-200">Cancel</span>
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default ChatHeader;