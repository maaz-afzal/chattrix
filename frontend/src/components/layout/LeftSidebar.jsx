import React, { useEffect, useState, useCallback } from "react";
import { Settings, X, Search, SquarePen } from "lucide-react";
import Avatar from "../common/Avatar.jsx";
import IconButton from "../common/IconButton";
import FilterTabs from "../chat/FilterTabs.jsx";
import ChatList from "../chat/ChatList.jsx";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import userService from "../../services/userService.js";
import conversationService from "../../services/conversationService.js";
import { getSocket } from "../../lib/socket.js";
import {
  setAllUsers,
  setSelectedConversationId,
} from "../../redux/Slices/userSlice.js";
import toast from "react-hot-toast";

const LeftSidebar = ({ onSelected, onSelectAI, isAISelected }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.auth.user);
  const allUsers = useSelector((state) => state.users.allUsers);
  const onlineUsers = useSelector((state) => state.users.onlineUsers);

  const [conversations, setConversations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalSearch, setModalSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const isOnline =
    onlineUsers.includes(currentUser?._id) || getSocket()?.connected;

  const fetchConversations = useCallback(async () => {
    try {
      const res = await conversationService.getConversations();
      setConversations(res);
    } catch {
      toast.error("Failed to load conversations.");
    }
  }, []);

  const fetchAllUsers = useCallback(async () => {
    try {
      const res = await userService.getAllUsers();
      dispatch(setAllUsers(res));
    } catch {
      toast.error("Failed to load users.");
    }
  }, [dispatch]);

  useEffect(() => {
    fetchConversations();
    fetchAllUsers();
  }, [fetchConversations, fetchAllUsers]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleNewMessage = () => fetchConversations();
    socket.on("receive-message", handleNewMessage);
    socket.on("message-sent", handleNewMessage);
    socket.on("unread-update", handleNewMessage);

    return () => {
      socket.off("receive-message", handleNewMessage);
      socket.off("message-sent", handleNewMessage);
      socket.off("unread-update", handleNewMessage);
    };
  }, [fetchConversations]);

  const chatList = conversations
    .filter((conv) => !conv.isAIChat)
    .map((conv) => {
      const otherUser = conv.participants?.find(
        (p) => p._id !== currentUser?._id,
      );
      if (!otherUser) return null;
      const unreadCount = currentUser?._id
        ? conv.unreadCount?.[currentUser._id] || 0
        : 0;
      return {
        ...otherUser,
        conversationId: conv._id,
        lastMessage: conv.lastMessage?.text
          ? conv.lastMessage.text
          : conv.lastMessage?.image
            ? "Image"
            : null,
        lastMessageAt: conv.updatedAt,
        unreadCount,
      };
    })
    .filter(Boolean);

  const filteredUsers = chatList.filter((u) =>
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const modalFilteredUsers = allUsers.filter((u) =>
    u.name?.toLowerCase().includes(modalSearch.toLowerCase()),
  );

  const handleConversation = async (selectedUser) => {
    setIsModalOpen(false);
    setModalSearch("");

    if (selectedUser.conversationId) {
      dispatch(setSelectedConversationId(selectedUser.conversationId));
      onSelected(selectedUser);
    } else {
      try {
        const res = await conversationService.findOrCreateConversation(
          selectedUser._id,
        );
        const conversationId = res.conversation._id || res._id;
        dispatch(setSelectedConversationId(conversationId));
        onSelected({ ...selectedUser, conversationId });
        fetchConversations();
      } catch {
        toast.error("Failed to start conversation.");
      }
    }
  };

  return (
    <>
      <aside className="w-100 border-r border-[#2E2E2F] bg-[#161616] flex flex-col overflow-hidden">
        <div className="px-4 pt-5 pb-3">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-[22px] font-bold text-white tracking-tight">
              Chattrix
            </h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-8 h-8 rounded-lg bg-[#A37CFF] hover:bg-[#9370f0] text-white flex items-center justify-center transition-colors"
            >
              <SquarePen className="w-4 h-4" />
            </button>
          </div>

          <div
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all ${
              searchFocused
                ? "bg-[#1D1E1F] ring-1 ring-[#A37CFF]/30"
                : "bg-[#1D1E1F]"
            }`}
          >
            <Search
              className={`w-4 h-4 shrink-0 ${searchFocused ? "text-[#A37CFF]" : "text-[#666]"}`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Search"
              className="w-full bg-transparent outline-none text-[13px] text-white placeholder:text-[#666]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-[#666] hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="mt-3">
            <FilterTabs />
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto px-2 py-1">
          <ChatList
            users={filteredUsers}
            onSelectedUser={onSelected}
            onSelectAI={onSelectAI}
            isAISelected={isAISelected}
            onDeleteConversation={fetchConversations}
          />
        </div>

        <div className="px-3 py-3 border-t border-[#2E2E2F]">
          <div
            onClick={() => navigate("/profile")}
            className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-[#1D1E1F] transition-colors cursor-pointer"
          >
            <div className="relative shrink-0">
              <Avatar
                name={currentUser?.name}
                profileImage={currentUser?.profileImage}
                size="sm"
              />
              <span
                className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#161616] ${
                  isOnline ? "bg-emerald-500" : "bg-[#555]"
                }`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-white truncate">
                {currentUser?.name || "User"}
              </p>
              <p
                className={`text-[11px] ${isOnline ? "text-emerald-500" : "text-[#666]"}`}
              >
                {isOnline ? "Online" : "Offline"}
              </p>
            </div>
            <Settings className="w-4 h-4 text-[#666]" />
          </div>
        </div>
      </aside>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => {
              setIsModalOpen(false);
              setModalSearch("");
            }}
          />
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[#2E2E2F] bg-[#161616]">
            <div className="px-5 py-4 border-b border-[#2E2E2F] flex items-center justify-between">
              <h3 className="text-[15px] font-semibold text-white">New Chat</h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setModalSearch("");
                }}
                className="p-1.5 rounded-lg text-[#666] hover:text-white hover:bg-[#1D1E1F] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 border-b border-[#2E2E2F]">
              <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-[#1D1E1F]">
                <Search className="w-4 h-4 text-[#666]" />
                <input
                  type="text"
                  value={modalSearch}
                  onChange={(e) => setModalSearch(e.target.value)}
                  placeholder="Search people"
                  className="w-full bg-transparent outline-none text-[13px] text-white placeholder:text-[#666]"
                  autoFocus
                />
              </div>
            </div>

            <div className="max-h-90 overflow-y-auto p-2">
              {modalFilteredUsers.length === 0 ? (
                <p className="py-10 text-center text-[13px] text-[#666]">
                  No users found.
                </p>
              ) : (
                modalFilteredUsers.map((u) => (
                  <button
                    key={u._id}
                    onClick={() => handleConversation(u)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#1D1E1F] transition-colors text-left"
                  >
                    <Avatar
                      name={u.name}
                      profileImage={u.profileImage}
                      size="sm"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-white truncate">
                        {u.name}
                      </p>
                      <p
                        className={`text-[11px] ${onlineUsers.includes(u._id) ? "text-emerald-500" : "text-[#666]"}`}
                      >
                        {onlineUsers.includes(u._id) ? "Online" : "Offline"}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LeftSidebar;
