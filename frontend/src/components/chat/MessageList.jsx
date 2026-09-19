import { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import MessageBubble from "./MessageBubble";
import { Bot, RefreshCw } from "lucide-react";
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
  const prevSelectedIdRef = useRef(null);

  const {
    selectMode,
    toggleMessage,
    clearTrigger,
    sendTrigger,
    handleReply,
    handleDelete,
  } = useSelect();

  const handleScroll = () => {
    const el = scrollRef.current;

    if (!el) return;

    nearBottomRef.current =
      el.scrollHeight - el.scrollTop - el.clientHeight < 150;
  };

  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);

  const getConversation = async (conversationId, initial = false) => {
    if (!conversationId) return;

    try {
      setError(null);

      if (initial) {
        setLoading(true);
      }

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
    const convId = selected?.conversationId;
    const isSwitch = prevSelectedIdRef.current !== convId;

    prevSelectedIdRef.current = convId;

    if (isSwitch) {
      setConversation([]);
      nearBottomRef.current = true;
    }

    setError(null);

    if (convId) {
      getConversation(convId, isSwitch);
    }
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
      ) {
        return;
      }

      if (newMessage.sender?.toString() !== currentUserId?.toString()) {
        messageService.markAsRead(newMessage._id).catch(() => {});

        socket.emit("mark-delivered", {
          messageId: newMessage._id,
          senderId: newMessage.sender?.toString(),
        });
      }

      setConversation((prev) => {
        if (prev.some((msg) => msg._id === newMessage._id)) {
          return prev;
        }

        return [...prev, newMessage];
      });
    };

    const handleReconnect = () => {
      if (selectedRef.current?.conversationId) {
        getConversation(selectedRef.current.conversationId);
      }
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

      if (convId.toString() !== cur.conversationId.toString()) {
        return;
      }

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
      ) {
        return;
      }

      setConversation((prev) =>
        prev.map((msg) =>
          msg._id === updatedMessage._id
            ? {
                ...msg,
                ...updatedMessage,
                text: updatedMessage.text ?? msg.text,
              }
            : msg,
        ),
      );
    };

    const handleMessageDeleted = (data) => {
      const { messageId } = data;

      setConversation((prev) => prev.filter((msg) => msg._id !== messageId));
    };

    socket.on("receive-message", handleNewMessage);

    socket.on("message-sent", handleNewMessage);

    socket.on("message-read", handleMessageRead);

    socket.on("messages-read", handleMessagesRead);

    socket.on("message-delivered", handleMessageDelivered);

    socket.on("message-updated", handleMessageUpdated);

    socket.on("message-deleted", handleMessageDeleted);

    socket.on("connect", handleReconnect);

    return () => {
      socket.off("receive-message", handleNewMessage);

      socket.off("message-sent", handleNewMessage);

      socket.off("message-read", handleMessageRead);

      socket.off("messages-read", handleMessagesRead);

      socket.off("message-delivered", handleMessageDelivered);

      socket.off("message-updated", handleMessageUpdated);

      socket.off("message-deleted", handleMessageDeleted);

      socket.off("connect", handleReconnect);
    };
  }, [selected, currentUserId]);

  useEffect(() => {
    if (nearBottomRef.current) {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [conversation, aiMessages]);

  if (isAISelected) {
    return (
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 min-h-0 overflow-y-auto bg-[#f7f7f8] dark:bg-[#161616] scrollbar-thin scrollbar-thumb-[#d4d4d7] dark:scrollbar-thumb-[#363638] scrollbar-track-transparent"
      >
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {aiMessages.length === 0 && (
            <div className="min-h-110 flex flex-col items-center justify-center text-center">
              <div className="relative w-18 h-18 mb-5 flex items-center justify-center">
                <div className="absolute inset-0 rounded-3xl bg-[#7342e6]/8 dark:bg-[#7342e6]/12 border border-[#7342e6]/10 dark:border-[#7342e6]/15" />

                <div className="relative w-12 h-12 rounded-[17px] bg-linear-to-br from-[#8254ed] to-[#6335d2] flex items-center justify-center">
                  <Bot className="w-6.25 h-6.25 text-white" strokeWidth={1.7} />
                </div>
              </div>

              <h3 className="text-[21px] font-semibold tracking-tight text-[#18181a] dark:text-[#f2f2f3]">
                AI Assistant
              </h3>

              <p className="text-[13px] text-[#8b8b8f] dark:text-[#77777b] mt-1.5">
                Ask me anything
              </p>
            </div>
          )}

          <div className="space-y-3.5">
            {aiMessages.map((msg) => (
              <div
                key={msg._id}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[88%] sm:max-w-[75%] ${
                    msg.sender === "user"
                      ? "bg-[#144D37] text-white rounded-[19px] rounded-br-md"
                      : "bg-white dark:bg-[#1d1d1f] border border-[#e5e5e7] dark:border-[#29292b] text-[#1a1a1b] dark:text-[#dddddf] rounded-[19px] rounded-bl-md"
                  }`}
                >
                  <div className="px-4 py-3">
                    {msg.sender === "user" ? (
                      <p className="text-[13px] leading-[1.6] whitespace-pre-wrap wrap-break-words">
                        {msg.text}
                      </p>
                    ) : (
                      <div className="text-[13px] leading-[1.65] wrap-break-words">
                        <ReactMarkdown
                          components={{
                            h1: ({ children }) => (
                              <h1 className="text-[17px] font-semibold tracking-tight mb-2.5">
                                {children}
                              </h1>
                            ),
                            h2: ({ children }) => (
                              <h2 className="text-[16px] font-semibold tracking-tight mb-2">
                                {children}
                              </h2>
                            ),
                            h3: ({ children }) => (
                              <h3 className="text-[14px] font-semibold mb-1.5">
                                {children}
                              </h3>
                            ),
                            p: ({ children }) => (
                              <p className="mb-2.5 last:mb-0">{children}</p>
                            ),
                            ul: ({ children }) => (
                              <ul className="list-disc ml-4 my-2.5 space-y-1">
                                {children}
                              </ul>
                            ),
                            ol: ({ children }) => (
                              <ol className="list-decimal ml-4 my-2.5 space-y-1">
                                {children}
                              </ol>
                            ),
                            li: ({ children }) => (
                              <li className="pl-0.5">{children}</li>
                            ),
                            code: ({ children }) => (
                              <code className="bg-[#f1f1f3] dark:bg-[#151517] border border-[#e2e2e4] dark:border-[#29292b] text-[#7342e6] px-1.5 py-0.5 rounded-md text-[11.5px] font-mono">
                                {children}
                              </code>
                            ),
                            pre: ({ children }) => (
                              <pre className="bg-[#f1f1f3] dark:bg-[#151517] border border-[#e2e2e4] dark:border-[#2e2e30] p-3.5 rounded-xl overflow-x-auto my-3 text-[11.5px] leading-relaxed font-mono">
                                {children}
                              </pre>
                            ),
                            a: ({ href, children }) => (
                              <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#7342e6] hover:text-[#6335d2] underline underline-offset-2"
                              >
                                {children}
                              </a>
                            ),
                            strong: ({ children }) => (
                              <strong className="font-semibold text-[#171719] dark:text-white">
                                {children}
                              </strong>
                            ),
                            em: ({ children }) => (
                              <em className="italic text-[#5c5c5f] dark:text-[#bcbcc0]">
                                {children}
                              </em>
                            ),
                            blockquote: ({ children }) => (
                              <blockquote className="border-l-2 border-[#7342e6]/50 pl-3 my-2.5 text-[#6b6b6e] dark:text-[#aaa]">
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
                      className={`mt-2 text-right text-[9.5px] leading-none ${
                        msg.sender === "user"
                          ? "text-white/45"
                          : "text-[#99999c] dark:text-[#66666a]"
                      }`}
                    >
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
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
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-[#7342e6] animate-bounce"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#f7f7f8] dark:bg-[#161616]">
        <div className="flex flex-col items-center text-center">
          <div className="w-11 h-11 rounded-[15px] bg-[#ef4444]/10 border border-[#ef4444]/15 flex items-center justify-center mb-3">
            <RefreshCw
              className="w-4.5 h-4.5 text-[#ef4444]"
              strokeWidth={1.8}
            />
          </div>

          <p className="text-[13px] text-[#ef4444] mb-3">{error}</p>

          <button
            onClick={() => getConversation(selected.conversationId)}
            className="h-8 px-3.5 rounded-lg bg-white dark:bg-[#1d1d1f] border border-[#dfdfe1] dark:border-[#303032] text-[12px] font-medium text-[#333337] dark:text-[#dddddf] hover:bg-[#f1f1f3] dark:hover:bg-[#242426] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      className="flex-1 min-h-0 overflow-y-auto bg-[#f7f7f8] dark:bg-[#161616] scrollbar-thin scrollbar-thumb-[#d4d4d7] dark:scrollbar-thumb-[#363638] scrollbar-track-transparent"
    >
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {conversation.length === 0 ? (
          <div className="h-full min-h-105 flex items-center justify-center">
            <div className="text-center">
              <div className="relative w-14 h-14 mx-auto mb-4 flex items-center justify-center">
                <div className="absolute inset-0 rounded-[19px] bg-[#7342e6]/8 dark:bg-[#7342e6]/12 border border-[#7342e6]/10 dark:border-[#7342e6]/15" />

                <div className="relative w-7 h-7 rounded-[10px] bg-[#7342e6] flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-white" />
                </div>
              </div>

              <p className="text-[16px] font-semibold text-[#242426] dark:text-[#ededee] tracking-[-0.015em]">
                No messages yet
              </p>

              <p className="text-[12.5px] text-[#929296] dark:text-[#707074] mt-1.5">
                Say hello to start the conversation
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            {conversation.map((msg) => (
              <MessageBubble
                key={msg._id}
                {...msg}
                isSelectMode={selectMode}
                onSelect={() => toggleMessage(msg._id)}
                onReply={handleReply}
                onDelete={handleDelete}
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
