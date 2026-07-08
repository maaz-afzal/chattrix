import React, { useEffect, useState } from "react";
import { MessageCircle, Settings } from "lucide-react";
import Avatar from "../common/Avatar";
import IconButton from "../common/IconButton";
import SearchBar from "../ui/SearchBar";
import FilterTabs from "../ui/FilterTabs";
import ChatList from "../ui/ChatList";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllUsers } from "../../services/userService.js";
import toast from "react-hot-toast";

const LeftSidebar = ({ onSelected, onSelectAI, isAISelected }) => {
  const navigate = useNavigate();
  const userSelector = useSelector((state) => state.auth.user);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const isOnline = userSelector?.status === "online";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getAllUsers();
        setUsers(res);
      } catch {
        toast.error("Failed to load users.");
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
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
            <Avatar name={userSelector?.avatar || "U"} size="md" />
            {isOnline ? (
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-black shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
            ) : (
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-gray-500 rounded-full border-2 border-black" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-gray-200 font-medium text-sm truncate">
              {userSelector?.name || "User"}
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
  );
};

export default LeftSidebar;
