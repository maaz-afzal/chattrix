import React, { useState } from "react";
import ChatItem from "./ChatItem";

const ChatList = () => {
  const [selectedChatId, setSelectedChatId] = useState(1);

  const chats = [
    {
      id: 1,
      name: "Sarah Wilson",
      avatar: "SW",
      lastMessage: "That's perfect! 🎨",
      time: "10:35",
      unread: 2,
      online: true,
      active: true,
      gradient: "from-pink-500 to-rose-500",
    },
    {
      id: 2,
      name: "Tech Team",
      avatar: "TT",
      lastMessage: "Alex: Deployment scheduled",
      time: "09:20",
      unread: 3,
      online: true,
      isGroup: true,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      id: 3,
      name: "Mike Johnson",
      avatar: "MJ",
      lastMessage: "See you tomorrow at 10",
      time: "Yesterday",
      unread: 0,
      online: true,
      gradient: "from-green-500 to-emerald-500",
    },
    {
      id: 4,
      name: "Design Guild",
      avatar: "DG",
      lastMessage: "Emma: New mockups ready",
      time: "Yesterday",
      unread: 5,
      online: false,
      isGroup: true,
      gradient: "from-purple-500 to-fuchsia-500",
    },
    {
      id: 5,
      name: "Lisa Anderson",
      avatar: "LA",
      lastMessage: "Thanks for your help!",
      time: "Monday",
      unread: 0,
      online: false,
      gradient: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="space-y-1.5">
      {chats.map((chat) => (
        <ChatItem
          key={chat.id}
          chat={chat}
          isSelected={selectedChatId === chat.id}
          onClick={() => setSelectedChatId(chat.id)}
        />
      ))}
    </div>
  );
};

export default ChatList;
