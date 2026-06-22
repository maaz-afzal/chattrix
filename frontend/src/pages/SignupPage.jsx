import React, { useState } from "react";
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  Zap,
  MessageCircle,
  Bot,
  Send,
  CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import * as authService from "../services/authService.js";
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
        setTimeout(() => navigate("/"), 1000);
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
    <div className="min-h-screen bg-gray-900 flex">
      {/* left panel */}
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
              Join the Conversation
            </h1>
            <p className="text-gray-400 text-lg">
              Create your account and start
              <br />
              connecting with people around
              <br />
              the world instantly.
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
              <p className="text-gray-400">Global real-time messaging.</p>
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

      {/* right panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 bg-gray-900">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              Create an account
            </h2>
            <p className="text-gray-400 text-sm">
              Fill in the details below to get started
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* name input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-4 py-2.5 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 sm:text-sm"
                  placeholder="John Doe"
                />
              </div>
            </div>

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
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-4 py-2.5 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 sm:text-sm"
                  placeholder="you@example.com"
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
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-4 py-2.5 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 sm:text-sm"
                  placeholder="Create a password"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Min. 6 characters</p>
            </div>

            {/* create account button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-all duration-200 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Create Account"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>

            {/* login link */}
            <div className="text-center pt-4">
              <p className="text-sm text-gray-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
