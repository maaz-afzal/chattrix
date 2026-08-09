import messageService from "../services/messageService.js";
import { catchAsync } from "../middlewares/errorHandler.js";
import { sendResponse } from "../utils/responseHandler.js";
import Conversation from "../models/Conversation.js";

let io;

export const setIo = (socketIo) => {
  io = socketIo;
};

export const sendMessage = catchAsync(async (req, res) => {
  const { conversationId, receiverId } = req.params;
  const senderId = req.user.id;
  const { text, image } = req.body;

  const message = await messageService.sendMessage(
    senderId,
    conversationId,
    receiverId,
    { text, image },
  );

  if (io) {
    io.to(receiverId).emit("receive-message", message);
    io.to(receiverId).emit("unread-update", { conversationId });
    io.to(senderId).emit("message-sent", message);
  }

  sendResponse(res, 201, message, "Message sent successfully");
});

export const getMessages = catchAsync(async (req, res) => {
  const { conversationId } = req.params;
  const messages = await messageService.getMessages(
    req.user.id,
    conversationId,
  );

  if (io) {
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
  }

  sendResponse(res, 200, messages);
});

export const updateMessage = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const message = await messageService.updateMessage(req.user.id, id, text);

  if (io) {
    const conversation = await Conversation.findById(message.conversationId).select(
      "participants",
    );
    if (conversation) {
      const participants = conversation.participants.map((p) =>
        p.toString(),
      );
      participants.forEach((participantId) => {
        io.to(participantId).emit("message-updated", message);
      });
    }
  }

  sendResponse(res, 200, message, "Message updated");
});

export const deleteMessage = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { everyone } = req.body || {};
  await messageService.deleteMessage(req.user.id, id, everyone);

  if (io) {
    io.to(req.user.id).emit("unread-update", { id });
  }

  sendResponse(res, 200, null, "Message deleted successfully");
});

export const markAsRead = catchAsync(async (req, res) => {
  const { id } = req.params;
  const message = await messageService.markAsRead(req.user.id, id);

  if (io) {
    io.to(message.sender.toString()).emit("message-read", id);
    io.to(req.user.id).emit("unread-update", {
      conversationId: message.conversationId,
    });
  }

  sendResponse(res, 200, null, "Message marked as read");
});

export const clearChat = catchAsync(async (req, res) => {
  const { conversationId } = req.params;
  await messageService.clearChat(req.user.id, conversationId);

  if (io) {
    io.to(req.user.id).emit("unread-update", { conversationId });
  }

  sendResponse(res, 200, null, "Chat cleared successfully");
});