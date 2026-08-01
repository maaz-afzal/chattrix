import { useState } from "react";
import LeftSidebar from "./LeftSidebar";
import ChatArea from "./ChatArea";
import { useDispatch } from "react-redux";
import { setSelectedConversationId } from "../../redux/Slices/userSlice";

const MainLayout = () => {
  const dispatch = useDispatch();
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAISelected, setIsAISelected] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setIsAISelected(false);
    setShowChat(true);
    if (user?.conversationId) {
      dispatch(setSelectedConversationId(user.conversationId));
    }
  };

  const handleSelectAI = () => {
    setIsAISelected(true);
    setSelectedUser(null);
    setShowChat(true);
  };

  const handleBack = () => {
    setShowChat(false);
  };

  const handleDeleteConversation = (conversationId) => {
    if (selectedUser?.conversationId === conversationId) {
      setSelectedUser(null);
      setShowChat(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-[#f7f7f8] dark:bg-[#161616]">
      <div className="h-full w-full flex overflow-hidden">
        <div
          className={`${showChat ? "hidden lg:flex" : "flex"} w-full lg:w-auto lg:max-w-95 shrink-0`}
        >
          <LeftSidebar
            onSelected={handleSelectUser}
            onSelectAI={handleSelectAI}
            isAISelected={isAISelected}
            onDeleteConversation={handleDeleteConversation}
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
