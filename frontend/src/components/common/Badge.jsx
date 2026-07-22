import React from "react";

const Badge = ({ count, variant = "default", size = "sm" }) => {
  const variants = {
    default: "bg-[#A37CFF] text-white",
    success: "bg-emerald-500 text-white",
    warning: "bg-amber-500 text-black",
    error: "bg-red-500 text-white",
  };
  const sizes = {
    sm: "min-w-[16px] h-4 px-1 text-[10px]",
    md: "min-w-[18px] h-[18px] px-1 text-[11px]",
    lg: "min-w-5 h-5 px-1.5 text-[12px]",
  };

  return (
    <>
      {count > 0 && (
        <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-[#A37CFF] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </>
  );
};

export default Badge;
