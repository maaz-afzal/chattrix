import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout, updateUser } from "../redux/Slices/authSlice.js";
import * as userService from "../services/userService.js";
import * as authService from "../services/authService.js";
import toast from "react-hot-toast";
import { disconnectSocket } from "../lib/socket.js";
import {
  ArrowLeft,
  Lock,
  LogOut,
  Trash2,
  User,
  Mail,
  FileText,
  AlertCircle,
  Edit2,
  Save,
  X,
  Circle,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [isEdit, setIsEdit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }
    try {
      setLoading(true);
      const res = await userService.updateProfile({
        name: formData.name.trim(),
        bio: formData.bio.trim(),
      });

      if (res.msg === "User updated successfully!") {
        dispatch(
          updateUser({
            ...user,
            name: formData.name.trim(),
            bio: formData.bio.trim(),
          }),
        );
        toast.success("Profile updated successfully!");
        setIsEdit(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword) {
      toast.error("Current password is required.");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const res = await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      });

      if (res.success === true) {
        toast.success("Password updated successfully!");
        setShowPassword(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    dispatch(logout());
    disconnectSocket();
    navigate("/login");
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const res = await authService.deleteAccount();
      if (res.success === true) {
        disconnectSocket();
        dispatch(logout());
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to delete account");
    } finally {
      setLoading(false);
      setShowDelete(false);
    }
  };

  const isOnline = user?.status === "online";
  const avatarLetter =
    user?.avatar || user?.name?.charAt(0).toUpperCase() || "U";

  return (
    <div className="relative min-h-screen bg-black">
      {/* Neon background glow */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -bottom-25 -right-15 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(59,130,246,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.12)_1px,transparent_1px)] [bg-size:36px_36px]" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Sticky top nav */}
        <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-xl border-b border-cyan-500/20">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center">
            <button
              onClick={() => navigate("/")}
              aria-label="Back to chats"
              className="p-2 hover:bg-cyan-500/10 rounded-xl"
            >
              <ArrowLeft className="w-5 h-5 text-gray-400" />
            </button>
            <h1 className="flex-1 text-center text-white font-semibold">
              Profile
            </h1>
            <div className="w-9" />
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-6">
          {/* avatar */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-24 h-24 bg-cyan-500/10 rounded-full border border-cyan-400/40 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.2)]">
              <span className="text-cyan-400 font-bold text-3xl">
                {avatarLetter}
              </span>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <Circle
                className={`w-2 h-2 ${isOnline ? "text-green-400" : "text-gray-500"} fill-current ${isOnline ? "shadow-[0_0_6px_rgba(74,222,128,0.5)]" : ""}`}
              />
              <span className="text-gray-500 text-xs">
                {isOnline ? "Online" : "Offline"}
              </span>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            {/* name */}
            <div className="bg-white/2 rounded-xl border border-cyan-500/20 p-4">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-gray-500 text-xs font-medium">
                  FULL NAME
                </span>
              </div>
              {isEdit ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-black rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm border border-cyan-500/20"
                />
              ) : (
                <p className="text-white text-base">{user?.name}</p>
              )}
            </div>

            {/* email */}
            <div className="bg-white/2 rounded-xl border border-cyan-500/20 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-gray-500 text-xs font-medium">EMAIL</span>
              </div>
              <p className="text-white text-base">{user?.email}</p>
            </div>

            {/* bio */}
            <div className="bg-white/2 rounded-xl border border-cyan-500/20 p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-gray-500 text-xs font-medium">BIO</span>
              </div>
              {isEdit ? (
                <textarea
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  rows="3"
                  placeholder="Tell something about yourself..."
                  className="w-full bg-black rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm resize-none border border-cyan-500/20"
                />
              ) : (
                <p className="text-gray-300 text-sm leading-relaxed">
                  {user?.bio}
                </p>
              )}
            </div>
          </div>

          {/* edit profile */}
          <div className="flex gap-3 mb-8">
            {!isEdit ? (
              <button
                onClick={() => setIsEdit(true)}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-cyan-500/10 border border-cyan-400/30 hover:bg-cyan-500/20 rounded-xl text-cyan-400 font-medium disabled:opacity-50"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={() => setIsEdit(false)}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white/2 hover:bg-white/4 rounded-xl text-white font-medium border border-white/4 disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-cyan-500/10 border border-cyan-400/30 hover:bg-cyan-500/20 rounded-xl text-cyan-400 font-medium disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </>
            )}
          </div>

          {/* password change section */}
          <div className="mb-6">
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="w-full flex items-center justify-between p-4 bg-white/2 rounded-xl border border-cyan-500/20 hover:bg-cyan-500/10"
            >
              <div className="flex items-center gap-3">
                <Lock className="w-4 h-4 text-gray-400" />
                <span className="text-white">Change Password</span>
              </div>
              {showPassword ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </button>

            {showPassword && (
              <div className="mt-3 p-4 bg-white/2 rounded-xl border border-cyan-500/20 space-y-3">
                <input
                  type="password"
                  placeholder="Current Password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                  className="w-full bg-black rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm border border-cyan-500/20"
                />
                <input
                  type="password"
                  placeholder="New Password (min 6 characters)"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  className="w-full bg-black rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm border border-cyan-500/20"
                />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full bg-black rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm border border-cyan-500/20"
                />
                <button
                  onClick={handleChangePassword}
                  disabled={loading}
                  className="w-full py-2.5 bg-cyan-500/10 border border-cyan-400/30 hover:bg-cyan-500/20 rounded-lg text-cyan-400 font-medium disabled:opacity-50"
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </div>
            )}
          </div>

          {/* logout/delete */}
          <div className="space-y-3">
            <p className="text-red-400 text-xs uppercase tracking-wider px-1">
              Danger Zone
            </p>

            {/* logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-between p-4 bg-white/2 rounded-xl border border-cyan-500/20 hover:bg-red-500/10 hover:border-red-500/30"
            >
              <div className="flex items-center gap-3">
                <LogOut className="w-4 h-4 text-red-400" />
                <span className="text-white">Logout</span>
              </div>
              <span className="text-gray-500 text-sm">→</span>
            </button>

            {/* delete */}
            {!showDelete ? (
              <button
                onClick={() => setShowDelete(true)}
                className="w-full flex items-center justify-between p-4 bg-white/2 rounded-xl border border-cyan-500/20 hover:bg-red-500/10 hover:border-red-500/30"
              >
                <div className="flex items-center gap-3">
                  <Trash2 className="w-4 h-4 text-red-400" />
                  <span className="text-white">Delete Account</span>
                </div>
                <span className="text-gray-500 text-sm">→</span>
              </button>
            ) : (
              <div className="bg-red-500/5 rounded-xl p-4 border border-red-500/30">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <span className="text-red-400 font-medium">
                    Delete Account?
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-4">
                  This action cannot be undone. All your data will be lost.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDelete(false)}
                    className="flex-1 py-2 bg-white/2 rounded-lg text-white text-sm font-medium hover:bg-white/4 border border-white/4"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="flex-1 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white text-sm font-medium disabled:opacity-50"
                  >
                    {loading ? "Deleting..." : "Yes, Delete"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
