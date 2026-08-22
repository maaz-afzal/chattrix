import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home/HomePage.jsx";
import LoginPage from "./pages/Auth/LoginPage.jsx";
import SignupPage from "./pages/Auth/SignupPage.jsx";
import ProfilePage from "./pages/Profile/ProfilePage.jsx";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";
import { Toaster } from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { connectSocket, disconnectSocket } from "./lib/socket.js";
import {
  setTyping,
  clearTyping,
  bumpListRefresh,
  addOnlineUser,
  removeOnlineUser,
  setLastSeen,
} from "./redux/Slices/userSlice.js";

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
    };

    const handleOffline = ({ userId, lastSeen }) => {
      dispatch(removeOnlineUser(userId));
      if (lastSeen) dispatch(setLastSeen({ userId, lastSeen }));
    };

    const handleTyping = (data) => dispatch(setTyping(data.userId));
    const handleStopTyping = (data) => dispatch(clearTyping(data.userId));

    const handleUserUpdated = () => dispatch(bumpListRefresh());

    socket.on("user-online", handleOnline);
    socket.on("user-offline", handleOffline);
    socket.on("user-typing", handleTyping);
    socket.on("user-stop-typing", handleStopTyping);
    socket.on("user-updated", handleUserUpdated);

    return () => {
      socket.off("user-online", handleOnline);
      socket.off("user-offline", handleOffline);
      socket.off("user-typing", handleTyping);
      socket.off("user-stop-typing", handleStopTyping);
      socket.off("user-updated", handleUserUpdated);
      disconnectSocket();
    };
  }, [isLoggedIn, token, dispatch]);

  return (
    <div>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2500,
          style: {
            background: "#363636",
            color: "#fff",
          },
        }}
      />
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
