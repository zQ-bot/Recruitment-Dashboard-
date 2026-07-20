import * as React from "react"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost"
  size?: "default" | "icon"
}

export function Button({
  className = "",
  variant = "default",
  size = "default",
  ...props
}: ButtonProps) {
  const base = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
  const variants = {
    default: "bg-ink text-white hover:brightness-110",
    ghost: "bg-transparent hover:bg-line-2",
  }
  const sizes = {
    default: "px-4 py-2.5",
    icon: "h-9 w-9 p-0",
  }

  return <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`.trim()} {...props} />
}
