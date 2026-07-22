import React, { useState } from "react";
import authService from "../../../services/authService.js";
import toast from "react-hot-toast";

const SecuritySection = () => {
  const [loading, setLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const inputClass =
    "w-full rounded-lg bg-[#212120] px-3 py-2.5 text-[13px] text-white placeholder:text-[#666] outline-none focus:ring-1 focus:ring-[#A37CFF]/30";

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword) {
      toast.error("Current password required.");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("Min 6 characters.");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords don't match.");
      return;
    }
    try {
      setLoading(true);
      const res = await authService.changePassword(passwordData);
      if (res.success) {
        toast.success("Updated!");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (e) {
      toast.error(e.response?.data?.msg || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-2xl border border-[#2E2E2F] bg-[#161616] overflow-hidden">
      <div className="px-5 py-4 border-b border-[#2E2E2F]">
        <h2 className="text-[13px] font-semibold text-white">Security</h2>
      </div>
      <div className="p-4 space-y-2">
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
          className={inputClass}
        />
        <input
          type="password"
          placeholder="New Password"
          value={passwordData.newPassword}
          onChange={(e) =>
            setPasswordData({ ...passwordData, newPassword: e.target.value })
          }
          className={inputClass}
        />
        <input
          type="password"
          placeholder="Confirm"
          value={passwordData.confirmPassword}
          onChange={(e) =>
            setPasswordData({
              ...passwordData,
              confirmPassword: e.target.value,
            })
          }
          className={inputClass}
        />
        <button
          onClick={handleChangePassword}
          disabled={loading}
          className="w-full h-9 rounded-lg bg-[#A37CFF] text-[13px] text-white hover:bg-[#9370f0] disabled:opacity-50 transition-colors"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </div>
    </section>
  );
};

export default SecuritySection;
