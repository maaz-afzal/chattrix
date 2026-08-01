import React from "react";

const FilterTabs = ({ active = "all", onChange }) => {
  const tabs = [
    { key: "all", label: "All" },
    { key: "unread", label: "Unread" },
    { key: "online", label: "Online" },
  ];

  return (
    <div className="flex items-center gap-1.5">
      {tabs.map(({ key, label }) => (
        <span
          key={key}
          onClick={() => onChange && onChange(key)}
          className={`px-3 py-1 rounded-full text-[11px] cursor-pointer transition-colors ${
            active === key
              ? "bg-[#A37CFF]/15 text-[#A37CFF] font-semibold"
              : "text-[#8a8a8c] dark:text-[#666] font-medium hover:bg-[#ececee] dark:hover:bg-[#1D1E1F]"
          }`}
        >
          {label}
        </span>
      ))}
    </div>
  );
};

export default FilterTabs;
