import React, { useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";

const AppearanceSection = () => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "system",
  );

  const handleThemeChange = (t) => {
    setTheme(t);
    localStorage.setItem("theme", t);
    if (t === "dark") document.documentElement.classList.add("dark");
    else if (t === "light") document.documentElement.classList.remove("dark");
    else {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches)
        document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
    }
  };

  return (
    <section className="rounded-2xl border border-[#2E2E2F] bg-[#161616] overflow-hidden">
      <div className="px-5 py-4 border-b border-[#2E2E2F]">
        <h2 className="text-[13px] font-semibold text-white">Appearance</h2>
      </div>
      <div className="p-4 grid grid-cols-3 gap-2">
        {[
          { k: "light", I: Sun, l: "Light" },
          { k: "dark", I: Moon, l: "Dark" },
          { k: "system", I: Monitor, l: "System" },
        ].map(({ k, I, l }) => (
          <button
            key={k}
            onClick={() => handleThemeChange(k)}
            className={`flex flex-col items-center gap-2 py-3 rounded-xl transition-colors ${theme === k ? "bg-[#A37CFF]/10 ring-1 ring-[#A37CFF]/30" : "bg-[#1D1E1F] hover:bg-[#2E2E2F]"}`}
          >
            <I
              className={`w-5 h-5 ${theme === k ? "text-[#A37CFF]" : "text-[#666]"}`}
            />
            <span
              className={`text-[11px] font-medium ${theme === k ? "text-[#A37CFF]" : "text-[#999]"}`}
            >
              {l}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default AppearanceSection;
