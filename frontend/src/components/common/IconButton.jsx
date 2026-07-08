import React from "react";

const IconButton = ({
  icon: Icon,
  onClick,
  size = "md",
  variant = "default",
  disabled = false,
  ariaLabel,
}) => {
  const sizeClasses = {
    sm: "p-1.5",
    md: "p-2",
    lg: "p-2.5",
  };

  const iconSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const variantClasses = {
    default: "bg-white/[0.02] hover:bg-cyan-500/10 text-gray-400 hover:text-cyan-400 border border-white/[0.04] hover:border-cyan-400/30",
    primary: "bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-400/30 hover:border-cyan-400/50",
    ghost: "hover:bg-cyan-500/10 text-gray-400 hover:text-cyan-400",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`${sizeClasses[size]} ${variantClasses[variant]} rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      <Icon className={iconSizes[size]} />
    </button>
  );
};

export default IconButton;