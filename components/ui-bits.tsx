import type { ReactNode } from "react"
import { ShieldCheck, Scale } from "lucide-react"
import { type Bias, type ScoreTone, toneClasses } from "@/lib/data"

type BadgeTone = "ai" | "success" | "warn" | "danger" | "neutral"

const badgeToneClasses: Record<BadgeTone, string> = {
  ai: "bg-ai-tint text-ai",
  success: "bg-success-tint text-success",
  warn: "bg-warn-tint text-warn",
  danger: "bg-danger-tint text-danger",
  neutral: "bg-line-2 text-muted",
}

export function Badge({
  tone = "neutral",
  children,
  className = "",
}: {
  tone?: BadgeTone
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap ${badgeToneClasses[tone]} ${className}`}
    >
      {children}
    </span>
  )
}

export function BiasBadge({ bias, compact = false }: { bias: Bias; compact?: boolean }) {
  if (bias === "review") {
    return (
      <Badge tone="warn">
        <Scale className="h-3 w-3" aria-hidden />
        {compact ? "Review" : "Review flag"}
      </Badge>
    )
  }
  return (
    <Badge tone="success">
      <ShieldCheck className="h-3 w-3" aria-hidden />
      Clear
    </Badge>
  )
}

export function BiasIndicator({ bias }: { bias: Bias }) {
  const isReview = bias === "review"
  const config = isReview
    ? {
        wrap: "border-warn/30 bg-warn-tint",
        dot: "bg-warn",
        text: "text-warn",
        Icon: Scale,
        label: "Bias review",
        detail: "Fairness check pending",
      }
    : {
        wrap: "border-success/25 bg-success-tint",
        dot: "bg-success",
        text: "text-success",
        Icon: ShieldCheck,
        label: "Bias cleared",
        detail: "No adverse impact",
      }
  const { Icon } = config
  return (
    <div
      className={`flex items-center gap-2 rounded-lg border px-2 py-1.5 ${config.wrap}`}
      role="status"
      aria-label={`Bias indicator: ${config.label}. ${config.detail}.`}
    >
      <span className={`relative flex h-1.5 w-1.5 flex-shrink-0 ${config.text}`} aria-hidden>
        {isReview && (
          <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${config.dot}`} />
        )}
        <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${config.dot}`} />
      </span>
      <Icon className={`h-3.5 w-3.5 flex-shrink-0 ${config.text}`} aria-hidden />
      <div className="min-w-0 leading-tight">
        <div className={`text-[11px] font-semibold ${config.text}`}>{config.label}</div>
        <div className="truncate text-[10px] text-muted">{config.detail}</div>
      </div>
    </div>
  )
}

export function Avatar({
  initials,
  className = "",
}: {
  initials: string
  className?: string
}) {
  return (
    <div
      className={`redact-photo flex flex-shrink-0 items-center justify-center rounded-lg bg-teal-tint font-bold text-teal-deep ${className}`}
    >
      {initials}
    </div>
  )
}

export function RedactedName({ name, className = "" }: { name: string; className?: string }) {
  return <span className={`redact-target ${className}`}>{name}</span>
}

export function ScorePill({
  score,
  tone,
  className = "",
}: {
  score: number | null
  tone: ScoreTone
  className?: string
}) {
  return (
    <span
      className={`rounded-md px-2 py-0.5 text-center font-mono text-xs font-semibold ${toneClasses[tone]} ${className}`}
    >
      {score ?? "—"}
    </span>
  )
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`rounded-2xl border border-line bg-surface shadow-[0_1px_2px_rgba(18,22,28,0.06)] ${className}`}>
      {children}
    </div>
  )
}

export function PanelHead({
  title,
  children,
}: {
  title: string
  children?: ReactNode
}) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <h4 className="font-display text-[13px] font-semibold">{title}</h4>
      {children}
    </div>
  )
}
