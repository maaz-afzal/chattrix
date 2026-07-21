import React from "react";

const IconButton = ({
  icon: Icon,
  onClick,
  size = "md",
  variant = "default",
  disabled = false,
  ariaLabel,
  className = "",
}) => {
  const sizes = { sm: "w-8 h-8", md: "w-9 h-9", lg: "w-10 h-10" };
  const iconSizes = { sm: "w-4 h-4", md: "w-[18px] h-[18px]", lg: "w-5 h-5" };
  const variants = {
    default: "text-[#999] hover:text-white hover:bg-[#1D1E1F]",
    primary: "bg-[#A37CFF] text-white hover:bg-[#9370f0]",
    ghost: "text-[#666] hover:text-white hover:bg-[#1D1E1F]",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`${sizes[size]} inline-flex items-center justify-center rounded-lg transition-colors disabled:opacity-30 disabled:pointer-events-none ${variants[variant]} ${className}`}
    >
      <Icon className={iconSizes[size]} />
    </button>
  );
};

export default IconButton;
