import React, { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import MessageBubble from "./MessageBubble";
import { Bot } from "lucide-react";
import { useSelector } from "react-redux";
import * as messageService from "../../services/messageService.js";
import { getSocket } from "../../lib/socket.js";
import { useSelect } from "../layout/ChatArea";

const MessageList = ({ selected, isAISelected, aiMessages }) => {
  const currentUserId = useSelector((state) => state.auth.user?._id);
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const selectedRef = useRef(selected);
  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);

  const { selectMode, toggleMessage, clearTrigger, sendTrigger } = useSelect();

  const getConversation = async (conversationId) => {
    if (!conversationId) return;
    try {
      setLoading(true);
      setError(null);
      const res = await messageService.getMessages(conversationId);
      setConversation(res);
    } catch (err) {
      console.error("Error fetching conversation:", err);
      setError("Failed to load messages. Tap to retry.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setConversation([]);
    setError(null);
    if (selected?.conversationId) {
      getConversation(selected.conversationId);
    }
  }, [selected, clearTrigger, sendTrigger]);

  useEffect(() => {
    if (!selected?.conversationId) return;

    const socket = getSocket();
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      const currentSelected = selectedRef.current;
      if (!currentSelected?.conversationId) return;

      const isRelevant =
        newMessage.conversationId?.toString() === currentSelected.conversationId.toString();

      if (!isRelevant) return;

      const isFromOther = newMessage.sender?.toString() !== currentUserId?.toString();
      if (isFromOther) {
        messageService.markAsRead(newMessage._id).catch(() => {});
      }

      setConversation((prev) => {
        const exists = prev.some((msg) => msg._id === newMessage._id);
        if (exists) return prev;
        return [...prev, newMessage];
      });
    };

    const handleReconnect = () => {
      if (selectedRef.current?.conversationId) {
        getConversation(selectedRef.current.conversationId);
      }
    };

    socket.on("receive-message", handleNewMessage);
    socket.on("message-sent", handleNewMessage);
    socket.on("connect", handleReconnect);

    return () => {
      socket.off("receive-message", handleNewMessage);
      socket.off("message-sent", handleNewMessage);
      socket.off("connect", handleReconnect);
    };
  }, [selected]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation, aiMessages]);

  if (isAISelected) {
    return (
      <div className="flex-1 overflow-y-auto min-h-0 p-6">
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="w-16 h-16 bg-cyan-500/10 rounded-full border border-cyan-400/40 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.2)] mb-3">
            <Bot className="w-8 h-8 text-cyan-400" />
          </div>
          <h3 className="text-white text-xl font-semibold">AI Assistant</h3>
          <p className="text-gray-400 text-sm">Powered by Gemini</p>
        </div>

        <div className="space-y-4">
          {aiMessages.map((msg) => (
            <div
              key={msg._id}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 border ${
                  msg.sender === "user"
                    ? "bg-cyan-500/10 text-cyan-100 rounded-br-sm border-cyan-500/20 shadow-[0_0_10px_rgba(34,211,238,0.1)]"
                    : "bg-cyan-500/10 text-cyan-100 rounded-bl-sm border-cyan-400/30 shadow-[0_0_15px_rgba(34,211,238,0.15)]"
                }`}
              >
                {msg.sender === "user" ? (
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                ) : (
                  <div className="text-sm prose prose-invert max-w-none">
                    <ReactMarkdown
                      components={{
                        h1: ({ children }) => (
                          <h1 className="text-xl font-bold mb-2">{children}</h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="text-lg font-bold mb-2">{children}</h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-base font-bold mb-1">
                            {children}
                          </h3>
                        ),
                        p: ({ children }) => <p className="mb-1">{children}</p>,
                        ul: ({ children }) => (
                          <ul className="list-disc ml-4 my-2 space-y-1">
                            {children}
                          </ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="list-decimal ml-4 my-2 space-y-1">
                            {children}
                          </ol>
                        ),
                        li: ({ children }) => (
                          <li className="mb-1">{children}</li>
                        ),
                        code: ({ children }) => (
                          <code className="bg-black/30 px-1.5 py-0.5 rounded text-sm font-mono">
                            {children}
                          </code>
                        ),
                        pre: ({ children }) => (
                          <pre className="bg-black/30 p-3 rounded-lg overflow-x-auto my-2 text-sm font-mono">
                            {children}
                          </pre>
                        ),
                        a: ({ href, children }) => (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline text-cyan-300 hover:text-cyan-200"
                          >
                            {children}
                          </a>
                        ),
                        strong: ({ children }) => (
                          <strong className="font-bold">{children}</strong>
                        ),
                        em: ({ children }) => (
                          <em className="italic">{children}</em>
                        ),
                        blockquote: ({ children }) => (
                          <blockquote className="border-l-4 border-cyan-400 pl-3 my-2 text-gray-300">
                            {children}
                          </blockquote>
                        ),
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>
                  </div>
                )}
                <p className="text-xs opacity-70 mt-1">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
    );
  }

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
            className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce shadow-[0_0_6px_rgba(34,211,238,0.5)]"
            style={{ animationDelay: "0ms" }}
          />
          <span
            className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce shadow-[0_0_6px_rgba(34,211,238,0.5)]"
            style={{ animationDelay: "150ms" }}
          />
          <span
            className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce shadow-[0_0_6px_rgba(34,211,238,0.5)]"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3">
        <p className="text-red-400 text-sm">{error}</p>
        <button
          onClick={() => getConversation(selected.conversationId)}
          className="px-4 py-2 bg-cyan-500/10 border border-cyan-400/30 hover:bg-cyan-500/20 text-cyan-400 text-sm rounded-xl"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto min-h-0 p-6 space-y-4">
      {conversation.length === 0 ? (
        <div className="flex justify-center">
          <p className="text-gray-500 text-sm">
            No messages yet. Start a conversation!
          </p>
        </div>
      ) : (
        <>
          {conversation.map((msg) => (
            <MessageBubble
              key={msg._id}
              {...msg}
              isSelectMode={selectMode}
              onSelect={() => toggleMessage(msg._id)}
            />
          ))}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
};

export default MessageList;
