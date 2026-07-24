import React, { createContext, useContext, useState, useEffect } from "react";
import ChatHeader from "../chat/ChatHeader";
import MessageList from "../chat/MessageList";
import MessageInput from "../chat/MessageInput";
import toast from "react-hot-toast";
import * as messageService from "../../services/messageService";
import aiService from "../../services/aiService.js";

const SelectContext = createContext();

const useSelect = () => {
  const context = useContext(SelectContext);
  if (!context) throw new Error("useSelect must be used within ChatArea");
  return context;
};

const ChatArea = ({ selected, isAISelected, onBack }) => {
  const [selectMode, setSelectMode] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [clearTrigger, setClearTrigger] = useState(0);
  const [sendTrigger, setSendTrigger] = useState(0);
  const [aiMessages, setAiMessages] = useState([]);
  const [aiConversationId, setAiConversationId] = useState(null);

  useEffect(() => {
    if (!isAISelected) {
      setAiConversationId(null);
      return;
    }
    aiService.createAIConversation().then((data) => {
      const convId = data.conversation?._id || data._id;
      setAiConversationId(convId);
    }).catch(() => toast.error("Failed to start AI chat"));
  }, [isAISelected]);

  useEffect(() => {
    if (!aiConversationId) return;
    aiService.getAIHistory(aiConversationId).then((messages) => {
      setAiMessages(
        (messages || []).map((msg) => ({
          _id: msg._id,
          text: msg.text,
          sender: msg.senderType === "ai" ? "ai" : "user",
          createdAt: msg.createdAt,
          status: "sent",
        })),
      );
    }).catch(() => {});
  }, [aiConversationId]);

  const enableSelectMode = () => {
    setSelectMode(true);
    setSelectedMessages([]);
  };
  const disableSelectMode = () => {
    setSelectMode(false);
    setSelectedMessages([]);
  };

  const toggleMessage = (msgId) => {
    setSelectedMessages((prev) =>
      prev.includes(msgId)
        ? prev.filter((id) => id !== msgId)
        : [...prev, msgId],
    );
  };

  const handleClearChat = async () => {
    if (isAISelected) {
      if (aiConversationId) {
        await aiService.clearAIHistory(aiConversationId).catch(() => {});
      }
      setAiMessages([]);
      toast.success("AI chat cleared!");
      return;
    }
    if (!selected?.conversationId) return;
    try {
      await messageService.clearChat(selected.conversationId);
      toast.success("Chat cleared!");
      setClearTrigger((prev) => prev + 1);
    } catch {
      toast.error("Failed to clear chat.");
    }
  };

  const handleDeleteSelected = async () => {
    try {
      if (selectedMessages.length === 0) return;
      for (const id of selectedMessages) await messageService.deleteMessage(id);
      toast.success(
        `${selectedMessages.length} message${selectedMessages.length > 1 ? "s" : ""} deleted!`,
      );
      setClearTrigger((prev) => prev + 1);
      disableSelectMode();
    } catch (error) {
      console.error("Error deleting messages:", error);
      toast.error("Failed to delete messages.");
    }
  };

  const value = {
    selectMode,
    selectedMessages,
    clearTrigger,
    sendTrigger,
    setSendTrigger,
    enableSelectMode,
    disableSelectMode,
    toggleMessage,
    handleClearChat,
    handleDeleteSelected,
  };

  return (
    <main className="flex-1 min-w-0 flex flex-col overflow-hidden bg-[#161616]">
      <SelectContext.Provider value={value}>
        <ChatHeader
          selected={selected}
          isAISelected={isAISelected}
          onBack={onBack}
        />
        <div className="flex-1 min-h-0">
          <MessageList
            selected={selected}
            isAISelected={isAISelected}
            aiMessages={aiMessages}
          />
        </div>
        <MessageInput
          selected={selected}
          isAISelected={isAISelected}
          setAiMessages={setAiMessages}
          aiMessages={aiMessages}
          aiConversationId={aiConversationId}
        />
      </SelectContext.Provider>
    </main>
  );
};

export default ChatArea;
export { useSelect };
