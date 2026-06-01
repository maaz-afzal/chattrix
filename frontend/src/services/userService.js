import api from "./api";

const getAllUsers = async () => {
  try {
    const res = await api.get("/users/profiles");
    return res.data;
  } catch (err) {
    throw new Error(err);
  }
};

export { getAllUsers };
