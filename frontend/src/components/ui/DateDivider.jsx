import React from "react";

const DateDivider = ({ date }) => {
  return (
    <div className="flex justify-center">
      <span className="px-4 py-1 bg-neutral-800/70 rounded-full text-xs text-neutral-400">
        {date}
      </span>
    </div>
  );
};

export default DateDivider;
