import React from "react";

const Badge = ({ count, variant = "default", size = "sm" }) => {
  const variantClasses = {
    default: "bg-purple-500 text-white",
    success: "bg-green-500 text-white",
    warning: "bg-yellow-500 text-white",
    error: "bg-red-500 text-white",
  };

  const sizeClasses = {
    sm: "min-w-4.5 h-4.5 text-[10px] px-1",
    md: "min-w-5 h-5 text-xs px-1.5",
    lg: "min-w-6 h-6 text-sm px-2",
  };

  if (count > 99) {
    return (
      <span
        className={`${sizeClasses[size]} ${variantClasses[variant]} font-bold rounded-full flex items-center justify-center`}
      >
        99+
      </span>
    );
  }

  return (
    <span
      className={`${sizeClasses[size]} ${variantClasses[variant]} font-bold rounded-full flex items-center justify-center`}
    >
      {count}
    </span>
  );
};

export default Badge;
