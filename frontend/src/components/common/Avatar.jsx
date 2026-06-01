import React from "react";

const Avatar = ({ name, size = "md", online = false }) => {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-24 h-24 text-3xl",
  };

  return (
    <div className="relative">
      <div
        className={`${sizeClasses[size]} bg-linear-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow`}
      >
        <span
          className={`text-white font-semibold ${size === "xl" ? "text-3xl" : "text-sm"}`}
        >
          {name}
        </span>
      </div>
      {online && (
        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800" />
      )}
    </div>
  );
};

export default Avatar;
