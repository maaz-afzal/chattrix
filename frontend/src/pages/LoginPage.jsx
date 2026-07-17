import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  Mail,
  Lock,
  ArrowRight,
  MessageCircle,
  Bot,
  Zap,
  CheckCircle,
} from "lucide-react";
import { login } from "../redux/Slices/authSlice.js";
import authService from "../services/authService.js";
import toast from "react-hot-toast";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      const response = await authService.login(formData);

      if (response.token && response.user) {
        dispatch(login({ token: response.token, user: response.user }));
        setFormData({ email: "", password: "" });
        toast.success("Login successful!");
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
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Neon background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -bottom-25 -right-15] h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(59,130,246,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.12)_1px,transparent_1px)] [bg-size:36px_36px]" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8">
        <div className="grid w-full max-w-6xl overflow-hidden rounded-3xl border border-cyan-500/20 bg-black/80 shadow-[0_0_40px_rgba(34,211,238,0.12)] backdrop-blur-sm lg:grid-cols-2">
          {/* Left Info Panel */}
          <div className="hidden border-r border-cyan-500/20 bg-black/70 p-10 lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="mb-10 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/40 bg-cyan-500/10 shadow-[0_0_20px_rgba(34,211,238,0.25)]">
                  <MessageCircle className="h-6 w-6 text-cyan-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-wide text-white">
                    Chattrix
                  </h1>
                  <p className="text-xs font-medium text-cyan-400/80 tracking-wide">
                    Chat with anyone, anywhere
                  </p>
                </div>
              </div>

              {/* Feature Tags */}
              <div className="mb-8 flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3.5 py-1.5 shadow-[0_0_18px_rgba(34,211,238,0.15)]">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                  <span className="text-xs font-medium text-cyan-300">
                    Secure
                  </span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3.5 py-1.5 shadow-[0_0_18px_rgba(34,211,238,0.15)]">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                  <span className="text-xs font-medium text-cyan-300">
                    Fast
                  </span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3.5 py-1.5 shadow-[0_0_18px_rgba(34,211,238,0.15)]">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                  <span className="text-xs font-medium text-cyan-300">
                    Intelligent
                  </span>
                </div>
              </div>

              <h2 className="mb-4 max-w-lg text-4xl font-bold leading-tight text-white xl:text-5xl">
                Chat with anyone,
                <br />
                <span className="text-cyan-400">anywhere, instantly.</span>
              </h2>

              <p className="max-w-md text-base leading-7 text-gray-400">
                A simple and fast messaging app. Connect with people around the
                world and chat with your own AI assistant.
              </p>

              <div className="mt-10 space-y-4">
                <div className="rounded-2xl border border-cyan-500/20 bg-white/2 p-4 shadow-[0_0_18px_rgba(34,211,238,0.06)]">
                  <div className="mb-2 flex items-center gap-3">
                    <MessageCircle className="h-5 w-5 text-cyan-400" />
                    <p className="font-semibold text-white">
                      Real-time messaging
                    </p>
                  </div>
                  <p className="text-sm text-gray-400">
                    Messages delivered instantly with smooth and responsive
                    experience.
                  </p>
                </div>

                <div className="rounded-2xl border border-cyan-500/20 bg-white/2 p-4 shadow-[0_0_18px_rgba(34,211,238,0.06)]">
                  <div className="mb-2 flex items-center gap-3">
                    <Bot className="h-5 w-5 text-cyan-400" />
                    <p className="font-semibold text-white">
                      Personal AI chatbot
                    </p>
                  </div>
                  <p className="text-sm text-gray-400">
                    Chat with your own AI assistant powered by Gemini.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 rounded-2xl border border-green-500/20 bg-green-500/5 p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 text-green-400" />
                <p className="text-sm leading-6 text-gray-300">
                  Your chats are private and secure. Only you and the person
                  you're talking to can see the messages.
                </p>
              </div>
            </div>
          </div>

          {/* Right Login Panel */}
          <div className="flex items-center justify-center p-6 sm:p-8 lg:p-12">
            <div className="w-full max-w-md">
              {/* Mobile Logo */}
              <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/40 bg-cyan-500/10 shadow-[0_0_20px_rgba(34,211,238,0.25)]">
                  <MessageCircle className="h-6 w-6 text-cyan-400" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Chattrix</h1>
                  <p className="text-xs font-medium text-cyan-400/80 tracking-wide">
                    Chat with anyone, anywhere
                  </p>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-[#050505] p-6 shadow-[0_0_30px_rgba(34,211,238,0.08)] sm:p-8">
                {/* top neon line */}
                <div className="absolute left-0 top-0 h-0.5 w-full bg-linear-to-r from-transparent via-cyan-400 to-transparent opacity-80" />

                <div className="mb-8 text-center">
                  <p className="mb-2 text-xs font-medium text-cyan-400/70 tracking-wide">
                    Welcome
                  </p>
                  <h2 className="text-3xl font-bold text-white">Sign in</h2>
                  <p className="mt-2 text-sm text-gray-400">
                    Enter your details to continue
                  </p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                  {/* Email */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                        <Mail className="h-5 w-5 text-cyan-400/70" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        onChange={handleChange}
                        value={formData.email}
                        disabled={loading}
                        placeholder="you@example.com"
                        className="block w-full rounded-2xl border border-cyan-500/20 bg-black px-4 py-3 pl-11 text-white placeholder:text-gray-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      Password
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                        <Lock className="h-5 w-5 text-cyan-400/70" />
                      </div>
                      <input
                        type="password"
                        name="password"
                        onChange={handleChange}
                        value={formData.password}
                        disabled={loading}
                        placeholder="Enter your password"
                        className="block w-full rounded-2xl border border-cyan-500/20 bg-black px-4 py-3 pl-11 text-white placeholder:text-gray-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-500/10 px-4 py-3 text-sm font-semibold text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.12)] transition-all duration-200 hover:bg-cyan-500/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-black disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? "Signing in..." : "Sign In"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </button>

                  {/* Signup Link */}
                  <div className="pt-2 text-center">
                    <p className="text-sm text-gray-400">
                      Don't have an account?{" "}
                      <Link
                        to="/signup"
                        className="font-medium text-cyan-400 transition-colors hover:text-cyan-300"
                      >
                        Create an account
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
