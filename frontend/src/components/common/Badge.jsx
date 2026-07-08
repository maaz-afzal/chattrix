import React from "react";

const Badge = ({ count, variant = "default", size = "sm" }) => {
  const variantClasses = {
    default: "bg-cyan-500/10 text-cyan-400 border border-cyan-400/40",
    success: "bg-green-500/10 text-green-400 border border-green-400/40",
    warning: "bg-yellow-500/10 text-yellow-400 border border-yellow-400/40",
    error: "bg-red-500/10 text-red-400 border border-red-400/40",
  };

  const sizeClasses = {
    sm: "min-w-4.5 h-4.5 text-[10px] px-1",
    md: "min-w-5 h-5 text-xs px-1.5",
    lg: "min-w-6 h-6 text-sm px-2",
  };

  if (count > 99) {
    return (
      <span
        className={`${sizeClasses[size]} ${variantClasses[variant]} font-bold rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(34,211,238,0.15)]`}
      >
        99+
      </span>
    );
  }

  return (
    <span
      className={`${sizeClasses[size]} ${variantClasses[variant]} font-bold rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(34,211,238,0.15)]`}
    >
      {count}
    </span>
  );
};

export default Badge;