import React from "react";
import ChatHeader from "../ui/ChatHeader";
import MessageList from "../ui/MessageList";
import MessageInput from "../ui/MessageInput";

const ChatArea = ({ selected }) => {
  return (
    <main className="flex-1 min-w-0 bg-neutral-900/80 backdrop-blur-xl rounded-3xl shadow-xl border border-neutral-800 flex flex-col overflow-hidden">
      <ChatHeader selected={selected} />
      <MessageList selected={selected} />
      <MessageInput selected={selected} />
    </main>
  );
};

export default ChatArea;