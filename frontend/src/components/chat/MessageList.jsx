import { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import MessageBubble from "./MessageBubble";
import { Bot } from "lucide-react";
import { useSelector } from "react-redux";
import messageService from "../../services/messageService.js";
import { getSocket } from "../../lib/socket.js";
import { useSelect } from "../layout/ChatArea";

const MessageList = ({ selected, isAISelected, aiMessages }) => {
  const currentUserId = useSelector((state) => state.auth.user?._id);
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const selectedRef = useRef(selected);
  const scrollRef = useRef(null);
  const nearBottomRef = useRef(true);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    nearBottomRef.current =
      el.scrollHeight - el.scrollTop - el.clientHeight < 150;
  };

  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);

  const { selectMode, toggleMessage, clearTrigger, sendTrigger } =
    useSelect();

  const getConversation = async (conversationId, initial = false) => {
    if (!conversationId) return;
    try {
      setError(null);
      if (initial) setLoading(true);
      const res = await messageService.getMessages(conversationId);
      setConversation(res);
    } catch (err) {
      console.error(err);
      setError("Failed to load messages.");
    } finally {
      setLoading(false);
    }
  };

  const prevSelectedIdRef = useRef(null);

  useEffect(() => {
    const convId = selected?.conversationId;
    const isSwitch = prevSelectedIdRef.current !== convId;
    prevSelectedIdRef.current = convId;
    if (isSwitch) {
      setConversation([]);
      nearBottomRef.current = true;
    }
    setError(null);
    if (convId) getConversation(convId, isSwitch);
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
      if (newMessage.sender?.toString() !== currentUserId?.toString()) {
        messageService.markAsRead(newMessage._id).catch(() => {});
        socket.emit("mark-delivered", {
          messageId: newMessage._id,
          senderId: newMessage.sender?.toString(),
        });
      }
      setConversation((prev) => {
        if (prev.some((msg) => msg._id === newMessage._id)) return prev;
        return [...prev, newMessage];
      });
    };
    const handleReconnect = () => {
      if (selectedRef.current?.conversationId)
        getConversation(selectedRef.current.conversationId);
    };
    const handleMessageRead = (messageId) => {
      setConversation((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, status: "read" } : msg,
        ),
      );
    };
    const handleMessageDelivered = (deliveredMessage) => {
      setConversation((prev) =>
        prev.map((msg) =>
          msg._id === deliveredMessage._id
            ? { ...msg, status: "delivered" }
            : msg,
        ),
      );
    };
    const handleMessagesRead = (convId) => {
      const cur = selectedRef.current;
      if (!cur?.conversationId) return;
      if (convId.toString() !== cur.conversationId.toString()) return;
      setConversation((prev) =>
        prev.map((msg) =>
          msg.sender?.toString() === currentUserId?.toString()
            ? { ...msg, status: "read" }
            : msg,
        ),
      );
    };
    const handleMessageUpdated = (updatedMessage) => {
      const cur = selectedRef.current;
      if (!cur?.conversationId) return;
      if (
        updatedMessage.conversationId?.toString() !==
        cur.conversationId.toString()
      )
        return;
      setConversation((prev) =>
        prev.map((msg) =>
          msg._id === updatedMessage._id
            ? {
                ...msg,
                ...updatedMessage,
                text:
                  updatedMessage.text ??
                  msg.text,
              }
            : msg,
        ),
      );
    };

    socket.on("receive-message", handleNewMessage);
    socket.on("message-sent", handleNewMessage);
    socket.on("message-read", handleMessageRead);
    socket.on("messages-read", handleMessagesRead);
    socket.on("message-delivered", handleMessageDelivered);
    socket.on("message-updated", handleMessageUpdated);
    socket.on("connect", handleReconnect);
    return () => {
      socket.off("receive-message", handleNewMessage);
      socket.off("message-sent", handleNewMessage);
      socket.off("message-read", handleMessageRead);
      socket.off("messages-read", handleMessagesRead);
      socket.off("message-delivered", handleMessageDelivered);
      socket.off("message-updated", handleMessageUpdated);
      socket.off("connect", handleReconnect);
    };
  }, [selected, currentUserId]);

  useEffect(() => {
    if (nearBottomRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversation, aiMessages]);

  if (isAISelected) {
    return (
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 min-h-0 overflow-y-auto bg-[#f7f7f8] dark:bg-[#161616]"
      >
        <div className="w-full max-w-6xl mx-auto px-5 py-6">
          {aiMessages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-14 h-14 rounded-2xl bg-[#A37CFF]/10 flex items-center justify-center mb-3">
                <Bot className="w-7 h-7 text-[#A37CFF]" />
              </div>
              <h3 className="text-[15px] font-semibold text-[#1a1a1b] dark:text-white">
                AI Assistant
              </h3>
              <p className="text-[12px] text-[#8a8a8c] dark:text-[#666] mt-1">Ask me anything</p>
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
                      : "bg-[#ececee] dark:bg-[#1D1E1F] text-[#1a1a1b] dark:text-[#ddd] rounded-bl-sm"
                  }`}
                >
                  {msg.sender === "user" ? (
                    <p className="text-[13px] leading-normal whitespace-pre-wrap wrap-break-words">
                      {msg.text}
                    </p>
                  ) : (
                    <div className="text-[13px] leading-normal wrap-break-words">
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
                            <code className="bg-[#ececee] dark:bg-[#161616] text-[#A37CFF] px-1.5 py-0.5 rounded text-[12px] font-mono">
                              {children}
                            </code>
                          ),
                          pre: ({ children }) => (
                            <pre className="bg-[#ececee] dark:bg-[#161616] border border-[#e2e2e4] dark:border-[#2E2E2F] p-3 rounded-xl overflow-x-auto my-2 text-[12px] font-mono">
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
                            <strong className="font-semibold text-[#1a1a1b] dark:text-white">
                              {children}
                            </strong>
                          ),
                          em: ({ children }) => (
                            <em className="italic text-[#5c5c5e] dark:text-[#bbb]">{children}</em>
                          ),
                          blockquote: ({ children }) => (
                            <blockquote className="border-l-2 border-[#A37CFF]/40 pl-3 my-2 text-[#6b6b6d] dark:text-[#aaa]">
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
                    className={`mt-1 text-right text-[10px] ${msg.sender === "user" ? "text-white/50" : "text-[#8a8a8c] dark:text-[#666]"}`}
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
      <div className="flex-1 flex items-center justify-center bg-[#f7f7f8] dark:bg-[#161616]">
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
      <div className="flex-1 flex flex-col items-center justify-center gap-3 bg-[#f7f7f8] dark:bg-[#161616]">
        <p className="text-[13px] text-[#f87171]">{error}</p>
        <button
          onClick={() => getConversation(selected.conversationId)}
          className="px-4 py-2 rounded-lg bg-[#ececee] dark:bg-[#1D1E1F] text-[13px] text-[#1a1a1b] dark:text-white hover:bg-[#e2e2e4] dark:hover:bg-[#2E2E2F] transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      className="flex-1 min-h-0 overflow-y-auto bg-[#f7f7f8] dark:bg-[#161616]"
    >
      <div className="max-w-6xl mx-auto px-5 py-5">
        {conversation.length === 0 ? (
          <p className="text-center py-8 text-[13px] text-[#9a9a9c] dark:text-[#555]">
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
