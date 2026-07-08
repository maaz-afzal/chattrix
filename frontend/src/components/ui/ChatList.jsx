import React, { useEffect, useState } from "react";
import ChatItem from "./ChatItem";
import AIChatItem from "./AIChatItem";
import { getSocket } from "../../lib/socket.js";

const ChatList = ({ users, onSelectedUser, onSelectAI, isAISelected }) => {
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState({});
  const [lastSeenMap, setLastSeenMap] = useState({});

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleUserOnline = (userId) => {
      setOnlineUsers((prev) => ({ ...prev, [userId]: true }));
    };

    const handleUserOffline = ({ userId, lastSeen }) => {
      setOnlineUsers((prev) => ({ ...prev, [userId]: false }));
      setLastSeenMap((prev) => ({ ...prev, [userId]: lastSeen }));
    };

    socket.on("user-online", handleUserOnline);
    socket.on("user-offline", handleUserOffline);

    return () => {
      socket.off("user-online", handleUserOnline);
      socket.off("user-offline", handleUserOffline);
    };
  }, []);

  const enrichedUsers = users.map((user) => ({
    ...user,
    status:
      onlineUsers[user._id] === true
        ? "online"
        : onlineUsers[user._id] === false
          ? "offline"
          : user.status,
    lastSeen: lastSeenMap[user._id] || user.lastSeen,
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
    <div className="space-y-1">
      <AIChatItem isSelected={isAISelected} onClick={handleAIClick} />

      {enrichedUsers.map((chat) => (
        <ChatItem
          key={chat._id}
          chat={chat}
          isSelected={selectedChatId === chat._id}
          onClick={() => handleSelectChat(chat)}
        />
      ))}

      {enrichedUsers.length === 0 && (
        <p className="text-gray-500 text-xs text-center py-4">No users found</p>
      )}
    </div>
  );
};

export default ChatList;
