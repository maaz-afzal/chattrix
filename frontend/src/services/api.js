import axios from "axios";
import { store } from "../redux/store.js";
import { logout } from "../redux/Slices/authSlice.js";
import { disconnectSocket } from "../lib/socket.js";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(logout());
      disconnectSocket();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;