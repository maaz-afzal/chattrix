import { useState } from "react";
import { useSelector } from "react-redux";
import {
  CheckCheck,
  Check,
  ChevronDown,
  Pencil,
  Reply,
  Trash2,
} from "lucide-react";
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
    const base = "w-3.5 h-3.5 shrink-0";
    if (status === "read")
      return <CheckCheck className={`${base} text-white`} strokeWidth={2} />;
    if (status === "delivered")
      return <CheckCheck className={`${base} text-white/55`} strokeWidth={2} />;
    if (status === "sent")
      return <Check className={`${base} text-white/55`} strokeWidth={2} />;
    return null;
  };

  const replyPreview = replyTo && (
    <div
      className={`mb-2 pl-2.5 py-0.5 border-l-2 ${
        isMe
          ? "border-white/45"
          : "border-[#2563eb]/60 dark:border-[#60a5fa]/70"
      }`}
    >
      <div className="flex items-center gap-1.5 mb-1">
        <Reply
          className={`w-3 h-3 shrink-0 ${
            isMe ? "text-white/75" : "text-[#2563eb] dark:text-[#60a5fa]"
          }`}
          strokeWidth={2}
        />
        <span
          className={`text-[10.5px] font-medium leading-none ${
            isMe ? "text-white/75" : "text-[#2563eb] dark:text-[#60a5fa]"
          }`}
        >
          {replyTo.sender?.toString() === currentUserId?.toString()
            ? "You"
            : "Them"}
        </span>
      </div>
      <p
        className={`text-[11.5px] truncate leading-snug ${
          isMe ? "text-white/70" : "text-[#7a7a7a] dark:text-[#9a9a9a]"
        }`}
      >
        {replyTo.text || (replyTo.image ? "Photo" : "Message")}
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
        className={`group flex items-end gap-2 ${
          isMe ? "justify-end" : "justify-start"
        }`}
      >
        {isSelectMode && (
          <button
            onClick={onSelect}
            aria-label="Select message"
            className={`mb-1.5 w-4.5 h-4.5 shrink-0 rounded-full border-[1.5px] flex items-center justify-center transition-colors duration-150 ${
              isSelected
                ? "border-[#2563eb] bg-[#2563eb] dark:border-[#3b82f6] dark:bg-[#3b82f6]"
                : "border-[#b0b0b0] dark:border-[#555] hover:border-[#2563eb] dark:hover:border-[#3b82f6]"
            }`}
          >
            {isSelected && (
              <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
            )}
          </button>
        )}

        <div
          className={`max-w-[82%] sm:max-w-[70%] flex ${
            isMe ? "flex-row-reverse" : "flex-row"
          } items-end gap-1.5 relative`}
        >
          <div className="relative shrink-0 mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Message options"
              className="w-6 h-6 flex items-center justify-center rounded-full text-[#8a8a8a] dark:text-[#888] hover:text-[#111] dark:hover:text-[#f0f0f0] hover:bg-black/5 dark:hover:bg-white/8 active:scale-95 transition"
            >
              <ChevronDown className="w-4 h-4" strokeWidth={1.75} />
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setMenuOpen(false)}
                />

                <div
                  className={`absolute top-full mt-1.5 w-28 rounded-lg bg-white dark:bg-[#1c1c1e] ring-1 ring-black/8 dark:ring-white/10 shadow-md dark:shadow-black/40 z-20 py-0.5 overflow-hidden ${
                    isMe ? "right-0" : "left-0"
                  }`}
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
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-left text-[11.5px] text-[#111] dark:text-[#f0f0f0] hover:bg-black/4 dark:hover:bg-white/6 transition"
                  >
                    <Reply className="w-3 h-3 shrink-0" strokeWidth={1.75} />
                    Reply
                  </button>

                  {isMe && (
                    <>
                      <button
                        onClick={() => {
                          startEditing({ _id, text });
                          setMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 text-left text-[11.5px] text-[#111] dark:text-[#f0f0f0] hover:bg-black/4 dark:hover:bg-white/6 transition"
                      >
                        <Pencil
                          className="w-3 h-3 shrink-0"
                          strokeWidth={1.75}
                        />
                        Edit
                      </button>

                      <div className="my-0.5 mx-2 h-px bg-black/6 dark:bg-white/8" />

                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          setDeleteModalOpen(true);
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 text-left text-[11.5px] text-red-500 dark:text-red-400 hover:bg-red-500/8 transition"
                      >
                        <Trash2
                          className="w-3 h-3 shrink-0"
                          strokeWidth={1.75}
                        />
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>

          <div
            className={`rounded-2xl px-3 py-1.5 ${
              isMe
                ? "bg-[#2563eb] dark:bg-[#3b82f6] text-white rounded-br-md"
                : "bg-[#f2f2f2] dark:bg-[#262626] text-[#111] dark:text-[#f0f0f0] rounded-bl-md"
            } ${
              isSelected
                ? "ring-2 ring-[#2563eb]/40 dark:ring-[#60a5fa]/50 ring-offset-2 ring-offset-[#fafafa] dark:ring-offset-[#161616]"
                : ""
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
                <p className="wrap-break-words whitespace-pre-wrap text-[13px] leading-snug flex-1 min-w-0">
                  {text}
                </p>
                <div className="flex items-center gap-1 shrink-0 pb-px">
                  <span
                    className={`text-[9.5px] ${
                      isMe
                        ? "text-white/60"
                        : "text-[#8a8a8a] dark:text-[#9a9a9a]"
                    }`}
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
                  className={`text-[9.5px] ${
                    isMe
                      ? "text-white/60"
                      : "text-[#8a8a8a] dark:text-[#9a9a9a]"
                  }`}
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
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60 px-4"
          onClick={() => setDeleteModalOpen(false)}
        >
          <div
            className="w-full max-w-85 rounded-3xl bg-white dark:bg-[#1c1c1e] ring-1 ring-black/8 dark:ring-white/10 overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 pt-5 pb-4 text-center">
              <h3 className="text-[16px] font-semibold text-[#111] dark:text-[#f0f0f0]">
                Delete message?
              </h3>
              <p className="text-[12.5px] text-[#8a8a8a] dark:text-[#a0a0a0] mt-1 leading-snug">
                This can't be undone.
              </p>
            </div>

            <div className="px-3 pb-3 flex flex-col gap-2">
              <button
                onClick={handleDeleteForEveryone}
                className="w-full px-4 py-2.5 rounded-full text-center text-[13.5px] font-medium text-red-500 dark:text-red-400 bg-red-500/8 dark:bg-red-500/12 hover:bg-red-500/[0.14] dark:hover:bg-red-500/18 active:scale-[0.98] transition-all"
              >
                Delete for everyone
              </button>

              <button
                onClick={handleDeleteForMe}
                className="w-full px-4 py-2.5 rounded-full text-center text-[13.5px] font-medium text-[#111] dark:text-[#f0f0f0] bg-black/5 dark:bg-white/8 hover:bg-black/8 dark:hover:bg-white/12 active:scale-[0.98] transition-all"
              >
                Delete for me
              </button>

              <button
                onClick={() => setDeleteModalOpen(false)}
                className="w-full px-4 py-2.5 rounded-full text-center text-[13.5px] font-medium text-[#111] dark:text-[#f0f0f0] hover:bg-black/5 dark:hover:bg-white/6 active:scale-[0.98] transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MessageBubble;
