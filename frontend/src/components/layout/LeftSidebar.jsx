import React, { useState } from "react";
import { MessageCircle, Users, Search, Plus, Settings } from "lucide-react";
import Avatar from "../common/Avatar";
import IconButton from "../common/IconButton";
import Badge from "../common/Badge";
import SearchBar from "../ui/SearchBar";
import FilterTabs from "../ui/FilterTabs";
import ChatList from "../ui/ChatList";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const LeftSidebar = ({ onSelected }) => {
  const navigate = useNavigate();
  const userSelector = useSelector((state) => state.auth.user);

  return (
    <>
      <aside className="w-full max-w-xs shrink-0 bg-neutral-900/80 backdrop-blur-xl rounded-3xl shadow-xl border border-neutral-800 flex flex-col overflow-hidden">
        {/* header */}
        <div className="px-5 pt-5 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-white">Chattrix</span>
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
        <div className="p-3 border-t border-neutral-800">
          <div className="flex items-center gap-3 p-2 bg-neutral-800/60 rounded-2xl">
            <div className="relative shrink-0">
              <Avatar name="JD" size="md" />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-black" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-neutral-200 font-medium text-sm truncate">
                {userSelector?.name}
              </p>
              <p className="text-neutral-500 text-xs">Online</p>
            </div>
            <IconButton
              icon={Settings}
              ariaLabel="Settings"
              size="sm"
              onClick={() => navigate("/profile")}
            />
          </div>
        </div>
      </aside>
    </>
  );
};

export default LeftSidebar;
