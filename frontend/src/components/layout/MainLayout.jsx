import React, { useState } from "react";
import LeftSidebar from "./LeftSidebar";
import ChatArea from "./ChatArea";
import { useDispatch } from "react-redux";
import { setSelectedConversationId } from "../../redux/Slices/userSlice";
import aiService from "../../services/aiService";

const MainLayout = () => {
  const dispatch = useDispatch();
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAISelected, setIsAISelected] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [aiConversation, setAiConversation] = useState([]);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setIsAISelected(false);
    setShowChat(true);
    if (user?.conversationId) {
      dispatch(setSelectedConversationId(user.conversationId));
    }
  };

  const handleSelectAI = async () => {
    setIsAISelected(true);
    setSelectedUser(null);
    setShowChat(true);
    const res = await aiService.createAIConversation();
    console.log(res)
    setAiConversation(res);
  };

  const handleBack = () => {
    setShowChat(false);
  };

  return (
    <div className="h-screen overflow-hidden bg-[#161616]">
      <div className="h-full w-full flex overflow-hidden">
        <div
          className={`${showChat ? "hidden lg:flex" : "flex"} w-full lg:w-auto lg:max-w-95 shrink-0`}
        >
          <LeftSidebar
            onSelected={handleSelectUser}
            onSelectAI={handleSelectAI}
            isAISelected={isAISelected}
          />
        </div>

        <div
          className={`${showChat ? "flex" : "hidden lg:flex"} flex-1 min-w-0`}
        >
          <ChatArea
            selected={selectedUser}
            isAISelected={isAISelected}
            onBack={handleBack}
            showChat={showChat}
          />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
