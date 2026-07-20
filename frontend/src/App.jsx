import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { connectSocket, disconnectSocket, getSocket } from "./lib/socket.js";
import { addOnlineUser, removeOnlineUser, updateUserStatus, setTyping, clearTyping } from "./redux/Slices/userSlice.js";

const App = () => {
  const dispatch = useDispatch();
  const { isLoggedIn, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isLoggedIn || !token) {
      disconnectSocket();
      return;
    }

    const socket = connectSocket(token);
    if (!socket) return;

    const handleOnline = (userId) => {
      dispatch(addOnlineUser(userId));
      dispatch(updateUserStatus({ userId, isOnline: true }));
    };

    const handleOffline = ({ userId, lastSeen }) => {
      dispatch(removeOnlineUser(userId));
      dispatch(updateUserStatus({ userId, isOnline: false }));
    };

    socket.on("user-online", handleOnline);
    socket.on("user-offline", handleOffline);

    const handleTyping = (data) => dispatch(setTyping(data.userId));
    const handleStopTyping = (data) => dispatch(clearTyping(data.userId));

    socket.on("user-typing", handleTyping);
    socket.on("user-stop-typing", handleStopTyping);

    return () => {
      socket.off("user-online", handleOnline);
      socket.off("user-offline", handleOffline);
      socket.off("user-typing", handleTyping);
      socket.off("user-stop-typing", handleStopTyping);
      disconnectSocket();
    };
  }, [isLoggedIn, token, dispatch]);

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
