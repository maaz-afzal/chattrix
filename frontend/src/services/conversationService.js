import api from "./api";

// create conversation
const createConversation = async (receiverId) => {
  const res = await api.post("/conversations", { receiverId });
  return res.data;
};

// get all conversations
const getConversations = async () => {
  const res = await api.get("/conversations");
  return res.data;
};

// get specific conversation
const getConversationById = async (id) => {
  const res = await api.get(`/conversations/${id}`);
  return res.data;
};

const deleteConversation = async (id) => {
  const res = await api.delete(`/conversations/${id}`);
  return res.data;
};


export default {createConversation, getConversations, getConversationById, deleteConversation}