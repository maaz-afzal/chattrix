import React from "react";
import ChatHeader from "../ui/ChatHeader";
import MessageList from "../ui/MessageList";
import MessageInput from "../ui/MessageInput";

const ChatArea = ({ selected }) => {
  return (
    <main className="flex-1 min-w-0 bg-gray-800/60 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-700/40 flex flex-col overflow-hidden">
      <ChatHeader selected={selected} />
      <MessageList selected={selected} />
      <MessageInput />
    </main>
  );
};

export default ChatArea;
