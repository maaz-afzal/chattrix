import api from "./api";

const register = async (formData) => {
  const res = await api.post("/auth/register", formData);
  return res.data;
};

const login = async (formData) => {
  const res = await api.post("/auth/login", formData);
  return res.data;
};

const checkAuth = async () => {
  const res = await api.get("/auth/check");
  return res.data;
};

const logout = async () => {
  const res = await api.post("/auth/logout");
  return res.data;
};

const deleteAccount = async () => {
  const res = await api.delete("/auth/delete");
  return res.data;
};

const changePassword = async (data) => {
  const res = await api.put("/auth/password", data);
  return res.data;
};

export { register, login, logout, checkAuth, deleteAccount, changePassword };
