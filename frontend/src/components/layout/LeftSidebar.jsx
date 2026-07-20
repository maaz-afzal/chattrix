import React, { useEffect, useState } from "react";
import { MessageCircle, Settings, Pencil, X, Search } from "lucide-react";
import Avatar from "../common/Avatar";
import IconButton from "../common/IconButton";
import SearchBar from "../ui/SearchBar";
import FilterTabs from "../ui/FilterTabs";
import ChatList from "../ui/ChatList";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import userService from "../../services/userService.js";
import { setAllUsers } from "../../redux/Slices/userSlice.js";
import conversationService from "../../services/conversationService.js";
import toast from "react-hot-toast";

const LeftSidebar = ({ onSelected, onSelectAI, isAISelected }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const allUsers = useSelector((state) => state.users.allUsers);
  const onlineUsers = useSelector((state) => state.users.onlineUsers);

  const [searchQuery, setSearchQuery] = useState("");
  const [modalSearch, setModalSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isOnline = onlineUsers.includes(user?._id);


  // fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await userService.getAllUsers();
        dispatch(setAllUsers(res));
      } catch {
        toast.error("Failed to load users.");
      }
    };
    fetchUsers();
  }, [dispatch]);

  const filteredUsers = allUsers.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const modalFilteredUsers = allUsers.filter((u) =>
    u.name.toLowerCase().includes(modalSearch.toLowerCase()),
  );

  const handleConversation = (id) => {
    setIsModalOpen(false);
    setModalSearch("");
    onSelected(user);
  };

  return (
    <>
      <aside className="w-full max-w-xs shrink-0 bg-black/80 backdrop-blur-xl rounded border border-cyan-500/20 shadow-[0_0_30px_rgba(34,211,238,0.08)] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 pt-5 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-cyan-500/10 rounded-2xl border border-cyan-400/40 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.2)]">
              <MessageCircle className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <span className="font-bold text-lg text-white">Chattrix</span>
            </div>
          </div>

          {/* Pencil Button */}
          <IconButton
            icon={Pencil}
            ariaLabel="New chat"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/40"
          />
        </div>

        {/* Search */}
        <div className="px-5 pb-3">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search users..."
          />
        </div>

        {/* Filter Tabs */}
        <div className="px-5 pb-3">
          <FilterTabs />
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto min-h-0 px-3 pb-3">
          <ChatList
            users={filteredUsers}
            onSelectedUser={onSelected}
            onSelectAI={onSelectAI}
            isAISelected={isAISelected}
          />
        </div>

        {/* User Profile */}
        <div className="p-3 border-t border-cyan-500/20">
          <div className="flex items-center gap-3 p-2.5 bg-white/2 rounded-2xl border border-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.06)]">
            <div className="relative shrink-0">
              <Avatar name={user?.name || "U"} />
              {isOnline ? (
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-black shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
              ) : (
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-gray-500 rounded-full border-2 border-black" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-200 font-medium text-sm truncate">
                {user?.name || "User"}
              </p>
              <p
                className={`text-xs ${isOnline ? "text-green-400" : "text-gray-500"}`}
              >
                {isOnline ? "Online" : "Offline"}
              </p>
            </div>
            <IconButton
              icon={Settings}
              ariaLabel="Go to settings"
              size="sm"
              onClick={() => navigate("/profile")}
            />
          </div>
        </div>
      </aside>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-black/90 border border-cyan-500/30 rounded-2xl w-full max-w-md mx-4 shadow-[0_0_50px_rgba(34,211,238,0.15)] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-cyan-500/20">
              <h3 className="text-white font-semibold text-lg">New Chat</h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setModalSearch("");
                }}
                className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Search */}
            <div className="px-5 py-3 border-b border-cyan-500/10">
              <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2 border border-cyan-500/20 focus-within:border-cyan-400/60 transition">
                <Search className="w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={modalSearch}
                  onChange={(e) => setModalSearch(e.target.value)}
                  placeholder="Search users..."
                  className="bg-transparent outline-none text-white text-sm w-full placeholder:text-gray-500"
                  autoFocus
                />
              </div>
            </div>

            {/* Modal User List */}
            <div className="max-h-96 overflow-y-auto p-2">
              {modalFilteredUsers.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-8">
                  No users found.
                </p>
              ) : (
                modalFilteredUsers.map((u) => (
                  <button
                    key={u._id}
                    onClick={() => handleConversation(u._id)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition text-left"
                  >
                    <Avatar profileImage={user.profileImage} size="sm" online={user.isOnline} />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">
                        {u.name}
                      </p>
                      <p className="text-xs text-gray-500">
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
