import api from "./api";

const getAllUsers = async () => {
  const res = await api.get("/users");
  return res.data.data;
};

const getCurrentUser = async () => {
  const res = await api.get("/users/me");
  return res.data.data;
};

const getUserById = async (id) => {
  const res = await api.get(`/users/${id}`);
  return res.data.data;
};

const searchUsers = async (query) => {
  const res = await api.get("/users/search", { params: { query } });
  return res.data.data;
};

const updateProfile = async (formData) => {
  const res = await api.put("/users/update", formData);
  return res.data.data;
};

export default { getAllUsers, getCurrentUser, getUserById, searchUsers, updateProfile };
