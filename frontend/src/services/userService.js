import api from "./api";

const getAllUsers = async () => {
  const res = await api.get("/users");
  return res.data;
};

const getCurrentUser = async () => {
  const res = await api.get("/users/me");
  return res.data;
};

const getUserById = async (id) => {
  const res = await api.get(`/users/${id}`);
  return res.data;
};

const searchUsers = async (query) => {
  const res = await api.get("/users/search", { params: { query } });
  return res.data;
};

const updateProfile = async (formData) => {
  const res = await api.put("/users/update", formData);
  return res.data;
};

export { getAllUsers, getCurrentUser, getUserById, searchUsers, updateProfile };
