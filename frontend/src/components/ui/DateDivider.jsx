import React from "react";

const DateDivider = ({ date }) => {
  return (
    <div className="flex justify-center">
      <span className="px-4 py-1 bg-white/2 rounded-full text-xs text-gray-500 border border-cyan-500/20 shadow-[0_0_8px_rgba(34,211,238,0.06)]">
        {date}
      </span>
    </div>
  );
};

export default DateDivider;
