import React, { useState } from "react";

const FilterTabs = () => {
  const [activeTab, setActiveTab] = useState("all");

  const tabs = [
    { id: "all", label: "All" },
    { id: "unread", label: "Unread" },
    { id: "groups", label: "Groups" },
  ];

  return (
    <div className="flex gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`px-3 py-1.5 text-xs font-medium rounded-full transition ${
            activeTab === tab.id
              ? "bg-linear-to-r from-indigo-500 to-purple-500 text-white shadow-md"
              : "bg-gray-700/70 text-gray-400 hover:bg-gray-700"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;
