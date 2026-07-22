import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { Edit2, Camera, Trash2 } from "lucide-react";
import userService from "../../../services/userService.js";
import toast from "react-hot-toast";

const PersonalInfoSection = ({ user, isOnline, lastSeen, formatLastSeen }) => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
  });

  const avatarLetter = user?.name?.charAt(0)?.toUpperCase() || "?";
  const palettes = [
    "bg-[#2a2352] text-[#A37CFF]",
    "bg-[#1e3a2e] text-[#6ee7b7]",
    "bg-[#3a2a1e] text-[#fbbf24]",
    "bg-[#352028] text-[#fda4af]",
    "bg-[#1e2e3a] text-[#93c5fd]",
  ];
  const toneIndex = user?.name ? user.name.charCodeAt(0) % palettes.length : 0;

  const inputClass =
    "w-full rounded-lg bg-[#212120] px-3 py-2.5 text-[13px] text-white placeholder:text-[#666] outline-none focus:ring-1 focus:ring-[#A37CFF]/30";

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingImage(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        await userService.updateProfile({ profileImage: reader.result });
        dispatch(updateUser({ ...user, profileImage: reader.result }));
        toast.success("Updated!");
        setUploadingImage(false);
      };
      reader.readAsDataURL(file);
    } catch {
      toast.error("Failed");
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = async () => {
    try {
      setUploadingImage(true);
      await userService.updateProfile({ profileImage: "" });
      dispatch(updateUser({ ...user, profileImage: null }));
      toast.success("Removed!");
    } catch {
      toast.error("Failed");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error("Name required.");
      return;
    }
    try {
      setLoading(true);
      const res = await userService.updateProfile({
        name: formData.name.trim(),
        bio: formData.bio.trim(),
      });
      if (res.success) {
        dispatch(
          updateUser({
            ...user,
            name: formData.name.trim(),
            bio: formData.bio.trim(),
          }),
        );
        toast.success("Saved!");
        setIsEdit(false);
      }
    } catch (e) {
      toast.error(e.response?.data?.msg || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-2xl border border-[#2E2E2F] bg-[#161616] overflow-hidden">
      <div className="px-5 py-4 border-b border-[#2E2E2F] flex items-center justify-between">
        <div>
          <h2 className="text-[13px] font-semibold text-white">Profile</h2>
          <p className="text-[11px] text-[#666] mt-0.5">Manage your details</p>
        </div>
        {!isEdit && (
          <button
            onClick={() => setIsEdit(true)}
            className="h-8 px-3 flex items-center gap-1.5 rounded-lg bg-[#1D1E1F] text-[12px] text-white hover:bg-[#2E2E2F] transition-colors"
          >
            <Edit2 className="w-3 h-3" /> Edit
          </button>
        )}
      </div>

      <div className="px-5 py-5">
        <div className="flex flex-col items-center mb-5">
          <div className="relative group mb-3">
            <div
              className={`w-20 h-20 rounded-full overflow-hidden flex items-center justify-center ${user?.profileImage ? "bg-[#1D1E1F]" : palettes[toneIndex]}`}
            >
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl font-semibold">{avatarLetter}</span>
              )}
            </div>

            {user?.profileImage?.startsWith("data:image") && (
              <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                {uploadingImage ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <button
                    onClick={handleRemoveImage}
                    className="p-1.5 rounded-md bg-white/10 hover:bg-white/20"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-[#f87171]" />
                  </button>
                )}
              </div>
            )}

            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#A37CFF] hover:bg-[#9370f0] border-[3px] border-[#161616] flex items-center justify-center transition-colors"
            >
              <Camera className="w-3 h-3 text-white" />
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
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${isOnline ? "bg-emerald-500/10 text-emerald-500" : "bg-[#1D1E1F] text-[#666]"}`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${isOnline ? "bg-emerald-500" : "bg-[#666]"}`}
            />
            {isOnline
              ? "Online"
              : lastSeen
                ? `Last seen ${formatLastSeen(lastSeen)}`
                : "Offline"}
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-[11px] text-[#666] uppercase tracking-wider mb-1.5">
              Name
            </label>
            {isEdit ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className={inputClass}
              />
            ) : (
              <p className="text-[13px] text-white">{user?.name}</p>
            )}
          </div>
          <div>
            <label className="block text-[11px] text-[#666] uppercase tracking-wider mb-1.5">
              Email
            </label>
            <p className="text-[13px] text-[#ccc]">{user?.email}</p>
          </div>
          <div>
            <label className="block text-[11px] text-[#666] uppercase tracking-wider mb-1.5">
              Bio
            </label>
            {isEdit ? (
              <textarea
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                rows="3"
                className={`${inputClass} resize-none`}
              />
            ) : (
              <p className="text-[13px] text-[#ccc]">{user?.bio || "No bio"}</p>
            )}
          </div>
        </div>

        {isEdit && (
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setIsEdit(false)}
              className="flex-1 h-9 rounded-lg bg-[#1D1E1F] text-[13px] text-white hover:bg-[#2E2E2F] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 h-9 rounded-lg bg-[#A37CFF] text-[13px] text-white hover:bg-[#9370f0] disabled:opacity-50 transition-colors"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default PersonalInfoSection;
