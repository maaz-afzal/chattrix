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
        className={`${sizeClasses[size]} bg-cyan-500/10 rounded-2xl border border-cyan-400/40 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.2)]`}
      >
        <span
          className={`text-cyan-400 font-semibold ${size === "xl" ? "text-3xl" : "text-sm"}`}
        >
          {name}
        </span>
      </div>
      {online && (
        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-black shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
      )}
    </div>
  );
};

export default Avatar;