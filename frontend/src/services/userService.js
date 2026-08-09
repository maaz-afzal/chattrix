import api from "./api";

const getAllUsers = async (page = 1, limit = 20) => {
  const res = await api.get("/users", { params: { page, limit } });
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

export default { getAllUsers, searchUsers, updateProfile };
