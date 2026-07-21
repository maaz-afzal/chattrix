import React, { useState } from "react";
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  MessageSquareText,
  Bot,
  Shield,
  Zap,
  Globe,
} from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService.js";
import { useDispatch } from "react-redux";
import { login } from "../redux/Slices/authSlice";
import { Link } from "react-router-dom";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Please fill in all fields.");
      return;
    }

    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(formData.name)) {
      toast.error("Please enter a valid name.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      const response = await authService.register(formData);

      if (response.token && response.user) {
        dispatch(login({ token: response.token, user: response.user }));
        setFormData({ name: "", email: "", password: "" });
        toast.success("Signup successful!");
        navigate("/");
      } else {
        throw new Error("Invalid response!");
      }
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.msg || "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#161616] text-white flex">
      
      <div className="hidden lg:flex lg:w-[480px] xl:w-[520px] shrink-0 flex-col justify-between p-10 bg-[#161616] border-r border-[#2E2E2F]">
        <div>
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl bg-[#A37CFF]/12 flex items-center justify-center">
              <MessageSquareText className="w-5 h-5 text-[#A37CFF]" />
            </div>
            <span className="text-[18px] font-bold text-white tracking-tight">
              Chattrix
            </span>
          </div>

          <h2 className="text-[32px] xl:text-[36px] font-bold leading-[1.15] text-white mb-4">
            Start your
            <br />
            <span className="text-[#A37CFF]">conversations.</span>
          </h2>

          <p className="text-[14px] text-[#888] leading-relaxed max-w-sm mb-10">
            Create your account and connect with people around the world
            instantly.
          </p>

          <div className="space-y-3">
            <div className="flex items-center gap-4 rounded-xl bg-[#1D1E1F] px-4 py-3.5">
              <div className="w-9 h-9 rounded-lg bg-[#A37CFF]/10 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4 text-[#A37CFF]" />
              </div>
              <div>
                <p className="text-[13px] font-medium text-white">
                  Real-time messaging
                </p>
                <p className="text-[11px] text-[#666] mt-0.5">
                  Instant delivery with live indicators
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-xl bg-[#1D1E1F] px-4 py-3.5">
              <div className="w-9 h-9 rounded-lg bg-[#A37CFF]/10 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-[#A37CFF]" />
              </div>
              <div>
                <p className="text-[13px] font-medium text-white">
                  AI Assistant
                </p>
                <p className="text-[11px] text-[#666] mt-0.5">
                  Built-in Gemini powered chatbot
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-xl bg-[#1D1E1F] px-4 py-3.5">
              <div className="w-9 h-9 rounded-lg bg-[#A37CFF]/10 flex items-center justify-center shrink-0">
                <Globe className="w-4 h-4 text-[#A37CFF]" />
              </div>
              <div>
                <p className="text-[13px] font-medium text-white">
                  Connect globally
                </p>
                <p className="text-[11px] text-[#666] mt-0.5">
                  Chat with anyone, anywhere
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-xl bg-emerald-500/[0.06] border border-emerald-500/10 px-4 py-3.5">
          <Shield className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
          <p className="text-[12px] text-[#888] leading-relaxed">
            Your conversations are private. Only you and the recipient can read
            messages.
          </p>
        </div>
      </div>

      
      <div className="flex-1 flex items-center justify-center px-5 py-8">
        <div className="w-full max-w-[400px]">
          
          <div className="flex items-center justify-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-[#A37CFF]/12 flex items-center justify-center">
              <MessageSquareText className="w-5 h-5 text-[#A37CFF]" />
            </div>
            <span className="text-[18px] font-bold text-white">Chattrix</span>
          </div>

          <div className="mb-8">
            <h2 className="text-[24px] font-bold text-white mb-1">
              Create account
            </h2>
            <p className="text-[13px] text-[#666]">
              Fill in your details to get started
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-[12px] font-medium text-[#999] mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                  <User
                    className={`w-4 h-4 transition-colors ${
                      focused === "name" ? "text-[#A37CFF]" : "text-[#555]"
                    }`}
                  />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setFocused("name")}
                  onBlur={() => setFocused("")}
                  disabled={loading}
                  placeholder="John Doe"
                  className="w-full rounded-lg bg-[#212120] pl-10 pr-4 py-2.5 text-[13px] text-white placeholder:text-[#555] outline-none border border-transparent focus:border-[#A37CFF]/30 focus:ring-1 focus:ring-[#A37CFF]/20 transition-all disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-medium text-[#999] mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                  <Mail
                    className={`w-4 h-4 transition-colors ${
                      focused === "email" ? "text-[#A37CFF]" : "text-[#555]"
                    }`}
                  />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused("")}
                  disabled={loading}
                  placeholder="you@example.com"
                  className="w-full rounded-lg bg-[#212120] pl-10 pr-4 py-2.5 text-[13px] text-white placeholder:text-[#555] outline-none border border-transparent focus:border-[#A37CFF]/30 focus:ring-1 focus:ring-[#A37CFF]/20 transition-all disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-medium text-[#999] mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                  <Lock
                    className={`w-4 h-4 transition-colors ${
                      focused === "password" ? "text-[#A37CFF]" : "text-[#555]"
                    }`}
                  />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused("")}
                  disabled={loading}
                  placeholder="Min. 6 characters"
                  className="w-full rounded-lg bg-[#212120] pl-10 pr-4 py-2.5 text-[13px] text-white placeholder:text-[#555] outline-none border border-transparent focus:border-[#A37CFF]/30 focus:ring-1 focus:ring-[#A37CFF]/20 transition-all disabled:opacity-50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#A37CFF] hover:bg-[#9370f0] px-4 py-2.5 text-[13px] font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-[13px] text-[#666]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-[#A37CFF] hover:text-[#b99aff] transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;