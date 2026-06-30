import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout, updateUser } from "../redux/Slices/authSlice";
import * as userService from "../services/userService.js";
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
    currPassword: "",
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
    if (!passwordData.currPassword) {
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
      const res = await userService.updateProfile({
        currPassword: passwordData.currPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      });

      if (res.msg === "Password updated successfully!") {
        toast.success("Password updated successfully!");
        setShowPassword(false);
        setPasswordData({
          currPassword: "",
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

  const handleLogout = () => {
    dispatch(logout());
    disconnectSocket();
    navigate("/login");
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const res = await userService.deleteAccount();
      if (res.msg === "User deleted successfully!") {
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
    <div className="min-h-screen bg-black">
      {/* Sticky top nav */}
      <div className="sticky top-0 z-10 bg-black border-b border-neutral-800">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center">
          <button
            onClick={() => navigate("/")}
            aria-label="Back to chats"
            className="p-2 hover:bg-neutral-800 rounded-xl transition"
          >
            <ArrowLeft className="w-5 h-5 text-neutral-400" />
          </button>
          <h1 className="flex-1 text-center text-white font-semibold">
            Profile
          </h1>
          <div className="w-9" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* avatar  */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-3xl">
              {avatarLetter}
            </span>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <Circle
              className={`w-2 h-2 ${isOnline ? "text-green-500" : "text-neutral-500"} fill-current`}
            />
            <span className="text-neutral-500 text-xs">
              {isOnline ? "Online" : "Offline"}
            </span>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          {/* name */}
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-4">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-3.5 h-3.5 text-indigo-500" />
              <span className="text-neutral-500 text-xs font-medium">
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
                className="w-full bg-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            ) : (
              <p className="text-white text-base">{user?.name}</p>
            )}
          </div>

          {/* email */}
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="w-3.5 h-3.5 text-indigo-500" />
              <span className="text-neutral-500 text-xs font-medium">
                EMAIL
              </span>
            </div>
            <p className="text-white text-base">{user?.email}</p>
          </div>

          {/* bio */}
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-3.5 h-3.5 text-indigo-500" />
              <span className="text-neutral-500 text-xs font-medium">BIO</span>
            </div>
            {isEdit ? (
              <textarea
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                rows="3"
                placeholder="Tell something about yourself..."
                className="w-full bg-neutral-800 rounded-lg px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
              />
            ) : (
              <p className="text-neutral-300 text-sm leading-relaxed">
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
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white font-medium transition disabled:opacity-50"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
          ) : (
            <>
              <button
                onClick={() => setIsEdit(false)}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-white font-medium transition disabled:opacity-50"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white font-medium transition disabled:opacity-50"
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
            className="w-full flex items-center justify-between p-4 bg-neutral-900 rounded-xl border border-neutral-800 hover:bg-neutral-800 transition"
          >
            <div className="flex items-center gap-3">
              <Lock className="w-4 h-4 text-neutral-500" />
              <span className="text-white">Change Password</span>
            </div>
            {showPassword ? (
              <ChevronUp className="w-4 h-4 text-neutral-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-neutral-500" />
            )}
          </button>

          {showPassword && (
            <div className="mt-3 p-4 bg-neutral-900 rounded-xl border border-neutral-800 space-y-3">
              <input
                type="password"
                placeholder="Current Password"
                value={passwordData.currPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    currPassword: e.target.value,
                  })
                }
                className="w-full bg-neutral-800 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
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
                className="w-full bg-neutral-800 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
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
                className="w-full bg-neutral-800 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
              <button
                onClick={handleChangePassword}
                disabled={loading}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-medium transition disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </div>
          )}
        </div>

        {/* logout/delete */}
        <div className="space-y-3">
          <p className="text-red-500 text-xs uppercase tracking-wider px-1">
            Danger Zone
          </p>

          {/* logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between p-4 bg-neutral-900 rounded-xl border border-neutral-800 hover:bg-neutral-800 transition"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-4 h-4 text-red-400" />
              <span className="text-white">Logout</span>
            </div>
            <span className="text-neutral-500 text-sm">→</span>
          </button>

          {/* delete */}
          {!showDelete ? (
            <button
              onClick={() => setShowDelete(true)}
              className="w-full flex items-center justify-between p-4 bg-neutral-900 rounded-xl border border-neutral-800 hover:bg-neutral-800 transition"
            >
              <div className="flex items-center gap-3">
                <Trash2 className="w-4 h-4 text-red-400" />
                <span className="text-white">Delete Account</span>
              </div>
              <span className="text-neutral-500 text-sm">→</span>
            </button>
          ) : (
            <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/30">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="text-red-400 font-medium">
                  Delete Account?
                </span>
              </div>
              <p className="text-neutral-400 text-sm mb-4">
                This action cannot be undone. All your data will be lost.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDelete(false)}
                  className="flex-1 py-2 bg-neutral-800 rounded-lg text-white text-sm font-medium hover:bg-neutral-700 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="flex-1 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white text-sm font-medium transition disabled:opacity-50"
                >
                  {loading ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
