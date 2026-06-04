import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { X, LogOut } from "lucide-react";
import { logout } from "../../redux/Slices/authSlice";
import { disconnectSocket } from "../../lib/socket.js";

const UserProfileModal = ({ isOpen, onClose, user }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogout = () => {
    disconnectSocket();
    dispatch(logout());
    onClose();
    navigate("/login");
  };

  const avatarLetter = user?.name?.charAt(0).toUpperCase() || "U";
  const isOnline = user?.status === "online";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-gray-800/95 rounded-2xl w-full max-w-md mx-4 shadow-2xl border border-gray-700">
        {/* header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-white font-semibold text-lg">Profile</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* profile */}
        <div className="p-6">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-24 h-24 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-3xl">
                  {avatarLetter}
                </span>
              </div>
              {isOnline && (
                <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800" />
              )}
            </div>
          </div>

          <div className="text-center mb-6">
            <h3 className="text-white font-semibold text-xl">
              {user?.name || "User"}
            </h3>
            <p className="text-gray-400 text-sm mt-1">
              {user?.email || "user@example.com"}
            </p>
            <div className="flex items-center justify-center gap-1 mt-2">
              <span
                className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-500" : "bg-gray-500"}`}
              />
              <span className="text-gray-500 text-xs">
                {isOnline ? "Online" : "Offline"}
              </span>
            </div>
          </div>

          <div className="mb-6 p-3 bg-gray-700/50 rounded-xl">
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">
              Bio
            </p>
            <p className="text-gray-300 text-sm">{user?.bio || "No bio yet"}</p>
          </div>

          <div className="border-t border-gray-700 pt-4">
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-3">
              Account
            </p>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-xl transition text-red-400 font-medium"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
