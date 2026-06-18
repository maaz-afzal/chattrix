import React, { useEffect, useState } from "react";
import ChatItem from "./ChatItem";
import AIChatItem from "./AIChatItem";
import { getAllUsers } from "../../services/userService.js";
import { getSocket } from "../../lib/socket.js";

const ChatList = ({ onSelectedUser, onSelectAI, isAISelected }) => {
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [usersChat, setUsersChat] = useState([]);

  const getUsers = async () => {
    const res = await getAllUsers();
    setUsersChat(res);
  };

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleUserOnline = (userId) => {
      setUsersChat((prev) =>
        prev.map((user) =>
          user._id === userId ? { ...user, status: "online" } : user,
        ),
      );
    };

    const handleUserOffline = (userId) => {
      setUsersChat((prev) =>
        prev.map((user) =>
          user._id === userId ? { ...user, status: "offline" } : user,
        ),
      );
    };

    socket.on("user-online", handleUserOnline);
    socket.on("user-offline", handleUserOffline);

    return () => {
      socket.off("user-online", handleUserOnline);
      socket.off("user-offline", handleUserOffline);
    };
  }, []);

  const handleSelectChat = (chat) => {
    setSelectedChatId(chat._id);
    if (onSelectedUser) {
      onSelectedUser(chat);
    }
  };

  const handleAIClick = () => {
    setSelectedChatId(null);
    if (onSelectAI && typeof onSelectAI === "function") {
      onSelectAI();
    } else {
      console.log("onSelectAI is not a function:", onSelectAI);
    }
  };

  return (
    <div className="space-y-1.5">
      <AIChatItem
        isSelected={isAISelected}
        onClick={handleAIClick}
      />

      {usersChat.map((chat) => (
        <ChatItem
          key={chat._id}
          chat={chat}
          isSelected={selectedChatId === chat._id}
          onClick={() => handleSelectChat(chat)}
        />
      ))}
    </div>
  );
};

export default ChatList;