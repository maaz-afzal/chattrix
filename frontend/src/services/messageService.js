import api from "./api";

const sendMessage = async (conversationId, receiverId, data) => {
  const res = await api.post(`/messages/${conversationId}/${receiverId}`, data);
  return res.data.data;
};

const getMessages = async (conversationId) => {
  const res = await api.get(`/messages/${conversationId}`);
  return res.data.data;
};

const deleteMessage = async (id) => {
  const res = await api.delete(`/messages/${id}`);
  return res.data.data;
};

const updateMessage = async (id, data) => {
  const res = await api.put(`/messages/${id}`, data);
  return res.data.data;
};

const clearChat = async (conversationId) => {
  const res = await api.delete(`/messages/clear/${conversationId}`);
  return res.data.data;
};

const markAsRead = async (id) => {
  const res = await api.patch(`/messages/${id}/read`);
  return res.data.data;
};

export default {
  getMessages,
  sendMessage,
  deleteMessage,
  updateMessage,
  markAsRead,
  clearChat,
};
