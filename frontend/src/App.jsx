import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import { connectSocket } from "./lib/socket.js";

const App = () => {
  const { isLoggedIn, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isLoggedIn && user?._id) {
      connectSocket(user._id);
    }
  }, [isLoggedIn, user]);
  return (
    <div>
      <Toaster position="top-right" toastOptions={{ duration: 1500 }} />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
