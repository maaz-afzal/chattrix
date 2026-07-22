import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { formatLastSeen } from "../../utils/formatLastSeen.js";
import { getSocket } from "../../lib/socket.js";
import PersonalInfoSection from "./components/PersonalInfoSection.jsx";
import SecuritySection from "./components/SecuritySection.jsx";
import AppearanceSection from "./components/AppearanceSection.jsx";
import AccountSection from "./components/AccountSection.jsx";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const onlineUsers = useSelector((state) => state.users.onlineUsers);
  const lastSeenByUser = useSelector((state) => state.users.lastSeenByUser);
  const socket = getSocket();

  const isOnline =
    onlineUsers.includes(user?._id) || user?.isOnline || socket?.connected;
  const lastSeen = lastSeenByUser[user?._id];

  return (
    <div className="min-h-screen bg-[#161616] text-white">
      <div className="sticky top-0 z-20 border-b border-[#2E2E2F] bg-[#161616]/95 backdrop-blur-md">
        <div className="max-w-2xl mx-auto h-14 px-5 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="p-2 rounded-lg hover:bg-[#1D1E1F] transition-colors"
          >
            <ArrowLeft className="w-4.5 h-4.5 text-[#999]" />
          </button>
          <h1 className="text-[14px] font-semibold text-white">Settings</h1>
          <div className="w-8" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 py-6 space-y-4">
        <PersonalInfoSection
          user={user}
          isOnline={isOnline}
          lastSeen={lastSeen}
          formatLastSeen={formatLastSeen}
        />

        <AppearanceSection />

        <SecuritySection />

        <AccountSection />

        <div className="h-4" />
      </div>
    </div>
  );
};

export default ProfilePage;
