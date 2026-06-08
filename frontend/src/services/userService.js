import api from "./api";

const getAllUsers = async () => {
  try {
    const res = await api.get("/users/profiles");
    return res.data;
  } catch (err) {
    throw err;
  }
};

const updateProfile = async (data) => {
  try {
    const res = await api.put("/users/profile", data);
    return res.data;
  } catch (err) {
    throw err;
  }
};

const deleteAccount = async () => {
  try {
    const res = await api.delete("/users/profile");
    return res.data;
  } catch (err) {
    throw err;
  }
};

export { getAllUsers, updateProfile, deleteAccount };
