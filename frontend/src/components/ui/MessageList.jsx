import React, { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import MessageBubble from "./MessageBubble";
import { Bot } from "lucide-react";
import * as messageService from "../../services/messageService.js";
import { getSocket } from "../../lib/socket.js";
import { useSelect } from "../layout/ChatArea";

const MessageList = ({ selected, isAISelected, aiMessages }) => {
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const { selectMode, toggleMessage, clearTrigger } = useSelect();

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
  }, [selected, clearTrigger]);

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  // ✅ AI Mode - Different UI with Markdown support
  if (isAISelected) {
    return (
      <div className="flex-1 overflow-y-auto min-h-0 p-6">
        {/* AI Chat Header */}
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg mb-3">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-white text-xl font-semibold">AI Assistant</h3>
          <p className="text-neutral-400 text-sm">Powered by Gemini</p>
        </div>

        {/* AI Messages with Markdown */}
        <div className="space-y-4">
          {aiMessages.map((msg) => (
            <div
              key={msg._id}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                  msg.sender === "user"
                    ? "bg-indigo-600 text-white rounded-br-sm"
                    : "bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-bl-sm shadow-md"
                }`}
              >
                {msg.sender === "user" ? (
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                ) : (
                  // ✅ className on wrapper div, NOT on ReactMarkdown
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
                            className="underline text-blue-300 hover:text-blue-200"
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
                          <blockquote className="border-l-4 border-blue-400 pl-3 my-2 text-neutral-300">
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

  // ✅ No chat selected
  if (!selected) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-neutral-400 text-center">
          Select a chat to start messaging
        </p>
      </div>
    );
  }

  // ✅ Loading state
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex gap-1">
          <span
            className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <span
            className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <span
            className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    );
  }

  // ✅ Normal chat messages
  return (
    <div className="flex-1 overflow-y-auto min-h-0 p-6 space-y-4">
      {conversation.length === 0 ? (
        <div className="flex justify-center">
          <p className="text-neutral-500 text-sm">
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
