import React, { useState } from "react";
import LeftSidebar from "./LeftSidebar";
import ChatArea from "./ChatArea";

const MainLayout = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  return (
    <div className="h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 flex overflow-hidden p-3 gap-3">
      <LeftSidebar onSelected={setSelectedUser} />
      <ChatArea selected={selectedUser} />
    </div>
  );
};

export default MainLayout;
