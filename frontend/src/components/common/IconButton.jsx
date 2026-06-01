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
    default: "bg-gray-700/70 hover:bg-gray-700 text-gray-300",
    primary:
      "bg-gradient-to-br from-indigo-500 to-purple-500 hover:shadow-lg hover:shadow-indigo-500/30 text-white",
    ghost: "hover:bg-gray-700/60 text-gray-400",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${sizeClasses[size]} ${variantClasses[variant]} rounded-xl transition focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      <Icon className={iconSizes[size]} />
    </button>
  );
};

export default IconButton;
