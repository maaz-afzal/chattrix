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
      console.error(err);
      setError("Failed to load messages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setConversation([]);
    setError(null);
    if (selected?.conversationId) getConversation(selected.conversationId);
  }, [selected, clearTrigger, sendTrigger]);

  useEffect(() => {
    if (!selected?.conversationId) return;
    const socket = getSocket();
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      const cur = selectedRef.current;
      if (!cur?.conversationId) return;
      if (
        newMessage.conversationId?.toString() !== cur.conversationId.toString()
      )
        return;
      if (newMessage.sender?.toString() !== currentUserId?.toString())
        messageService.markAsRead(newMessage._id).catch(() => {});
      setConversation((prev) => {
        if (prev.some((msg) => msg._id === newMessage._id)) return prev;
        return [...prev, newMessage];
      });
    };
    const handleReconnect = () => {
      if (selectedRef.current?.conversationId)
        getConversation(selectedRef.current.conversationId);
    };

    socket.on("receive-message", handleNewMessage);
    socket.on("message-sent", handleNewMessage);
    socket.on("connect", handleReconnect);
    return () => {
      socket.off("receive-message", handleNewMessage);
      socket.off("message-sent", handleNewMessage);
      socket.off("connect", handleReconnect);
    };
  }, [selected, currentUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation, aiMessages]);

  if (isAISelected) {
    return (
      <div className="flex-1 min-h-0 overflow-y-auto bg-[#161616]">
        <div className="w-full max-w-[700px] mx-auto px-5 py-6">
          {aiMessages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-14 h-14 rounded-2xl bg-[#A37CFF]/10 flex items-center justify-center mb-3">
                <Bot className="w-7 h-7 text-[#A37CFF]" />
              </div>
              <h3 className="text-[15px] font-semibold text-white">
                AI Assistant
              </h3>
              <p className="text-[12px] text-[#666] mt-1">Ask me anything</p>
            </div>
          )}

          <div className="space-y-3">
            {aiMessages.map((msg) => (
              <div
                key={msg._id}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[82%] sm:max-w-[72%] rounded-2xl px-3 py-2 ${
                    msg.sender === "user"
                      ? "bg-[#144D37] text-white rounded-br-sm"
                      : "bg-[#1D1E1F] text-[#ddd] rounded-bl-sm"
                  }`}
                >
                  {msg.sender === "user" ? (
                    <p className="text-[13px] leading-[1.5] whitespace-pre-wrap break-words">
                      {msg.text}
                    </p>
                  ) : (
                    <div className="text-[13px] leading-[1.5] break-words">
                      <ReactMarkdown
                        components={{
                          h1: ({ children }) => (
                            <h1 className="text-[16px] font-semibold mb-2">
                              {children}
                            </h1>
                          ),
                          h2: ({ children }) => (
                            <h2 className="text-[15px] font-semibold mb-2">
                              {children}
                            </h2>
                          ),
                          h3: ({ children }) => (
                            <h3 className="text-[14px] font-semibold mb-1">
                              {children}
                            </h3>
                          ),
                          p: ({ children }) => (
                            <p className="mb-2 last:mb-0">{children}</p>
                          ),
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
                          li: ({ children }) => <li>{children}</li>,
                          code: ({ children }) => (
                            <code className="bg-[#161616] text-[#A37CFF] px-1.5 py-0.5 rounded text-[12px] font-mono">
                              {children}
                            </code>
                          ),
                          pre: ({ children }) => (
                            <pre className="bg-[#161616] border border-[#2E2E2F] p-3 rounded-xl overflow-x-auto my-2 text-[12px] font-mono">
                              {children}
                            </pre>
                          ),
                          a: ({ href, children }) => (
                            <a
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#A37CFF] underline"
                            >
                              {children}
                            </a>
                          ),
                          strong: ({ children }) => (
                            <strong className="font-semibold text-white">
                              {children}
                            </strong>
                          ),
                          em: ({ children }) => (
                            <em className="italic text-[#bbb]">{children}</em>
                          ),
                          blockquote: ({ children }) => (
                            <blockquote className="border-l-2 border-[#A37CFF]/40 pl-3 my-2 text-[#aaa]">
                              {children}
                            </blockquote>
                          ),
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                  )}
                  <p
                    className={`mt-1 text-right text-[10px] ${msg.sender === "user" ? "text-white/50" : "text-[#666]"}`}
                  >
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
      </div>
    );
  }

  if (!selected) return null;

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#161616]">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-[#A37CFF] animate-bounce"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 bg-[#161616]">
        <p className="text-[13px] text-[#f87171]">{error}</p>
        <button
          onClick={() => getConversation(selected.conversationId)}
          className="px-4 py-2 rounded-lg bg-[#1D1E1F] text-[13px] text-white hover:bg-[#2E2E2F] transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 overflow-y-auto bg-[#161616]">
      <div className="max-w-[700px] mx-auto px-5 py-5">
        {conversation.length === 0 ? (
          <p className="text-center py-8 text-[13px] text-[#555]">
            No messages yet. Say hello!
          </p>
        ) : (
          <div className="space-y-2.5">
            {conversation.map((msg) => (
              <MessageBubble
                key={msg._id}
                {...msg}
                isSelectMode={selectMode}
                onSelect={() => toggleMessage(msg._id)}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageList;
