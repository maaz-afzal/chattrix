import aiService from "../services/aiService.js";
import { sendResponse } from "../utils/responseHandler.js";
import { getIo } from "../socket/socket.js";

export const createAIConversation = async (req, res, next) => {
  try {
    const conversation = await aiService.createAIConversation(req.user.id);
    sendResponse(res, 200, { conversation });
  } catch (err) {
    next(err);
  }
};

export const sendAIMessage = async (req, res, next) => {
  try {
    const { conversationId, text } = req.body;
    const aiMessage = await aiService.sendAIMessage(
      req.user.id,
      conversationId,
      text,
    );

    getIo().to(req.user.id).emit("ai-message", { conversationId });

    sendResponse(res, 200, { msg: "AI response generated", reply: aiMessage });
  } catch (err) {
    next(err);
  }
};

export const getAIHistory = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const messages = await aiService.getAIHistory(req.user.id, conversationId);
    sendResponse(res, 200, messages);
  } catch (err) {
    next(err);
  }
};

export const clearAIHistory = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    await aiService.clearAIHistory(req.user.id, conversationId);
    sendResponse(res, 200, null, "AI history cleared");
  } catch (err) {
    next(err);
  }
};