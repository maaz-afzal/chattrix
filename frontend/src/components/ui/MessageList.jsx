import React, { useEffect, useState } from "react";
import MessageBubble from "./MessageBubble";
import DateDivider from "./DateDivider";
import TypingIndicator from "./TypingIndicator";
import * as messageService from "../../services/messageService.js";
import { getSocket } from "../../lib/socket.js";

const MessageList = ({ selected }) => {
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);

  const getConversation = async (userId) => {
    if (!userId) return;

    try {
      setLoading(true);
      const res = await messageService.getConversation(userId);
      setConversation(res);
    } catch (error) {
      console.error("Error fetching conversation:", error);
      setConversation([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setConversation([]);
    if (selected?._id) {
      getConversation(selected._id);
    }
  }, [selected]);

  useEffect(() => {
    if (!selected?._id) return;

    const socket = getSocket();
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      if (
        newMessage.sender === selected._id ||
        newMessage.receiver === selected._id
      ) {
        setConversation((prev) => {
          const exists = prev.some((msg) => msg._id === newMessage._id);
          if (exists) return prev;
          return [...prev, newMessage];
        });
      }
    };

    socket.on("receive-message", handleNewMessage);
    socket.on("message-sent", handleNewMessage);

    return () => {
      socket.off("receive-message", handleNewMessage);
      socket.off("message-sent", handleNewMessage);
    };
  }, [selected]);

  if (!selected) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-400 text-center">
          Select a chat to start messaging
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex gap-1">
          <span
            className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <span
            className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <span
            className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto min-h-0 p-6 space-y-4">
      <DateDivider date="Today" />

      {conversation.length === 0 ? (
        <div className="flex justify-center">
          <p className="text-gray-500 text-sm">
            No messages yet. Start a conversation!
          </p>
        </div>
      ) : (
        conversation.map((msg) => <MessageBubble key={msg._id} {...msg} />)
      )}

      <TypingIndicator />
    </div>
  );
};

export default MessageList;
