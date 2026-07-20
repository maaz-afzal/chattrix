import api from "./api";

const findOrCreateConversation = async (receiverId) => {
  const res = await api.post("/conversations", { receiverId });
  return res.data;
};

const getMessages = async (conversationId) => {
  const res = await api.get(`/messages/${conversationId}`);
  return res.data;
};

const aiChat = async (data) => {
  const res = await api.post("/ai/message", data);
  return res.data;
};

const sendMessage = async (conversationId, receiverId, data) => {
  const res = await api.post(`/messages/${conversationId}/${receiverId}`, data);
  return res.data;
};

const clearChat = async (conversationId) => {
  const res = await api.delete(`/messages/clear/${conversationId}`);
  return res.data;
};

const deleteMessage = async (id) => {
  const res = await api.delete(`/messages/${id}`);
  return res.data;
};

const updateMessage = async (id, data) => {
  const res = await api.put(`/messages/${id}`, data);
  return res.data;
};

const markAsRead = async (id) => {
  const res = await api.patch(`/messages/${id}/read`);
  return res.data;
};

export { findOrCreateConversation, getMessages, aiChat, sendMessage, deleteMessage, updateMessage, markAsRead, clearChat };
