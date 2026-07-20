import * as React from "react"

export function Card({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`rounded-2xl border border-line bg-surface shadow-[0_1px_2px_rgba(18,22,28,0.06)] ${className}`.trim()} {...props} />
}

export function CardHeader({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`border-b border-line px-6 py-5 ${className}`.trim()} {...props} />
}

export function CardTitle({ className = "", ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={`font-display text-[18px] font-semibold ${className}`.trim()} {...props} />
}

export function CardDescription({ className = "", ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={`mt-1 text-sm text-muted ${className}`.trim()} {...props} />
}

export function CardContent({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`px-6 py-6 ${className}`.trim()} {...props} />
}
