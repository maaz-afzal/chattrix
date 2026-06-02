import api from "./api";

const getConversation = async (id) => {
  try {
    const res = await api.get(`/message/${id}`);
    return res.data;
  } catch (err) {
    throw err;
  }
};

const sendMessage = async (id, data) => {
  try {
    const res = await api.post(`/message/${id}`, data);
    return res.data;
  } catch (err) {
    throw err;
  }
};

const deleteMessage = async (id) => {
  try {
    const res = await api.delete(`/message/${id}`);
    return res.data;
  } catch (err) {
    throw err;
  }
};

export { getConversation, sendMessage, deleteMessage };
