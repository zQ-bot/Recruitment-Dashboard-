import * as React from "react"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      className={`w-full rounded-md border border-line bg-surface px-3 py-2.5 text-sm text-foreground placeholder:text-faint focus:border-ai focus:outline-none ${className}`.trim()}
      {...props}
    />
  )
}
