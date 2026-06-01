import React from "react";
import { Search } from "lucide-react";

const SearchBar = () => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
      <input
        type="text"
        placeholder="Search..."
        className="w-full pl-10 pr-4 py-2.5 bg-gray-700/70 rounded-2xl text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm border border-gray-600/60"
      />
    </div>
  );
};

export default SearchBar;
