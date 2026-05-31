import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  ArrowRight,
  Zap,
  MessageCircle,
  Bot,
  Send,
  CheckCircle,
} from "lucide-react";
import { login } from "../redux/Slices/authSlice.js";
import * as authService from "../services/authService.js";
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
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        dispatch(
          login({
            token: response.token,
            user: response.user,
          }),
        );
        setFormData({
          email: "",
          password: "",
        });

        toast.success("Login successful!");
        setTimeout(() => navigate("/"), 1000);
      } else {
        throw new Error("Invalid response!");
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        toast.error("Invalid email or password.");
      } else if (err.response.status === 404) {
        toast.error("Account not found.");
      } else {
        toast.error("Something went wrong. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* left panel  */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-gray-800 to-gray-900 relative flex-col justify-between p-12 border-r border-gray-700">
        <div>
          <div className="flex items-center gap-2 mb-12">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Chattrix</span>
          </div>

          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 rounded-full px-4 py-1.5 mb-6">
              <Zap className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-medium text-indigo-400">
                Lightning fast
              </span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Personal AI Chatbot
            </h1>
            <p className="text-gray-400 text-lg">
              Chat with anyone, anywhere, instantly.
              <br />
              Chat with your own AI assistant,
              <br />
              powered by Gemini.
            </p>
          </div>
        </div>

        <div className="space-y-6 mb-12">
          <div className="flex items-start gap-3">
            <Send className="w-5 h-5 text-indigo-400 mt-0.5" />
            <div>
              <p className="font-semibold text-white">
                Messages delivered instantly via
              </p>
              <p className="text-gray-400">WebSocket connections.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MessageCircle className="w-5 h-5 text-indigo-400 mt-0.5" />
            <div>
              <p className="font-semibold text-white">
                Chat with anyone, anywhere, instantly.
              </p>
              <p className="text-gray-400">Connect globally without limits.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Bot className="w-5 h-5 text-indigo-400 mt-0.5" />
            <div>
              <p className="font-semibold text-white">Personal AI Chatbot</p>
              <p className="text-gray-400">Powered by Gemini AI.</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <p className="text-sm text-gray-400">
              Private & secure — Your conversations stay between you and the
              people you trust.
            </p>
          </div>
        </div>
      </div>

      {/* right panel*/}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 bg-gray-900">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-gray-400 text-sm">
              Enter your credentials to access your account
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* email input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="email"
                  name="email"
                  onChange={handleChange}
                  value={formData.email}
                  className="block w-full pl-10 pr-4 py-2.5 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 sm:text-sm"
                  placeholder="you@example.com"
                  disabled={loading}
                />
              </div>
            </div>

            {/* password input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="password"
                  name="password"
                  onChange={handleChange}
                  value={formData.password}
                  className="block w-full pl-10 pr-4 py-2.5 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 sm:text-sm"
                  placeholder="Enter your password"
                  disabled={loading}
                />
              </div>
            </div>

            {/* signin button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-all duration-200 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>

            {/* link to signup */}
            <div className="text-center pt-4">
              <p className="text-sm text-gray-400">
                Don't have an account?{" "}
                <a
                  href="/signup"
                  className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Create an account
                </a>
              </p>
            </div>

            <div className="text-center">
              <a
                href="/"
                className="text-sm text-gray-500 hover:text-gray-400 transition-colors"
                onClick={(e) => e.preventDefault()}
              >
                ← Back to home
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
