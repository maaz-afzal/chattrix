import React from "react";
import MessageBubble from "./MessageBubble";
import DateDivider from "./DateDivider";
import TypingIndicator from "./TypingIndicator";

const MessageList = () => {
  const messages = [
    {
      id: 1,
      text: "Hey! Working on the new design?",
      sender: "other",
      time: "10:30 AM",
      seen: true,
    },
    {
      id: 2,
      text: "Yes! Just finished the login page 🎉",
      sender: "me",
      time: "10:32 AM",
      seen: true,
    },
    {
      id: 3,
      text: "That's great! Can you show me?",
      sender: "other",
      time: "10:33 AM",
      seen: true,
    },
    {
      id: 4,
      text: "Sure! Let me share the preview",
      sender: "me",
      time: "10:35 AM",
      seen: false,
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto min-h-0 p-6 space-y-4">
      <DateDivider date="Today" />

      {messages.map((msg) => (
        <MessageBubble key={msg.id} {...msg} />
      ))}

      <TypingIndicator />
    </div>
  );
};

export default MessageList;
