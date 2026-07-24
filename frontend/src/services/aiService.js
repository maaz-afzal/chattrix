import api from "./api";

const createAIConversation = async () => {
  const res = await api.post("/ai/conversation");
  return res.data.data;
};

const sendAIMessage = async ({ conversationId, text }) => {
  const res = await api.post("/ai/message", { conversationId, text });
  return res.data.data;
};

const getAIHistory = async (conversationId) => {
  const res = await api.get(`/ai/history/${conversationId}`);
  return res.data.data;
};

const clearAIHistory = async (conversationId) => {
  const res = await api.delete(`/ai/history/${conversationId}`);
  return res.data.data;
};

export default {
  createAIConversation,
  sendAIMessage,
  getAIHistory,
  clearAIHistory,
};
