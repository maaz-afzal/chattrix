import React from "react";
import { useSelector } from "react-redux";
import { CheckCheck } from "lucide-react";

const MessageBubble = ({ text, image, sender, createdAt, status }) => {
  const currentUserId = useSelector((state) => state.auth.user?._id);
  const isMe = sender === currentUserId;

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const renderStatus = () => {
    if (!isMe) return null;
    if (status === "read") {
      return <CheckCheck className="w-3 h-3 text-blue-400" />;
    }
    if (status === "sent" || status === "delivered") {
      return <CheckCheck className="w-3 h-3 text-neutral-500" />;
    }
    return null;
  };

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div className="max-w-[75%] space-y-1">
        {/* Image Preview */}
        {image && (
          <div className="overflow-hidden rounded-2xl">
            <img
              src={image}
              alt="Message attachment"
              className="max-w-full max-h-64 object-cover cursor-pointer rounded-2xl"
              onClick={() => window.open(image, "_blank")}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
        )}

        {/* Text Message */}
        {text && (
          <div
            className={`rounded-3xl px-4 py-2.5 ${
              isMe
                ? "bg-indigo-600 rounded-br-lg shadow-md"
                : "bg-neutral-800 rounded-bl-lg shadow-sm"
            }`}
          >
            <p
              className={
                isMe ? "text-white text-sm" : "text-neutral-200 text-sm"
              }
            >
              {text}
            </p>
          </div>
        )}

        {/* Time & Status */}
        <div
          className={`flex items-center gap-1 text-xs text-neutral-500 ${isMe ? "justify-end" : "justify-start"}`}
        >
          <span>{formatTime(createdAt)}</span>
          {renderStatus()}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
