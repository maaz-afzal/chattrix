import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../redux/Slices/authSlice.js";
import authService from "../../../services/authService.js";
import { disconnectSocket } from "../../../lib/socket.js";
import toast from "react-hot-toast";
import { Trash2, ChevronRight } from "lucide-react";

const AccountSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {
      // ignore network errors; local logout must still happen
    }
    dispatch(logout());
    disconnectSocket();
    navigate("/login");
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await authService.deleteAccount();
      disconnectSocket();
      dispatch(logout());
      navigate("/login");
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to delete Account!");
    } finally {
      setLoading(false);
      setShowDelete(false);
    }
  };

  return (
    <>
      <section className="rounded-2xl border border-red-500/20 bg-[#f7f7f8] dark:bg-[#161616] overflow-hidden">
        <div className="px-5 py-4 border-b border-red-500/10">
          <h2 className="text-[13px] font-semibold text-[#f87171]">Account</h2>
        </div>
        <div className="p-2 space-y-1">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-[#ececee] dark:hover:bg-[#1D1E1F] transition-colors group"
          >
            <div className="text-left">
              <p className="text-[13px] text-[#1a1a1b] dark:text-white">Logout</p>
              <p className="text-[11px] text-[#8a8a8c] dark:text-[#666] mt-0.5">Sign out</p>
            </div>
            <ChevronRight className="w-4 h-4 text-[#9a9a9c] dark:text-[#555] group-hover:text-[#1a1a1b] dark:group-hover:text-white" />
          </button>
          <button
            onClick={() => setShowDelete(true)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-red-500/5 transition-colors group"
          >
            <div className="text-left">
              <p className="text-[13px] text-[#f87171]">Delete Account</p>
              <p className="text-[11px] text-[#8a8a8c] dark:text-[#666] mt-0.5">
                Permanently remove
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-[#f87171]" />
          </button>
        </div>
      </section>

      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setShowDelete(false)}
          />
          <div className="relative w-full max-w-sm rounded-2xl border border-[#e2e2e4] dark:border-[#2E2E2F] bg-[#f7f7f8] dark:bg-[#161616]">
            <div className="px-6 pt-6 pb-4 text-center">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-5 h-5 text-[#f87171]" />
              </div>
              <h3 className="text-[15px] font-semibold text-[#1a1a1b] dark:text-white mb-1.5">
                Delete Account
              </h3>
              <p className="text-[12px] text-[#6b6b6d] dark:text-[#888] leading-relaxed">
                Your profile will be deleted but messages remain visible.
              </p>
            </div>
            <div className="px-5 pb-5 flex gap-2">
              <button
                onClick={() => setShowDelete(false)}
                className="flex-1 h-9 rounded-lg bg-[#ececee] dark:bg-[#1D1E1F] text-[13px] text-[#1a1a1b] dark:text-white hover:bg-[#e2e2e4] dark:hover:bg-[#2E2E2F]"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 h-9 rounded-lg bg-red-600 text-[13px] text-white hover:bg-red-500 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
    </>
  );
};

export default AccountSection;
