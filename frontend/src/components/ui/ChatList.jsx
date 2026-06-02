import React, { useEffect, useState } from "react";
import ChatItem from "./ChatItem";
import { getAllUsers } from "../../services/userService.js";

const ChatList = ({ onSelectedUser }) => {
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [usersChat, setUsersChat] = useState([]);

  const getUsers = async () => {
    const res = await getAllUsers();
    setUsersChat(res);
  };

  useEffect(() => {
    getUsers();
  }, []);

  const handleSelectChat = (chat) => {
    setSelectedChatId(chat._id);
    if (onSelectedUser) {
      onSelectedUser(chat);
    }
  };

  return (
    <div className="space-y-1.5">
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
