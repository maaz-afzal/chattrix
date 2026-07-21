import React, { useState } from "react";

const Avatar = ({ name, profileImage, size = "md", online = false }) => {
  const [imgError, setImgError] = useState(false);

  const sizes = {
    sm: "w-9 h-9 text-[12px]",
    md: "w-10 h-10 text-[13px]",
    lg: "w-12 h-12 text-[15px]",
    xl: "w-20 h-20 text-[24px]",
  };

  const palettes = [
    "bg-[#2a2352] text-[#A37CFF]",
    "bg-[#1e3a2e] text-[#6ee7b7]",
    "bg-[#3a2a1e] text-[#fbbf24]",
    "bg-[#352028] text-[#fda4af]",
    "bg-[#1e2e3a] text-[#93c5fd]",
    "bg-[#352e1e] text-[#fcd34d]",
  ];

  const index = name ? name.charCodeAt(0) % palettes.length : 0;
  const showImage = profileImage && !imgError;

  return (
    <div className="relative shrink-0">
      {showImage ? (
        <div
          className={`${sizes[size]} overflow-hidden rounded-full bg-[#1D1E1F]`}
        >
          <img
            src={profileImage}
            alt={name || "Avatar"}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        </div>
      ) : (
        <div
          className={`${sizes[size]} rounded-full flex items-center justify-center font-semibold ${palettes[index]}`}
        >
          {name?.charAt(0)?.toUpperCase() || "U"}
        </div>
      )}
      {online && (
        <span className="absolute -bottom-0.5 -right-0.5 w-[10px] h-[10px] rounded-full bg-emerald-500 border-2 border-[#161616]" />
      )}
    </div>
  );
};

export default Avatar;
