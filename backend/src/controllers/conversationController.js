import conversationService from "../services/conversationService.js";
import { sendResponse } from "../utils/responseHandler.js";

export const findOrCreateConversation = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { receiverId } = req.body;
    const conversation = await conversationService.findOrCreateConversation(
      userId,
      receiverId,
    );
    sendResponse(res, 200, { conversation });
  } catch (err) {
    next(err);
  }
};

export const getConversations = async (req, res, next) => {
  try {
    const conversations = await conversationService.getConversations(req.user.id);
    sendResponse(res, 200, conversations);
  } catch (err) {
    next(err);
  }
};

export const getConversationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const conversation = await conversationService.getConversationById(
      req.user.id,
      id,
    );
    sendResponse(res, 200, conversation);
  } catch (err) {
    next(err);
  }
};

export const deleteConversation = async (req, res, next) => {
  try {
    const { id } = req.params;
    await conversationService.deleteConversation(req.user.id, id);
    sendResponse(res, 200, null, "Conversation deleted");
  } catch (err) {
    next(err);
  }
};