export const formatLastSeen = (lastSeen) => {
  if (!lastSeen) return "";

  const diff = (Date.now() - new Date(lastSeen)) / 1000;

  if (diff < 30) return "Just now";

  const minutes = Math.floor(diff / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;

  return new Date(lastSeen).toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });
};
