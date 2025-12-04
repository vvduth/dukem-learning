/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";

const Button = ({
  children,
  onClick,
  type = "button" as React.ButtonHTMLAttributes<HTMLButtonElement>["type"],
  disable = false,
  className = "",
  variant = "primary",
  size = "md",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
  disable?: boolean;
  className?: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
}) => {
  const baseStyles = `inline-flex items-center justify-center gap-2 font-semibold 
    rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 
    disabled:cursor-not-allowed disabled:active:scale-100 whitespace-nowrap`;

  const variantsStyles = {
    primary: "bg-violet-600 text-white hover:bg-violet-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    outline: "border border-gray-300 text-gray-800 hover:bg-gray-100",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-3 text-lg",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disable}
      className={`${baseStyles} ${variantsStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
