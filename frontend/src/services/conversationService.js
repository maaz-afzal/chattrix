import api from "./api";

const findOrCreateConversation = async (receiverId) => {
  const res = await api.post("/conversations", { receiverId });
  return res.data;
};

const getConversations = async () => {
  const res = await api.get("/conversations");
  return res.data;
};

const getConversationById = async (id) => {
  const res = await api.get(`/conversations/${id}`);
  return res.data;
};

const deleteConversation = async (id) => {
  const res = await api.delete(`/conversations/${id}`);
  return res.data;
};

export default { findOrCreateConversation, getConversations, getConversationById, deleteConversation };
