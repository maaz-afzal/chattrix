import React from "react";
import LeftSidebar from "./LeftSidebar";
import ChatArea from "./ChatArea";

const MainLayout = () => {
  return (
    <div className="h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 flex overflow-hidden p-3 gap-3">
      <LeftSidebar />
      <ChatArea />
    </div>
  );
};

export default MainLayout;
