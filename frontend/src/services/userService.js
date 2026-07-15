import api from "./api";

const getAllUsers = async () => {
  try {
    const res = await api.get("/users/profiles");
    return res.data;
  } catch (err) {
    throw err;
  }
};

const updateProfile = async (formData) => {
  try {
    const res = await api.put("/users/profile", formData);
    return res.data;
  } catch (err) {
    throw err;
  }
};

export { getAllUsers, updateProfile };
