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
  const res = await api.post("/message/ai", data);
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
  const res = await api.delete(`/message/${id}`);
  return res.data;
};

export { findOrCreateConversation, getMessages, aiChat, sendMessage, deleteMessage, clearChat };
