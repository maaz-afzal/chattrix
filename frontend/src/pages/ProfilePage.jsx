import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout, updateUser } from "../redux/Slices/authSlice.js";
import { formatLastSeen } from "../utils/formatLastSeen.js";
import userService from "../services/userService.js";
import authService from "../services/authService.js";
import toast from "react-hot-toast";
import { disconnectSocket } from "../lib/socket.js";
import { ArrowLeft, Trash2, Edit2, Camera, Sun, Moon, Monitor, ChevronRight } from "lucide-react";
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
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "system");
  const [formData, setFormData] = useState({ name: user?.name || "", bio: user?.bio || "" });
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  const avatarLetter = user?.name?.charAt(0)?.toUpperCase() || "?";
  const palettes = ["bg-[#2a2352] text-[#A37CFF]", "bg-[#1e3a2e] text-[#6ee7b7]", "bg-[#3a2a1e] text-[#fbbf24]", "bg-[#352028] text-[#fda4af]", "bg-[#1e2e3a] text-[#93c5fd]"];
  const toneIndex = user?.name ? user.name.charCodeAt(0) % palettes.length : 0;

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    try { setUploadingImage(true);
      const reader = new FileReader();
      reader.onloadend = async () => { await userService.updateProfile({ profileImage: reader.result }); dispatch(updateUser({ ...user, profileImage: reader.result })); toast.success("Updated!"); setUploadingImage(false); };
      reader.readAsDataURL(file);
    } catch { toast.error("Failed"); setUploadingImage(false); }
  };

  const handleRemoveImage = async () => {
    try { setUploadingImage(true); await userService.updateProfile({ profileImage: "" }); dispatch(updateUser({ ...user, profileImage: null })); toast.success("Removed!"); }
    catch { toast.error("Failed"); } finally { setUploadingImage(false); }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) { toast.error("Name required."); return; }
    try { setLoading(true); const res = await userService.updateProfile({ name: formData.name.trim(), bio: formData.bio.trim() });
      if (res.success) { dispatch(updateUser({ ...user, name: formData.name.trim(), bio: formData.bio.trim() })); toast.success("Saved!"); setIsEdit(false); }
    } catch (e) { toast.error(e.response?.data?.msg || "Failed"); } finally { setLoading(false); }
  };

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword) { toast.error("Current password required."); return; }
    if (passwordData.newPassword.length < 6) { toast.error("Min 6 characters."); return; }
    if (passwordData.newPassword !== passwordData.confirmPassword) { toast.error("Passwords don't match."); return; }
    try { setLoading(true); const res = await authService.changePassword(passwordData);
      if (res.success) { toast.success("Updated!"); setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" }); }
    } catch (e) { toast.error(e.response?.data?.msg || "Failed"); } finally { setLoading(false); }
  };

  const handleThemeChange = (t) => {
    setTheme(t); localStorage.setItem("theme", t);
    if (t === "dark") document.documentElement.classList.add("dark");
    else if (t === "light") document.documentElement.classList.remove("dark");
    else { if (window.matchMedia("(prefers-color-scheme: dark)").matches) document.documentElement.classList.add("dark"); else document.documentElement.classList.remove("dark"); }
  };

  const handleLogout = async () => { try { await authService.logout(); } catch {} dispatch(logout()); disconnectSocket(); navigate("/login"); };

  const handleDelete = async () => {
    try { setLoading(true); const res = await authService.deleteAccount(); if (res.success) { disconnectSocket(); dispatch(logout()); navigate("/login"); } }
    catch (e) { toast.error(e.response?.data?.msg || "Failed"); } finally { setLoading(false); setShowDelete(false); }
  };

  const onlineUsers = useSelector((state) => state.users.onlineUsers);
  const lastSeenByUser = useSelector((state) => state.users.lastSeenByUser);
  const socket = getSocket();
  const isOnline = onlineUsers.includes(user?._id) || user?.isOnline || socket?.connected;
  const lastSeen = lastSeenByUser[user?._id];

  const inputClass = "w-full rounded-lg bg-[#212120] px-3 py-2.5 text-[13px] text-white placeholder:text-[#666] outline-none focus:ring-1 focus:ring-[#A37CFF]/30";

  return (
    <div className="min-h-screen bg-[#161616] text-white">
      <div className="sticky top-0 z-20 border-b border-[#2E2E2F] bg-[#161616]/95 backdrop-blur-md">
        <div className="max-w-2xl mx-auto h-14 px-5 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="p-2 rounded-lg hover:bg-[#1D1E1F] transition-colors">
            <ArrowLeft className="w-[18px] h-[18px] text-[#999]" />
          </button>
          <h1 className="text-[14px] font-semibold text-white">Settings</h1>
          <div className="w-8" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 py-6 space-y-4">
        <section className="rounded-2xl border border-[#2E2E2F] bg-[#161616] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#2E2E2F] flex items-center justify-between">
            <div>
              <h2 className="text-[13px] font-semibold text-white">Profile</h2>
              <p className="text-[11px] text-[#666] mt-0.5">Manage your details</p>
            </div>
            {!isEdit && (
              <button onClick={() => setIsEdit(true)} className="h-8 px-3 flex items-center gap-1.5 rounded-lg bg-[#1D1E1F] text-[12px] text-white hover:bg-[#2E2E2F] transition-colors">
                <Edit2 className="w-3 h-3" /> Edit
              </button>
            )}
          </div>

          <div className="px-5 py-5">
            <div className="flex flex-col items-center mb-5">
              <div className="relative group mb-3">
                <div className={`w-20 h-20 rounded-full overflow-hidden flex items-center justify-center ${user?.profileImage ? "bg-[#1D1E1F]" : palettes[toneIndex]}`}>
                  {user?.profileImage ? (
                    <img src={user.profileImage} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-semibold">{avatarLetter}</span>
                  )}
                </div>

                {user?.profileImage?.startsWith("data:image") && (
                  <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    {uploadingImage ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <button onClick={handleRemoveImage} className="p-1.5 rounded-md bg-white/10 hover:bg-white/20">
                        <Trash2 className="w-3.5 h-3.5 text-[#f87171]" />
                      </button>
                    )}
                  </div>
                )}

                <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#A37CFF] hover:bg-[#9370f0] border-[3px] border-[#161616] flex items-center justify-center transition-colors">
                  <Camera className="w-3 h-3 text-white" />
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </div>

              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${isOnline ? "bg-emerald-500/10 text-emerald-500" : "bg-[#1D1E1F] text-[#666]"}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? "bg-emerald-500" : "bg-[#666]"}`} />
                {isOnline ? "Online" : lastSeen ? `Last seen ${formatLastSeen(lastSeen)}` : "Offline"}
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] text-[#666] uppercase tracking-wider mb-1.5">Name</label>
                {isEdit ? <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputClass} /> : <p className="text-[13px] text-white">{user?.name}</p>}
              </div>
              <div>
                <label className="block text-[11px] text-[#666] uppercase tracking-wider mb-1.5">Email</label>
                <p className="text-[13px] text-[#ccc]">{user?.email}</p>
              </div>
              <div>
                <label className="block text-[11px] text-[#666] uppercase tracking-wider mb-1.5">Bio</label>
                {isEdit ? <textarea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} rows="3" className={`${inputClass} resize-none`} /> : <p className="text-[13px] text-[#ccc]">{user?.bio || "No bio"}</p>}
              </div>
            </div>

            {isEdit && (
              <div className="mt-4 flex gap-2">
                <button onClick={() => setIsEdit(false)} className="flex-1 h-9 rounded-lg bg-[#1D1E1F] text-[13px] text-white hover:bg-[#2E2E2F] transition-colors">Cancel</button>
                <button onClick={handleSave} disabled={loading} className="flex-1 h-9 rounded-lg bg-[#A37CFF] text-[13px] text-white hover:bg-[#9370f0] disabled:opacity-50 transition-colors">{loading ? "Saving..." : "Save"}</button>
              </div>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-[#2E2E2F] bg-[#161616] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#2E2E2F]">
            <h2 className="text-[13px] font-semibold text-white">Appearance</h2>
          </div>
          <div className="p-4 grid grid-cols-3 gap-2">
            {[{ k: "light", I: Sun, l: "Light" }, { k: "dark", I: Moon, l: "Dark" }, { k: "system", I: Monitor, l: "System" }].map(({ k, I, l }) => (
              <button key={k} onClick={() => handleThemeChange(k)} className={`flex flex-col items-center gap-2 py-3 rounded-xl transition-colors ${theme === k ? "bg-[#A37CFF]/10 ring-1 ring-[#A37CFF]/30" : "bg-[#1D1E1F] hover:bg-[#2E2E2F]"}`}>
                <I className={`w-5 h-5 ${theme === k ? "text-[#A37CFF]" : "text-[#666]"}`} />
                <span className={`text-[11px] font-medium ${theme === k ? "text-[#A37CFF]" : "text-[#999]"}`}>{l}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-[#2E2E2F] bg-[#161616] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#2E2E2F]">
            <h2 className="text-[13px] font-semibold text-white">Security</h2>
          </div>
          <div className="p-4 space-y-2">
            <input type="password" placeholder="Current Password" value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} className={inputClass} />
            <input type="password" placeholder="New Password" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} className={inputClass} />
            <input type="password" placeholder="Confirm" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} className={inputClass} />
            <button onClick={handleChangePassword} disabled={loading} className="w-full h-9 rounded-lg bg-[#A37CFF] text-[13px] text-white hover:bg-[#9370f0] disabled:opacity-50 transition-colors">{loading ? "Updating..." : "Update Password"}</button>
          </div>
        </section>

        <section className="rounded-2xl border border-red-500/20 bg-[#161616] overflow-hidden">
          <div className="px-5 py-4 border-b border-red-500/10">
            <h2 className="text-[13px] font-semibold text-[#f87171]">Account</h2>
          </div>
          <div className="p-2 space-y-1">
            <button onClick={handleLogout} className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-[#1D1E1F] transition-colors group">
              <div className="text-left"><p className="text-[13px] text-white">Logout</p><p className="text-[11px] text-[#666] mt-0.5">Sign out</p></div>
              <ChevronRight className="w-4 h-4 text-[#555] group-hover:text-white" />
            </button>
            <button onClick={() => setShowDelete(true)} className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-red-500/5 transition-colors group">
              <div className="text-left"><p className="text-[13px] text-[#f87171]">Delete Account</p><p className="text-[11px] text-[#666] mt-0.5">Permanently remove</p></div>
              <ChevronRight className="w-4 h-4 text-[#f87171]" />
            </button>
          </div>
        </section>

        {showDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70" onClick={() => setShowDelete(false)} />
            <div className="relative w-full max-w-sm rounded-2xl border border-[#2E2E2F] bg-[#161616]">
              <div className="px-6 pt-6 pb-4 text-center">
                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-5 h-5 text-[#f87171]" />
                </div>
                <h3 className="text-[15px] font-semibold text-white mb-1.5">Delete Account</h3>
                <p className="text-[12px] text-[#888] leading-relaxed">Your profile will be deleted but messages remain visible.</p>
              </div>
              <div className="px-5 pb-5 flex gap-2">
                <button onClick={() => setShowDelete(false)} className="flex-1 h-9 rounded-lg bg-[#1D1E1F] text-[13px] text-white hover:bg-[#2E2E2F]">Cancel</button>
                <button onClick={handleDelete} disabled={loading} className="flex-1 h-9 rounded-lg bg-red-600 text-[13px] text-white hover:bg-red-500 disabled:opacity-50 flex items-center justify-center gap-2">
                  {loading ? <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Deleting...</> : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="h-4" />
      </div>
    </div>
  );
};

export default ProfilePage;