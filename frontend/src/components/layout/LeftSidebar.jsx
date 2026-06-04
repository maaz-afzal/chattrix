import React, { useState } from "react";
import { MessageCircle, Users, Search, Plus, Settings } from "lucide-react";
import Avatar from "../common/Avatar";
import IconButton from "../common/IconButton";
import Badge from "../common/Badge";
import SearchBar from "../ui/SearchBar";
import FilterTabs from "../ui/FilterTabs";
import ChatList from "../ui/ChatList";
import UserProfileModal from "../ui/UserProfileModal";
import { useSelector } from "react-redux";

const LeftSidebar = ({ onSelected }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userSelector = useSelector((state) => state.auth.user);

  return (
    <>
      <aside className="w-full max-w-xs shrink-0 bg-gray-800/60 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-700/40 flex flex-col overflow-hidden">
        {/* header */}
        <div className="px-5 pt-5 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-linear-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Chattrix
            </span>
          </div>
          <IconButton icon={Plus} ariaLabel="New chat" />
        </div>

        {/* search */}
        <div className="px-5 pb-3">
          <SearchBar placeholder="Search messages..." />
        </div>

        {/* filter tabs */}
        <div className="px-5 pb-3">
          <FilterTabs />
        </div>

        {/* chat list */}
        <div className="flex-1 overflow-y-auto min-h-0 px-3 pb-3">
          <ChatList onSelectedUser={onSelected} />
        </div>

        {/* footer profile */}
        <div className="p-3 border-t border-gray-700/40">
          <div className="flex items-center gap-3 p-2 bg-gray-700/60 rounded-2xl">
            <div className="relative shrink-0">
              <Avatar
                name="JD"
                size="md"
                linear="from-indigo-500 to-purple-500"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-200 font-medium text-sm truncate">
                {userSelector?.name}
              </p>
              <p className="text-gray-500 text-xs">Online</p>
            </div>
            <IconButton
              icon={Settings}
              ariaLabel="Settings"
              size="sm"
              onClick={() => setIsModalOpen(true)}
            />
          </div>
        </div>
      </aside>

      <UserProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={userSelector}
      />
    </>
  );
};

export default LeftSidebar;
