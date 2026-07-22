import React, { useState } from "react";
import { useSelector } from "react-redux";
import ChatItem from "./ChatItem";
import AIChatItem from "./AIChatItem";

const ChatList = ({
  users,
  onSelectedUser,
  onSelectAI,
  isAISelected,
  onDeleteConversation,
}) => {
  const [selectedChatId, setSelectedChatId] = useState(null);
  const onlineUsers = useSelector((state) => state.users.onlineUsers);
  const lastSeenByUser = useSelector((state) => state.users.lastSeenByUser);

  const enrichedUsers = users.map((user) => ({
    ...user,
    status: onlineUsers.includes(user._id) ? "online" : "offline",
    isOnline: onlineUsers.includes(user._id),
    lastSeen: lastSeenByUser[user._id] || user.lastSeen,
  }));

  const handleSelectChat = (chat) => {
    setSelectedChatId(chat._id);
    if (onSelectedUser) onSelectedUser(chat);
  };
  const handleAIClick = () => {
    setSelectedChatId(null);
    if (onSelectAI) onSelectAI();
  };

  return (
    <div className="space-y-0.5">
      <AIChatItem isSelected={isAISelected} onClick={handleAIClick} />
      {enrichedUsers.map((chat) => (
        <ChatItem
          key={chat._id}
          chat={chat}
          isSelected={selectedChatId === chat._id}
          onClick={() => handleSelectChat(chat)}
          onDelete={onDeleteConversation}
        />
      ))}
      {enrichedUsers.length === 0 && (
        <p className="px-4 py-10 text-center text-[12px] text-[#555]">
          No conversations
        </p>
      )}
    </div>
  );
};

export default ChatList;
