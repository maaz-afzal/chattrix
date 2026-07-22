import { conversationService } from "../services/index.js";
import { catchAsync } from "../middlewares/errorHandler.js";
import { sendResponse } from "../utils/responseHandler.js";

export const findOrCreateConversation = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { receiverId } = req.body;
  const conversation = await conversationService.findOrCreateConversation(
    userId,
    receiverId,
  );
  sendResponse(res, 200, { conversation });
});

export const getConversations = catchAsync(async (req, res) => {
  const conversations = await conversationService.getConversations(req.user.id);
  sendResponse(res, 200, conversations);
});

export const getConversationById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const conversation = await conversationService.getConversationById(
    req.user.id,
    id,
  );
  sendResponse(res, 200, conversation);
});

export const deleteConversation = catchAsync(async (req, res) => {
  const { id } = req.params;
  await conversationService.deleteConversation(req.user.id, id);
  sendResponse(res, 200, null, "Conversation deleted");
});