import { useState } from "react";
import { useSelector } from "react-redux";
import { CheckCheck, Check, ChevronDown, Pencil } from "lucide-react";
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
  const { selectedMessages, startEditing } = useSelect();
  const [menuOpen, setMenuOpen] = useState(false);
  const isMe = sender?.toString() === currentUserId?.toString();
  const isSelected = selectedMessages.includes(_id);

  const formatTime = (d) => {
    if (!d) return "";
    return new Date(d).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderStatus = () => {
    if (!isMe) return null;
    if (status === "read")
      return <CheckCheck className="w-3 h-3 text-[#A37CFF]" />;
    if (status === "delivered")
      return <CheckCheck className="w-3 h-3 text-white/50" />;
    if (status === "sent")
      return <Check className="w-3 h-3 text-white/50" />;
    return null;
  };

  return (
    <div
      className={`group flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"}`}
    >
      {isSelectMode && (
        <button
          onClick={onSelect}
          className={`mb-1 w-4 h-4 shrink-0 rounded-full border-[1.5px] flex items-center justify-center transition-colors ${
            isSelected
              ? "border-[#A37CFF] bg-[#A37CFF]"
              : "border-[#9a9a9c] dark:border-[#555] hover:border-[#A37CFF]"
          }`}
        >
          {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
        </button>
      )}

      <div
        className={`max-w-[82%] sm:max-w-[70%] flex ${isMe ? "flex-row-reverse" : "flex-row"} items-end gap-1.5 relative`}
      >
        {isMe && (
          <div className="relative shrink-0 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="p-1 rounded-lg text-[#8a8a8c] dark:text-[#666] hover:text-[#1a1a1b] dark:hover:text-white"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
            {menuOpen && (
              <div
                className="absolute top-full mt-0 right-4 w-24 rounded-xl bg-white dark:bg-[#222] border border-[#e2e2e4] dark:border-[#333] shadow-lg z-20 py-0.3 overflow-hidden"
              >
                <button
                  onClick={() => {
                    startEditing({
                      _id,
                      text,
                    });
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-1.5 px-2.5 py-1.5 text-left text-[11px] text-[#1a1a1b] dark:text-white hover:bg-[#ececee] dark:hover:bg-[#1D1E1F] transition-colors"
                >
                  <Pencil className="w-3 h-3" />
                  Edit
                </button>
              </div>
            )}
          </div>
        )}

        <div
          className={`rounded-2xl px-3 py-1.5 ${
            isMe
              ? "bg-[#144D37] text-white rounded-br-sm"
              : "bg-[#ececee] dark:bg-[#1D1E1F] text-[#1a1a1b] dark:text-[#eee] rounded-bl-sm"
          }`}
        >
          {image && (
            <div className={text ? "mb-1.5" : ""}>
              <img
                src={image}
                alt="Attachment"
                className="max-h-60 max-w-full cursor-pointer rounded-xl object-cover"
                onClick={() => window.open(image, "_blank")}
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
          )}

          {text && (
            <div className="flex items-end gap-2">
              <p className="break-words whitespace-pre-wrap text-[13px] leading-[1.45] flex-1 min-w-0">
                {text}
              </p>
              <div className="flex items-center gap-1 shrink-0 pb-px">
                <span
                  className={`text-[10px] ${isMe ? "text-white/50" : "text-[#8a8a8c] dark:text-[#666]"}`}
                >
                  {formatTime(createdAt)}
                </span>
                {renderStatus()}
              </div>
            </div>
          )}

          {image && !text && (
            <div className="flex items-center gap-1 justify-end mt-1">
              <span
                className={`text-[10px] ${isMe ? "text-white/50" : "text-[#8a8a8c] dark:text-[#666]"}`}
              >
                {formatTime(createdAt)}
              </span>
              {renderStatus()}
            </div>
          )}
        </div>
        </div>
    </div>
  );
};

export default MessageBubble;