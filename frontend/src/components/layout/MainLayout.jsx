import React, { useState } from "react";
import LeftSidebar from "./LeftSidebar";
import ChatArea from "./ChatArea";
import { useDispatch } from "react-redux";
import { setSelectedConversationId } from "../../redux/Slices/userSlice";
import { findOrCreateConversation } from "../../services/messageService";
import toast from "react-hot-toast";

const MainLayout = () => {
  const dispatch = useDispatch();
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAISelected, setIsAISelected] = useState(false);

  const handleSelectUser = async (user) => {
    setSelectedUser(user);
    setIsAISelected(false);
    try {
      const res = await findOrCreateConversation(user._id);
      dispatch(setSelectedConversationId(res.conversation._id));
    } catch {
      toast.error("Failed to open conversation");
    }
  };

  const handleSelectAI = () => {
    setIsAISelected(true);
    setSelectedUser(null);
  };

  return (
    <div className="h-screen bg-black flex overflow-hidden ">
      <LeftSidebar 
        onSelected={handleSelectUser}
        onSelectAI={handleSelectAI}
        isAISelected={isAISelected}
      />
      <ChatArea 
        selected={selectedUser} 
        isAISelected={isAISelected}
      />
    </div>
  );
};

export default MainLayout;