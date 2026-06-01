import React from "react";

const DateDivider = ({ date }) => {
  return (
    <div className="flex justify-center">
      <span className="px-4 py-1 bg-gray-700/70 rounded-full text-xs text-gray-400">
        {date}
      </span>
    </div>
  );
};

export default DateDivider;
