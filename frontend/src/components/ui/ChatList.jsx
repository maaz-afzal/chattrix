import React, { useEffect, useState } from "react";
import ChatItem from "./ChatItem";
import { getAllUsers } from "../../services/userService.js";

const ChatList = () => {
  const [selectedChatId, setSelectedChatId] = useState(1);
  const [usersChat, setUsersChat] = useState([]);

  const getUsers = async () => {
    const res = await getAllUsers();
    setUsersChat(res);
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="space-y-1.5">
      {usersChat.map((chat) => (
        <ChatItem
          key={chat._id}
          chat={chat}
          isSelected={selectedChatId === chat._id}
          onClick={() => setSelectedChatId(chat._id)}
        />
      ))}
    </div>
  );
};

export default ChatList;
