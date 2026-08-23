import { useState } from "react";
import { useSelector } from "react-redux";
import { CheckCheck, Check, ChevronDown, Pencil, Reply, ArrowRight, Trash2 } from "lucide-react";
import { useSelect } from "../layout/ChatArea";

const MessageBubble = ({
  _id,
  text,
  image,
  sender,
  createdAt,
  status,
  replyTo,
  isSelectMode,
  onSelect,
  onReply,
  onDelete,
}) => {
  const currentUserId = useSelector((state) => state.auth.user?._id);
  const { selectedMessages, startEditing } = useSelect();
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
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

  const replyPreview = replyTo && (
    <div
      className="mb-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 dark:bg-black/10 border-l-3 border-[#A37CFF] min-w-0"
    >
      <div className="flex items-center gap-1.5 mb-0.5">
        <Reply className="w-3 h-3 text-[#A37CFF] shrink-0" />
        <span className="text-[10px] font-medium text-[#A37CFF]">
          Replying to {replyTo.sender?.toString() === currentUserId?.toString() ? "you" : "them"}
        </span>
      </div>
      <p className="text-[11px] text-white/80 dark:text-[#ddd] truncate">
        {replyTo.text || (replyTo.image ? "📷 Image" : "Message")}
      </p>
    </div>
  );

  const handleDeleteForMe = () => {
    onDelete?.(_id, false);
    setDeleteModalOpen(false);
    setMenuOpen(false);
  };

  const handleDeleteForEveryone = () => {
    onDelete?.(_id, true);
    setDeleteModalOpen(false);
    setMenuOpen(false);
  };

  return (
    <>
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
                      onReply?.({
                        _id,
                        text,
                        image,
                        isMe,
                        senderName: isMe ? "You" : "Them",
                      });
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-1.5 px-2.5 py-1.5 text-left text-[11px] text-[#1a1a1b] dark:text-white hover:bg-[#ececee] dark:hover:bg-[#1D1E1F] transition-colors"
                  >
                    <Reply className="w-3 h-3" />
                    Reply
                  </button>
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
                  {isMe && (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        setDeleteModalOpen(true);
                      }}
                      className="w-full flex items-center gap-1.5 px-2.5 py-1.5 text-left text-[11px] text-[#f87171] hover:bg-[#ececee] dark:hover:bg-[#1D1E1F] transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                  )}
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
            {replyPreview}

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
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-[#1D1E1F] rounded-2xl p-6 w-80 mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-[#1a1a1b] dark:text-white mb-2">Delete message</h3>
            <p className="text-[13px] text-[#8a8a8c] dark:text-[#666] mb-4">
              Choose how you want to delete this message:
            </p>
            <div className="space-y-2">
              <button
                onClick={handleDeleteForMe}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-[13px] text-[#1a1a1b] dark:text-white hover:bg-[#ececee] dark:hover:bg-[#1D1E1F] rounded-xl transition-colors"
              >
                <Trash2 className="w-4 h-4 text-[#f87171]" />
                <span>Delete for me</span>
              </button>
              <button
                onClick={handleDeleteForEveryone}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-[13px] text-[#1a1a1b] dark:text-white hover:bg-[#ececee] dark:hover:bg-[#1D1E1F] rounded-xl transition-colors"
              >
                <Trash2 className="w-4 h-4 text-[#f87171]" />
                <span>Delete for everyone</span>
              </button>
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="w-full flex items-center justify-center gap-3 px-3 py-2.5 text-[13px] text-[#8a8a8c] dark:text-[#666] hover:bg-[#ececee] dark:hover:bg-[#1D1E1F] rounded-xl transition-colors"
              >
                <span>Cancel</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MessageBubble;