import api from "./api";

const register = async (name, email, password) => {
  try {
    const res = await api.post("/auth/register", { name, email, password });
    return res.data;
  } catch (err) {
    throw new Error(err);
  }
};

const login = async (email, password) => {
  try {
    const res = await api.post("/auth/login", { email, password });
    return res.data;
  } catch (err) {
    throw new Error(err);
  }
};

export { register, login };