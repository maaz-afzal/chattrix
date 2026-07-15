import api from "./api";

const register = async (formData) => {
  try {
    const res = await api.post("/api/auth/register", formData);
    return res.data;
  } catch (err) {
    throw err;
  }
};

const login = async (formData) => {
  try {
    const res = await api.post("/api/auth/login", formData);
    return res.data;
  } catch (err) {
    throw err;
  }
};

const checkAuth = async () => {
  try {
    const res = await api.post("/api/auth/check");
    return res.data;
  } catch (err) {
    throw err;
  }
};

const logout = async () => {
  try {
    const res = await api.post("/api/auth/logout");
    return res.data;
  } catch (err) {
    throw err;
  }
};

const deleteAccount = async () => {
  try {
    const res = await api.post("/api/auth/delete");
    return res.data;
  } catch (err) {
  throw err;
  }
};

const changePassword = async (data) => {
  try {
    const res = await api.post("/api/auth/password", data);
    return res.data;
  } catch (err) {
    throw err;
  }
};

export { register, login, logout, checkAuth, deleteAccount, changePassword };
