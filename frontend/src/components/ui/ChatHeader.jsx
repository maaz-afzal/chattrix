import React, { useState } from "react";
import {
  MoreVertical,
  ChevronLeft,
  Trash2,
  X,
  CheckSquare,
  Bot,
  Shield,
} from "lucide-react";
import { useSelector } from "react-redux";
import Avatar from "../common/Avatar";
import { useSelect } from "../layout/ChatArea.jsx";
import { formatLastSeen } from "../../utils/formatLastSeen.js";

const UserInfoModal = ({ user, onClose }) => {
  const onlineUsers = useSelector((state) => state.users.onlineUsers);
  const lastSeenByUser = useSelector((state) => state.users.lastSeenByUser);
  const isOnline = onlineUsers.includes(user?._id);
  const lastSeen = lastSeenByUser[user?._id] || user?.lastSeen;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-2xl border border-[#2E2E2F] bg-[#161616] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#2E2E2F] flex items-center justify-between">
          <h3 className="text-[14px] font-semibold text-white">Contact Info</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#666] hover:text-white hover:bg-[#1D1E1F] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col items-center py-6 px-5">
          <Avatar
            name={user?.name}
            profileImage={user?.profileImage}
            size="xl"
            online={isOnline}
          />
          <h2 className="text-[17px] font-semibold text-white mt-4">
            {user?.name}
          </h2>
          <p
            className={`text-[12px] mt-1 ${isOnline ? "text-emerald-500" : "text-[#666]"}`}
          >
            {isOnline
              ? "Online"
              : lastSeen
                ? `Last seen ${formatLastSeen(lastSeen)}`
                : "Offline"}
          </p>
        </div>

        <div className="px-5 pb-5 space-y-3">
          {user?.email && (
            <div className="rounded-xl bg-[#1D1E1F] p-3">
              <p className="text-[10px] uppercase tracking-wider text-[#666] mb-1">
                Email
              </p>
              <p className="text-[13px] text-[#ccc]">{user.email}</p>
            </div>
          )}
          {user?.bio && (
            <div className="rounded-xl bg-[#1D1E1F] p-3">
              <p className="text-[10px] uppercase tracking-wider text-[#666] mb-1">
                Bio
              </p>
              <p className="text-[13px] text-[#ccc] leading-relaxed">
                {user.bio}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ChatHeader = ({ selected, isAISelected, onBack }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showUserInfo, setShowUserInfo] = useState(false);

  const {
    selectMode,
    selectedMessages,
    enableSelectMode,
    disableSelectMode,
    handleClearChat,
    handleDeleteSelected,
  } = useSelect();

  const onlineUsers = useSelector((state) => state.users.onlineUsers);
  const typingUsers = useSelector((state) => state.users.typingUsers);
  const lastSeenByUser = useSelector((state) => state.users.lastSeenByUser);

  const { name, _id, profileImage } = selected || {};
  const isOnline =
    onlineUsers.includes(_id) ||
    selected?.isOnline ||
    selected?.status === "online";
  const isTyping = _id && typingUsers[_id];
  const lastSeen = lastSeenByUser[_id] || selected?.lastSeen;
  const statusText = isOnline
    ? "Online"
    : lastSeen
      ? `Last seen ${formatLastSeen(lastSeen)}`
      : "Offline";

  if (isAISelected) {
    return (
      <div className="shrink-0 border-b border-[#2E2E2F] bg-[#161616] px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-1.5 rounded-lg hover:bg-[#1D1E1F] transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-[#999]" />
            </button>
            <div className="w-9 h-9 rounded-full bg-[#A37CFF]/15 flex items-center justify-center">
              <Bot className="w-4 h-4 text-[#A37CFF]" />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-white leading-tight">
                AI Assistant
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <Shield className="w-3 h-3 text-[#A37CFF]" />
                <span className="text-[10px] text-[#A37CFF]">Gemini</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setMenuOpen(true)}
              className="p-1.5 rounded-lg text-[#666] hover:text-white hover:bg-[#1D1E1F] transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-1 z-50 w-40 rounded-xl border border-[#2E2E2F] bg-[#1D1E1F] overflow-hidden shadow-xl">
                  <button
                    onClick={() => {
                      handleClearChat();
                      setMenuOpen(false);
                    }}
                    className="w-full px-3 py-2.5 flex items-center gap-2 text-left text-[12px] text-[#f87171] hover:bg-[#2E2E2F] transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Clear Chat
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!selected) {
    return (
      <div className="shrink-0 flex-1 flex flex-col items-center justify-center bg-[#161616]">
        <h2 className="text-[24px] font-bold text-white mb-1">Chattrix</h2>
        <p className="text-[13px] text-[#666]">
          Select a chat to start messaging
        </p>
      </div>
    );
  }

  if (selectMode) return null;

  return (
    <>
      <div className="shrink-0 border-b border-[#2E2E2F] bg-[#161616] px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={onBack}
              className="p-1.5 rounded-lg hover:bg-[#1D1E1F] transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-[#999]" />
            </button>

            <button
              onClick={() => setShowUserInfo(true)}
              className="flex items-center gap-3 min-w-0 hover:opacity-80 transition-opacity"
            >
              <Avatar
                name={name}
                profileImage={profileImage}
                size="sm"
                online={isOnline}
              />
              <div className="min-w-0 text-left">
                <p className="text-[13px] font-semibold text-white truncate">
                  {name}
                </p>
                <p className="text-[11px] mt-px truncate">
                  {isTyping ? (
                    <span className="text-[#A37CFF]">Typing...</span>
                  ) : (
                    <span
                      className={isOnline ? "text-emerald-500" : "text-[#666]"}
                    >
                      {statusText}
                    </span>
                  )}
                </p>
              </div>
            </button>
          </div>

          <div className="relative">
            <button
              onClick={() => setMenuOpen(true)}
              className="p-1.5 rounded-lg text-[#666] hover:text-white hover:bg-[#1D1E1F] transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-1 z-50 w-44 rounded-xl border border-[#2E2E2F] bg-[#1D1E1F] overflow-hidden shadow-xl">
                  <button
                    onClick={() => {
                      enableSelectMode();
                      setMenuOpen(false);
                    }}
                    className="w-full px-3 py-2.5 flex items-center gap-2 text-left text-[12px] text-white hover:bg-[#2E2E2F] transition-colors"
                  >
                    <CheckSquare className="w-3.5 h-3.5 text-[#A37CFF]" />
                    Select Messages
                  </button>
                  <div className="mx-2 h-px bg-[#2E2E2F]" />
                  <button
                    onClick={() => {
                      handleClearChat();
                      setMenuOpen(false);
                    }}
                    className="w-full px-3 py-2.5 flex items-center gap-2 text-left text-[12px] text-[#f87171] hover:bg-[#2E2E2F] transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Clear Chat
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {showUserInfo && selected && (
        <UserInfoModal user={selected} onClose={() => setShowUserInfo(false)} />
      )}
    </>
  );
};

export default ChatHeader;
