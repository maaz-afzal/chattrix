import React from "react";

const IconButton = ({
  icon: Icon,
  onClick,
  size = "md",
  variant = "default",
  disabled = false,
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
    default: "bg-neutral-800/70 hover:bg-neutral-800 text-neutral-300",
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white",
    ghost: "hover:bg-neutral-800/60 text-neutral-400",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${sizeClasses[size]} ${variantClasses[variant]} rounded-xl transition focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      <Icon className={iconSizes[size]} />
    </button>
  );
};

export default IconButton;
