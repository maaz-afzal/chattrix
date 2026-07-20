import React, { useState } from "react";
import LeftSidebar from "./LeftSidebar";
import ChatArea from "./ChatArea";
import { useDispatch } from "react-redux";
import { setSelectedConversationId } from "../../redux/Slices/userSlice";

const MainLayout = () => {
  const dispatch = useDispatch();
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAISelected, setIsAISelected] = useState(false);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setIsAISelected(false);
    if (user?.conversationId) {
      dispatch(setSelectedConversationId(user.conversationId));
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