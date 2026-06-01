import React from "react";
import ChatHeader from "../ui/ChatHeader";
import MessageList from "../ui/MessageList";
import MessageInput from "../ui/MessageInput";

const ChatArea = () => {
  const selectedChat = {
    id: 1,
    name: "Sarah Wilson",
    avatar: "SW",
    online: true,
    gradient: "from-pink-500 to-rose-500",
  };

  return (
    <main className="flex-1 min-w-0 bg-gray-800/60 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-700/40 flex flex-col overflow-hidden">
      <ChatHeader chat={selectedChat} />
      <MessageList />
      <MessageInput />
    </main>
  );
};

export default ChatArea;
