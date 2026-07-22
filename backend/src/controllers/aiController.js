import { aiService } from "../services/index.js";
import { catchAsync } from "../middlewares/errorHandler.js";
import { sendResponse } from "../utils/responseHandler.js";

export const createAIConversation = catchAsync(async (req, res) => {
  const conversation = await aiService.createAIConversation(req.user.id);
  sendResponse(res, 200, { conversation });
});

export const sendAIMessage = catchAsync(async (req, res) => {
  const { conversationId, text } = req.body;
  const aiMessage = await aiService.sendAIMessage(
    req.user.id,
    conversationId,
    text,
  );
  sendResponse(res, 200, { msg: "AI response generated", reply: aiMessage });
});

export const getAIHistory = catchAsync(async (req, res) => {
  const { conversationId } = req.params;
  const messages = await aiService.getAIHistory(conversationId);
  sendResponse(res, 200, messages);
});

export const clearAIHistory = catchAsync(async (req, res) => {
  const { conversationId } = req.params;
  await aiService.clearAIHistory(conversationId);
  sendResponse(res, 200, null, "AI history cleared");
});