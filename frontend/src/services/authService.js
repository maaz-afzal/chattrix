import api from "./api";

const register = async (formData) => {
  try {
    const res = await api.post("/auth/register", formData);
    return res.data;
  } catch (err) {
    throw err;
  }
};

const login = async (formData) => {
  try {
    const res = await api.post("/auth/login", formData);
    return res.data;
  } catch (err) {
    throw err;
  }
};

export { register, login };