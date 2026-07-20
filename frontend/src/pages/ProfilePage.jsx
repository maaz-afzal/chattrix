import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout, updateUser } from "../redux/Slices/authSlice.js";
import { formatLastSeen } from "../utils/formatLastSeen.js";
import userService from "../services/userService.js";
import authService from "../services/authService.js";
import toast from "react-hot-toast";
import { disconnectSocket } from "../lib/socket.js";
import { ArrowLeft, LogOut, Trash2, User, Mail, FileText, AlertCircle, Edit2, Save, X, Camera, Sun, Moon, Monitor, Shield, Palette, ChevronRight } from "lucide-react";
import { getSocket } from "../lib/socket.js";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const fileInputRef = useRef(null);

  const [isEdit, setIsEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "system";
  });

  const [formData, setFormData] = useState({ name: user?.name || "", bio: user?.bio || "" });

  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  const avatarLetter = user?.name?.charAt(0)?.toUpperCase() || "?";

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result;
        const res = await userService.updateProfile({ profileImage: base64Image });
        dispatch(updateUser({ ...user, profileImage: base64Image }));
        toast.success("Profile picture updated!");
        setUploadingImage(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error("Failed to upload image");
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = async () => {
    try {
      setUploadingImage(true);
      const res = await userService.updateProfile({ profileImage: "" });
      dispatch(updateUser({ ...user, profileImage: null }));
      toast.success("Profile picture removed!");
    } catch (error) {
      toast.error("Failed to remove image");
    } finally {
      setUploadingImage(false);
    }
  };

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

      if (res.success === true) {
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

  const handleThemeChange = (selectedTheme) => {
    setTheme(selectedTheme);
    localStorage.setItem("theme", selectedTheme);

    if (selectedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (selectedTheme === "light") {
      document.documentElement.classList.remove("dark");
    } else if (selectedTheme === "system") {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      if (prefersDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {
      // proceed with local logout even if API fails
    }
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

  const onlineUsers = useSelector((state) => state.users.onlineUsers);
  const lastSeenByUser = useSelector((state) => state.users.lastSeenByUser);
  const socket = getSocket();
  const isOnline = onlineUsers.includes(user?._id) || user?.isOnline === true || socket?.connected;
  const lastSeen = lastSeenByUser[user?._id];

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-150 h-150 rounded-full bg-[#7C3AED]/5 blur-[150px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-100 h-100 rounded-full bg-cyan-500/5 blur-[120px]" />
      </div>

      <div className="relative z-10">
        <div className="sticky top-0 z-20 bg-[#0A0A0B]/80 backdrop-blur-xl border-b border-[#1F1F24]">
          <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => navigate("/")}
              className="p-2 hover:bg-[#1F1F24] rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[#9CA3AF]" />
            </button>
            <h1 className="text-white font-semibold text-lg">
              Profile Settings
            </h1>
            <div className="w-9" />
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
          {/* personal information */}
          <section className="bg-[#0F0F13] rounded-3xl border border-[#1F1F24] overflow-hidden">
            <div className="px-6 pt-6 pb-4 flex items-center gap-3 border-b border-[#1F1F24]">
              <div className="w-8 h-8 rounded-lg bg-[#7C3AED]/10 flex items-center justify-center">
                <User className="w-4 h-4 text-[#7C3AED]" />
              </div>
              <div>
                <h2 className="text-white font-semibold">
                  Personal Information
                </h2>
                <p className="text-[#6B7280] text-xs">
                  Manage your profile details
                </p>
              </div>
              {!isEdit && (
                <button
                  onClick={() => setIsEdit(true)}
                  disabled={loading}
                  className="ml-auto px-4 py-2 bg-[#7C3AED]/10 hover:bg-[#7C3AED]/20 rounded-lg text-[#7C3AED] text-sm font-medium transition-colors flex items-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit
                </button>
              )}
            </div>

            <div className="px-6 py-6 flex flex-col items-center">
              <div className="relative group mb-5">
                <div className="w-24 h-24 rounded-2xl overflow-hidden ring-2 ring-[#1F1F24] bg-[#1A1A1E] flex items-center justify-center">
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user?.name || "Profile"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-[#A78BFA] font-bold text-3xl">
                      {avatarLetter}
                    </span>
                  )}
                </div>

                {user?.profileImage?.startsWith("data:image") && (
                  <div className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center">
                    {uploadingImage ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    )}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 w-9 h-9 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] border-4 border-[#0F0F13] flex items-center justify-center transition-colors shadow-lg"
                >
                  <Camera className="w-4 h-4 text-white" />
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                  isOnline
                    ? "bg-green-500/10 text-green-400"
                    : "bg-gray-500/10 text-gray-400"
                }`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full ${isOnline ? "bg-green-400" : "bg-gray-500"}`}
                />
                {isOnline ? "Online" : lastSeen ? `Last seen ${formatLastSeen(lastSeen)}` : "Offline"}
              </div>
            </div>

            <div className="px-6 pb-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[#6B7280] text-xs font-medium uppercase tracking-wider">
                  Full Name
                </label>
                {isEdit ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full bg-[#0A0A0B] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/50 text-sm border border-[#1F1F24]"
                    placeholder="Enter your name"
                  />
                ) : (
                  <p className="text-white font-medium">{user?.name}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-[#6B7280] text-xs font-medium uppercase tracking-wider">
                  Email Address
                </label>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#6B7280]" />
                  <p className="text-[#D1D5DB] font-medium">{user?.email}</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[#6B7280] text-xs font-medium uppercase tracking-wider">
                  Bio
                </label>
                {isEdit ? (
                  <textarea
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    rows="3"
                    placeholder="Write something about yourself..."
                    className="w-full bg-[#0A0A0B] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/50 text-sm resize-none border border-[#1F1F24]"
                  />
                ) : (
                  <div className="flex items-start gap-2">
                    <FileText className="w-4 h-4 text-[#6B7280] mt-0.5" />
                    <p className="text-[#9CA3AF] text-sm">
                      {user?.bio || "No bio added yet"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {isEdit && (
              <div className="px-6 pb-6 flex gap-3">
                <button
                  onClick={() => setIsEdit(false)}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#1F1F24] hover:bg-[#2A2A32] rounded-xl text-white font-medium transition-colors"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] rounded-xl text-white font-medium transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </section>

          {/* appearance */}
          <section className="bg-[#0F0F13] rounded-3xl border border-[#1F1F24] p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                <Palette className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-white font-semibold">Appearance</h2>
                <p className="text-[#6B7280] text-xs">
                  Choose your preferred theme
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleThemeChange("light")}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                  theme === "light"
                    ? "border-[#7C3AED] bg-[#7C3AED]/10 ring-1 ring-[#7C3AED]/30"
                    : "border-[#1F1F24] hover:border-[#2A2A32] hover:bg-[#1A1A1E]"
                }`}
              >
                <Sun
                  className={`w-5 h-5 ${theme === "light" ? "text-[#7C3AED]" : "text-[#6B7280]"}`}
                />
                <span
                  className={`text-xs font-medium ${theme === "light" ? "text-[#7C3AED]" : "text-[#6B7280]"}`}
                >
                  Light
                </span>
              </button>

              <button
                onClick={() => handleThemeChange("dark")}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                  theme === "dark"
                    ? "border-[#7C3AED] bg-[#7C3AED]/10 ring-1 ring-[#7C3AED]/30"
                    : "border-[#1F1F24] hover:border-[#2A2A32] hover:bg-[#1A1A1E]"
                }`}
              >
                <Moon
                  className={`w-5 h-5 ${theme === "dark" ? "text-[#7C3AED]" : "text-[#6B7280]"}`}
                />
                <span
                  className={`text-xs font-medium ${theme === "dark" ? "text-[#7C3AED]" : "text-[#6B7280]"}`}
                >
                  Dark
                </span>
              </button>

              <button
                onClick={() => handleThemeChange("system")}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                  theme === "system"
                    ? "border-[#7C3AED] bg-[#7C3AED]/10 ring-1 ring-[#7C3AED]/30"
                    : "border-[#1F1F24] hover:border-[#2A2A32] hover:bg-[#1A1A1E]"
                }`}
              >
                <Monitor
                  className={`w-5 h-5 ${theme === "system" ? "text-[#7C3AED]" : "text-[#6B7280]"}`}
                />
                <span
                  className={`text-xs font-medium ${theme === "system" ? "text-[#7C3AED]" : "text-[#6B7280]"}`}
                >
                  System
                </span>
              </button>
            </div>
          </section>

          {/* security */}
          <section className="bg-[#0F0F13] rounded-3xl border border-[#1F1F24] p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <Shield className="w-4 h-4 text-yellow-400" />
              </div>
              <div>
                <h2 className="text-white font-semibold">Security</h2>
                <p className="text-[#6B7280] text-xs">Update your password</p>
              </div>
            </div>

            <div className="space-y-3">
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
                className="w-full bg-[#0A0A0B] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/30 text-sm border border-[#1F1F24]"
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
                className="w-full bg-[#0A0A0B] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/30 text-sm border border-[#1F1F24]"
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
                className="w-full bg-[#0A0A0B] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/30 text-sm border border-[#1F1F24]"
              />
              <button
                onClick={handleChangePassword}
                disabled={loading}
                className="w-full py-3 bg-yellow-500/10 hover:bg-yellow-500/20 rounded-xl text-yellow-400 font-medium transition-colors disabled:opacity-50 border border-yellow-500/20"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </div>
          </section>

          {/* account */}
          <section className="bg-[#0F0F13] rounded-3xl border border-red-500/10 overflow-hidden">
            <div className="p-6 border-b border-red-500/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                </div>
                <div>
                  <h2 className="text-red-400 font-semibold">Account</h2>
                  <p className="text-[#6B7280] text-xs">
                    Manage sessions and account
                  </p>
                </div>
              </div>
            </div>

            <div className="divide-y divide-[#1F1F24]">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-4 p-5 hover:bg-red-500/5 transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                  <LogOut className="w-4 h-4 text-red-400" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-white font-medium">Logout</p>
                  <p className="text-[#6B7280] text-xs">
                    Sign out of your account
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-[#4B5563] group-hover:text-red-400 group-hover:translate-x-1 transition-all" />
              </button>

              <button
                onClick={() => setShowDelete(true)}
                className="w-full flex items-center gap-4 p-5 hover:bg-red-500/5 transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                  <Trash2 className="w-4 h-4 text-red-400" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-red-400 font-medium">Delete Account</p>
                  <p className="text-[#6B7280] text-xs">
                    Permanently remove your account
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-[#4B5563] group-hover:text-red-400 group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          </section>

          {showDelete && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setShowDelete(false)}
              />

              <div className="relative bg-[#0F0F13] rounded-2xl border border-[#1F1F24] w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center">
                    <Trash2 className="w-7 h-7 text-red-400" />
                  </div>
                </div>

                <h3 className="text-white text-lg font-semibold text-center mb-2">
                  Delete Account
                </h3>

                <p className="text-[#9CA3AF] text-sm text-center leading-relaxed mb-6">
                  Your profile will be deleted but your messages will remain
                  visible to others.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDelete(false)}
                    className="flex-1 py-3 bg-[#1F1F24] hover:bg-[#2A2A32] rounded-xl text-white text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="flex-1 py-3 bg-red-600 hover:bg-red-700 rounded-xl text-white text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      "Delete"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="h-8" />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
