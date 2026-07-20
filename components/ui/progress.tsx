import * as React from "react"

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
}

export function Progress({ value = 0, className = "", ...props }: ProgressProps) {
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-line-2 ${className}`.trim()} {...props}>
      <div className="h-full rounded-full bg-ai transition-all" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  )
}
