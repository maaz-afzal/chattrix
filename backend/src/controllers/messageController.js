import messageService from "../services/messageService.js";
import { sendResponse } from "../utils/responseHandler.js";
import Conversation from "../models/Conversation.js";
import { getIo } from "../socket/socket.js";

export const sendMessage = async (req, res, next) => {
  try {
    const { conversationId, receiverId } = req.params;
    const senderId = req.user.id;
    const { text, image } = req.body;

    const message = await messageService.sendMessage(
      senderId,
      conversationId,
      receiverId,
      { text, image },
    );

    const io = getIo();
    io.to(receiverId).emit("receive-message", message);
    io.to(receiverId).emit("unread-update", { conversationId });
    io.to(senderId).emit("message-sent", message);

    sendResponse(res, 201, message, "Message sent successfully");
  } catch (err) {
    next(err);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const messages = await messageService.getMessages(
      req.user.id,
      conversationId,
    );

    const io = getIo();
    const uniqueSenders = [
      ...new Set(
        messages
          .filter((msg) => msg.sender?.toString() !== req.user.id)
          .map((msg) => msg.sender.toString()),
      ),
    ];
    uniqueSenders.forEach((senderId) => {
      io.to(senderId).emit("messages-read", conversationId);
    });

    io.to(req.user.id).emit("unread-update", { conversationId });

    sendResponse(res, 200, messages);
  } catch (err) {
    next(err);
  }
};

export const updateMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const message = await messageService.updateMessage(req.user.id, id, text);

    const conversation = await Conversation.findById(message.conversationId).select(
      "participants",
    );
    if (conversation) {
      const io = getIo();
      const participants = conversation.participants.map((p) => p.toString());
      participants.forEach((participantId) => {
        io.to(participantId).emit("message-updated", message);
      });
    }

    sendResponse(res, 200, message, "Message updated");
  } catch (err) {
    next(err);
  }
};

export const deleteMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { everyone } = req.body || {};
    await messageService.deleteMessage(req.user.id, id, everyone);

    getIo().to(req.user.id).emit("unread-update", { id });

    sendResponse(res, 200, null, "Message deleted successfully");
  } catch (err) {
    next(err);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const message = await messageService.markAsRead(req.user.id, id);

    const io = getIo();
    io.to(message.sender.toString()).emit("message-read", id);
    io.to(req.user.id).emit("unread-update", {
      conversationId: message.conversationId,
    });

    sendResponse(res, 200, null, "Message marked as read");
  } catch (err) {
    next(err);
  }
};

export const clearChat = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    await messageService.clearChat(req.user.id, conversationId);

    getIo().to(req.user.id).emit("unread-update", { conversationId });

    sendResponse(res, 200, null, "Chat cleared successfully");
  } catch (err) {
    next(err);
  }
};