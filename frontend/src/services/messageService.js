import api from "./api";

const getConversation = async (id) => {
  try {
    const res = await api.get(`/message/${id}`);
    return res.data;
  } catch (err) {
    throw err;
  }
};

const aiChat = async (data) => {
  try {
    const res = await api.post("/message/ai", data);
    return res.data;
  } catch (err) {
    throw err;
  }
}

const sendMessage = async (id, data) => {
  try {
    const res = await api.post(`/message/${id}`, data);
    return res.data;
  } catch (err) {
    throw err;
  }
};

const clearChat = async (id) => {
  try {
    const res = await api.delete(`/message/clear/${id}`);
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

export { aiChat, getConversation, sendMessage, deleteMessage, clearChat };
