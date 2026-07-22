import { messageService } from "../services/index.js";
import { catchAsync } from "../middlewares/errorHandler.js";
import { sendResponse } from "../utils/responseHandler.js";

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
  sendResponse(res, 200, messages);
});

export const updateMessage = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const message = await messageService.updateMessage(req.user.id, id, text);
  sendResponse(res, 200, message, "Message updated");
});

export const deleteMessage = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { everyone } = req.body || {};
  await messageService.deleteMessage(req.user.id, id, everyone);
  sendResponse(res, 200, null, "Message deleted successfully");
});

export const markAsRead = catchAsync(async (req, res) => {
  const { id } = req.params;
  const message = await messageService.markAsRead(id);

  if (io) {
    io.to(message.sender.toString()).emit("message-read", id);
  }

  sendResponse(res, 200, null, "Message marked as read");
});

export const clearChat = catchAsync(async (req, res) => {
  const { conversationId } = req.params;
  await messageService.clearChat(req.user.id, conversationId);
  sendResponse(res, 200, null, "Chat cleared successfully");
});