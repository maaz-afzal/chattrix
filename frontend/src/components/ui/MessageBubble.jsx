import React from "react";
import { useSelector } from "react-redux";
import { CheckCheck, Check } from "lucide-react";
import { useSelect } from "../layout/ChatArea";

const MessageBubble = ({
  _id,
  text,
  image,
  sender,
  createdAt,
  status,
  isSelectMode,
  onSelect,
}) => {
  const currentUserId = useSelector((state) => state.auth.user?._id);
  const { selectedMessages } = useSelect();

  const isMe = sender?.toString() === currentUserId?.toString();
  const isSelected = selectedMessages.includes(_id);

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
    <div
      className={`flex ${isMe ? "justify-end" : "justify-start"} items-start gap-2`}
    >
      {/* Checkbox in select mode */}
      {isSelectMode && (
        <button
          onClick={onSelect}
          aria-label={isSelected ? "Deselect message" : "Select message"}
          className={`mt-2 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
            isSelected
              ? "bg-blue-500 border-blue-500"
              : "border-neutral-500 hover:border-blue-400"
          }`}
        >
          {isSelected && <Check className="w-3 h-3 text-white" />}
        </button>
      )}

      <div className="max-w-[75%] space-y-1">
        {/* Image */}
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

        {/* Text */}
        {text && (
          <div
            className={`rounded-2xl px-4 py-2.5 ${
              isMe
                ? "bg-indigo-600 rounded-br-sm text-white"
                : "bg-neutral-800 rounded-bl-sm text-neutral-200"
            }`}
          >
            <p className="text-sm whitespace-pre-wrap wrap-break-words">{text}</p>
          </div>
        )}

        {/* Time & status */}
        <div
          className={`flex items-center gap-1 text-xs text-neutral-500 ${
            isMe ? "justify-end" : "justify-start"
          }`}
        >
          <span>{formatTime(createdAt)}</span>
          {renderStatus()}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
