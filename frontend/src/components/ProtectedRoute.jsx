import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, token, user } = useSelector((state) => state.auth);

  const localToken = localStorage.getItem("token");
  const localUser = localStorage.getItem("user");
  const isAuthenticated =
    isLoggedIn || (localToken && localToken !== "undefined");

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
