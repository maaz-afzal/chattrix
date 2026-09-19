import { useState } from "react";
import {
  MoreVertical,
  ChevronLeft,
  Trash2,
  X,
  CheckSquare2,
  Bot,
  Mail,
  MessageCircle,
} from "lucide-react";
import { useSelector } from "react-redux";
import Avatar from "../common/Avatar.jsx";
import { useSelect } from "../layout/ChatArea.jsx";
import { formatLastSeen } from "../../utils/formatLastSeen.js";

const UserInfoModal = ({ user, onClose }) => {
  const onlineUsers = useSelector((state) => state.users.onlineUsers);
  const lastSeenByUser = useSelector((state) => state.users.lastSeenByUser);
  const isOnline = onlineUsers.includes(user?._id);
  const lastSeen = lastSeenByUser[user?._id] || user?.lastSeen;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 dark:bg-black/60"
        onClick={onClose}
      />

      <div
        className="relative w-full max-w-90 rounded-3xl bg-white dark:bg-[#1c1c1e] shadow-2xl ring-1 ring-black/5 dark:ring-white/10 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 pt-5">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-[#8a8a8a] dark:text-[#9a9a9a]">
            Contact
          </span>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 -mr-1 rounded-full flex items-center justify-center text-[#8a8a8a] dark:text-[#888] hover:text-[#111] dark:hover:text-[#f0f0f0] hover:bg-black/6 dark:hover:bg-white/8 active:scale-95 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col items-center px-6 pt-5 pb-6">
          <div className="relative">
            <div className="rounded-full p-1 ring-1 ring-black/6 dark:ring-white/8">
              <Avatar
                name={user?.name}
                profileImage={user?.profileImage}
                size="xl"
              />
            </div>
            {isOnline && (
              <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 ring-[3px] ring-white dark:ring-[#1c1c1e]" />
            )}
          </div>

          <h2 className="text-[19px] font-semibold text-[#111] dark:text-[#f0f0f0] mt-4 tracking-tight">
            {user?.name}
          </h2>

          <div className="flex items-center gap-1.5 mt-1">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isOnline ? "bg-emerald-500" : "bg-[#a0a0a0] dark:bg-[#666]"
              }`}
            />
            <p
              className={`text-[12.5px] ${
                isOnline
                  ? "text-emerald-600 dark:text-emerald-500"
                  : "text-[#8a8a8a] dark:text-[#9a9a9a]"
              }`}
            >
              {isOnline
                ? "Active now"
                : lastSeen
                  ? `Last seen ${formatLastSeen(lastSeen)}`
                  : "Offline"}
            </p>
          </div>
        </div>

        {(user?.email || user?.bio) && (
          <div className="px-3 pb-3 space-y-2">
            {user?.email && (
              <div className="flex items-start gap-3 rounded-2xl bg-[#f5f5f5] dark:bg-[#252527] px-4 py-3">
                <Mail
                  className="w-4 h-4 mt-0.5 text-[#8a8a8a] dark:text-[#888] shrink-0"
                  strokeWidth={1.75}
                />
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wider text-[#8a8a8a] dark:text-[#9a9a9a] mb-1">
                    Email
                  </p>
                  <p className="text-[13px] text-[#111] dark:text-[#f0f0f0] break-all leading-snug">
                    {user.email}
                  </p>
                </div>
              </div>
            )}
            {user?.bio && (
              <div className="rounded-2xl bg-[#f5f5f5] dark:bg-[#252527] px-4 py-3">
                <p className="text-[10px] uppercase tracking-wider text-[#8a8a8a] dark:text-[#9a9a9a] mb-1">
                  Bio
                </p>
                <p className="text-[13px] text-[#111] dark:text-[#f0f0f0] leading-relaxed">
                  {user.bio}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const ChatHeader = ({ selected, isAISelected, onBack }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showUserInfo, setShowUserInfo] = useState(false);

  const { enableSelectMode, handleClearChat } = useSelect();

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

  const IconButton = ({ onClick, label, children, className = "" }) => (
    <button
      onClick={onClick}
      aria-label={label}
      className={`w-9 h-9 rounded-full flex items-center justify-center text-[#8a8a8a] dark:text-[#888] hover:text-[#111] dark:hover:text-[#f0f0f0] hover:bg-black/5 dark:hover:bg-white/6 active:scale-95 transition ${className}`}
    >
      {children}
    </button>
  );

  const StatusLine = ({ ai = false }) => (
    <div className="flex items-center gap-1.5">
      <span className="relative flex w-1.5 h-1.5">
        {isOnline && !ai && (
          <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-500 opacity-60 animate-ping" />
        )}
        <span
          className={`relative inline-flex w-1.5 h-1.5 rounded-full ${
            isOnline || ai ? "bg-emerald-500" : "bg-[#a0a0a0] dark:bg-[#666]"
          }`}
        />
      </span>
      <span
        className={`text-[11.5px] leading-none ${
          isTyping
            ? "text-[#2563eb] dark:text-[#60a5fa] font-medium"
            : isOnline || ai
              ? "text-emerald-600 dark:text-emerald-500"
              : "text-[#8a8a8a] dark:text-[#9a9a9a]"
        }`}
      >
        {isTyping
          ? "Typing…"
          : ai
            ? "Online"
            : isOnline
              ? "Online"
              : statusText}
      </span>
    </div>
  );

  const menuItems = isAISelected
    ? [
        {
          icon: Trash2,
          label: "Clear chat",
          onClick: handleClearChat,
          destructive: true,
        },
      ]
    : [
        {
          icon: CheckSquare2,
          label: "Select messages",
          onClick: enableSelectMode,
        },
        {
          icon: Trash2,
          label: "Clear chat",
          onClick: handleClearChat,
          destructive: true,
          divider: true,
        },
      ];

  const Menu = () => (
    <div className="relative shrink-0">
      <IconButton onClick={() => setMenuOpen(true)} label="Menu">
        <MoreVertical className="w-4.5 h-4.5" strokeWidth={1.75} />
      </IconButton>

      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute right-0 top-full mt-1.5 z-50 w-34 rounded-lg bg-white dark:bg-[#1c1c1e] ring-1 ring-black/8 dark:ring-white/10 shadow-md dark:shadow-black/40 py-0.5 overflow-hidden">
            {menuItems.map((item, i) => (
              <div key={i}>
                {item.divider && (
                  <div className="my-0.5 mx-2.5 h-px bg-black/6 dark:bg-white/8" />
                )}
                <button
                  onClick={() => {
                    item.onClick();
                    setMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 text-left text-[11.5px] transition ${
                    item.destructive
                      ? "text-red-500 dark:text-red-400 hover:bg-red-500/8"
                      : "text-[#111] dark:text-[#f0f0f0] hover:bg-black/4 dark:hover:bg-white/6"
                  }`}
                >
                  <item.icon
                    className="w-3.5 h-3.5 shrink-0"
                    strokeWidth={1.75}
                  />
                  <span>{item.label}</span>
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );

  if (isAISelected) {
    return (
      <div className="shrink-0 bg-[#fafafa] dark:bg-[#161616] border-b border-black/5 dark:border-white/5">
        <div className="flex items-center justify-between px-3 py-2.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <IconButton onClick={onBack} label="Back" className="sm:hidden">
              <ChevronLeft className="w-5 h-5" strokeWidth={1.75} />
            </IconButton>

            <div className="w-9 h-9 rounded-full bg-[#2563eb] dark:bg-[#3b82f6] flex items-center justify-center shrink-0">
              <Bot className="w-4.5 h-4.5 text-white" strokeWidth={1.75} />
            </div>

            <div className="ml-1 min-w-0">
              <p className="text-[13.5px] font-semibold text-[#111] dark:text-[#f0f0f0] truncate leading-tight tracking-tight">
                AI Assistant
              </p>
              <div className="mt-1">
                <StatusLine ai />
              </div>
            </div>
          </div>

          <Menu />
        </div>
      </div>
    );
  }

  if (!selected) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-[20px] bg-[#7342e6]/10 dark:bg-[#7342e6]/15 border border-[#7342e6]/15 dark:border-[#7342e6]/20 flex items-center justify-center mb-5">
            <MessageCircle
              className="w-7 h-7 text-[#7342e6]"
              strokeWidth={1.7}
            />
          </div>

          <h2 className="text-[22px] font-semibold text-[#18181a] dark:text-[#f2f2f3] tracking-tight">
            Chattrix
          </h2>

          <p className="text-[14px] text-[#8a8a8e] dark:text-[#858589] mt-2">
            Select a chat to start messaging
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="shrink-0 bg-[#fafafa] dark:bg-[#161616] border-b border-[#e7e7e9] dark:border-[#29292b]">
        <div className="flex items-center justify-between h-14.5 px-3">
          <div className="flex items-center gap-1 min-w-0">
            <IconButton onClick={onBack} label="Back" className="sm:hidden">
              <ChevronLeft
                className="w-4.75 h-4.75 text-[#5f5f63] dark:text-[#a4a4a8]"
                strokeWidth={1.8}
              />
            </IconButton>

            <button
              onClick={() => setShowUserInfo(true)}
              className="group flex items-center gap-2.5 min-w-0 px-1.5 py-1 rounded-xl text-left hover:bg-[#f0f0f2] dark:hover:bg-[#1e1e20] transition-colors duration-150"
            >
              <div className="shrink-0">
                <Avatar
                  name={name}
                  profileImage={profileImage}
                  size="sm"
                  online={isOnline}
                />
              </div>

              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-[#18181a] dark:text-[#f2f2f3] truncate leading-4 tracking-[-0.015em]">
                  {name}
                </p>

                <div className="mt-0.75 leading-none">
                  <StatusLine />
                </div>
              </div>
            </button>
          </div>

          <div className="flex items-center justify-center shrink-0">
            <Menu />
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
