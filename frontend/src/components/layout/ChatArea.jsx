import React, { createContext, useContext, useState } from "react";
import ChatHeader from "../ui/ChatHeader";
import MessageList from "../ui/MessageList";
import MessageInput from "../ui/MessageInput";
import toast from "react-hot-toast";
import * as messageService from "../../services/messageService";

const SelectContext = createContext();

const useSelect = () => {
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error("useSelect must be used within ChatArea");
  }
  return context;
};

const ChatArea = ({ selected, isAISelected }) => {
  const [selectMode, setSelectMode] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [clearTrigger, setClearTrigger] = useState(0);
  
  const [aiMessages, setAiMessages] = useState([
    {
      _id: "ai-welcome",
      text: "Hello! I'm your AI Assistant. How can I help you today? 🤖",
      sender: "ai",
      createdAt: new Date().toISOString(),
      status: "sent"
    }
  ]);

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
    if (!selected?._id) return;
    await messageService.clearChat(selected._id);
    toast.success("Chat cleared!");
    setClearTrigger((prev) => prev + 1);
  };

  const handleDeleteSelected = async () => {
    try {
      if (selectedMessages.length === 0) return;

      for (const id of selectedMessages) {
        await messageService.deleteMessage(id);
      }

      toast.success(`${selectedMessages.length} messages deleted!`);
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
    enableSelectMode,
    disableSelectMode,
    toggleMessage,
    handleClearChat,
    handleDeleteSelected,
  };

  return (
    <main className="flex-1 min-w-0 bg-neutral-900/80 backdrop-blur-xl rounded-3xl shadow-xl border border-neutral-800 flex flex-col overflow-hidden">
      <SelectContext.Provider value={value}>
        <ChatHeader 
          selected={selected} 
          isAISelected={isAISelected}
        />
        <MessageList 
          selected={selected} 
          isAISelected={isAISelected}
          aiMessages={aiMessages}
        />
        <MessageInput 
          selected={selected} 
          isAISelected={isAISelected}
          setAiMessages={setAiMessages}
          aiMessages={aiMessages}
        />
      </SelectContext.Provider>
    </main>
  );
};

export default ChatArea;

export { useSelect };