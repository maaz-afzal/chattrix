import React from "react";

const FilterTabs = () => {
  return (
    <div className="flex items-center gap-1.5">
      <span className="px-3 py-1 rounded-full bg-[#A37CFF]/15 text-[#A37CFF] text-[11px] font-semibold cursor-pointer">
        All
      </span>
      <span className="px-3 py-1 rounded-full text-[#666] text-[11px] font-medium hover:bg-[#1D1E1F] cursor-pointer transition-colors">
        Unread
      </span>
      <span className="px-3 py-1 rounded-full text-[#666] text-[11px] font-medium hover:bg-[#1D1E1F] cursor-pointer transition-colors">
        Online
      </span>
    </div>
  );
};

export default FilterTabs;
