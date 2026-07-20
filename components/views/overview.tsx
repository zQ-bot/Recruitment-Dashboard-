"use client"

import { ClipboardList, BrainCircuit, Timer, Scale, ArrowUp, ArrowDown, Sparkles } from "lucide-react"
import { candidates, scoreTone } from "@/lib/data"
import { Avatar, Badge, BiasBadge, Card, RedactedName, ScorePill } from "@/components/ui-bits"

type KpiTone = "teal" | "ai" | "success" | "warn"

const kpiIconClasses: Record<KpiTone, string> = {
  teal: "bg-teal-tint text-teal-deep",
  ai: "bg-ai-tint text-ai",
  success: "bg-success-tint text-success",
  warn: "bg-warn-tint text-warn",
}

const kpis: {
  tone: KpiTone
  icon: typeof ClipboardList
  label: string
  value: string
  unit?: string
  delta: string
  deltaDir: "up" | "down" | "flat"
}[] = [
  { tone: "teal", icon: ClipboardList, label: "Open Requisitions", value: "18", delta: "12", deltaDir: "up" },
  { tone: "ai", icon: BrainCircuit, label: "Resumes AI-Screened (7d)", value: "642", delta: "34%", deltaDir: "up" },
  { tone: "success", icon: Timer, label: "Avg. Time to Screen", value: "4.2", unit: "min", delta: "71%", deltaDir: "down" },
  { tone: "warn", icon: Scale, label: "Bias Reviews Flagged", value: "3", delta: "3 open", deltaDir: "flat" },
]

const funnel = [
  { label: "Applied", n: 248, h: 100 },
  { label: "AI Screened", n: 248, h: 96 },
  { label: "Shortlisted", n: 61, h: 52 },
  { label: "Interview", n: 19, h: 28 },
  { label: "Offer", n: 4, h: 12 },
]

function DeltaChip({ dir, value }: { dir: "up" | "down" | "flat"; value: string }) {
  if (dir === "flat") {
    return <span className="rounded-full bg-warn-tint px-2 py-0.5 text-[11.5px] text-warn">{value}</span>
  }
  const isUp = dir === "up"
  const Icon = isUp ? ArrowUp : ArrowDown
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11.5px] ${
        isUp ? "bg-success-tint text-success" : "bg-danger-tint text-danger"
      }`}
    >
      <Icon className="h-3 w-3" aria-hidden />
      {value}
    </span>
  )
}

export function OverviewView({ onOpenCandidate }: { onOpenCandidate: (id: string) => void }) {
  const ranked = candidates
    .filter((c) => c.aiScore !== null)
    .sort((a, b) => (b.aiScore ?? 0) - (a.aiScore ?? 0))
    .slice(0, 5)

  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => {
          const Icon = k.icon
          return (
            <Card key={k.label} className="p-[18px]">
              <div className="flex items-start justify-between">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${kpiIconClasses[k.tone]}`}>
                  <Icon className="h-4 w-4" aria-hidden />
                </div>
                <DeltaChip dir={k.deltaDir} value={k.delta} />
              </div>
              <div className="mt-3 text-xs text-muted">{k.label}</div>
              <div className="mt-0.5 font-display text-[26px] font-bold">
                {k.value}
                {k.unit && <span className="ml-1 text-[13px] font-medium text-muted">{k.unit}</span>}
              </div>
            </Card>
          )
        })}
      </div>

      {/* Funnel + ranked list */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.5fr_1fr]">
        <Card className="p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h4 className="font-display text-[13px] font-semibold">
              Hiring Funnel — Senior Backend Engineer (REQ-1042)
            </h4>
            <Badge tone="neutral">248 candidates</Badge>
          </div>
          <div className="flex h-[150px] items-end gap-2.5 pt-2.5">
            {funnel.map((f) => (
              <div key={f.label} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                <div className="font-mono text-[13px] font-semibold">{f.n}</div>
                <div
                  className="w-full rounded-t-lg bg-gradient-to-b from-teal to-teal-deep"
                  style={{ height: `${f.h}%` }}
                />
                <div className="text-center text-[11px] text-muted">{f.label}</div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-start gap-2 rounded-[10px] bg-ai-tint px-3 py-2.5 text-[11.5px] leading-relaxed text-[#3f41a8]">
            <Sparkles className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" aria-hidden />
            <span>
              <b>AI note</b> — grounded in REQ-1042 JD &amp; L5 leveling rubric: screen-to-shortlist ratio (24.6%) is
              consistent with the 90-day rolling baseline for this role family; no anomaly detected.
            </span>
          </div>
        </Card>

        <Card className="p-5">
          <h4 className="mb-3 font-display text-[13px] font-semibold">Top-Ranked Candidates Today</h4>
          <div>
            {ranked.map((c, i) => (
              <div key={c.id} className="flex items-center gap-3 border-b border-line-2 py-2.5 last:border-none">
                <div className="w-[22px] font-mono text-[12.5px] text-faint">{i + 1}</div>
                <Avatar initials={c.initials} className="h-8 w-8 text-xs" />
                <div className="min-w-0 flex-1">
                  <div className="text-[12.8px] font-semibold">
                    <RedactedName name={c.name} />
                  </div>
                  <div className="text-[11px] text-muted">{c.role}</div>
                </div>
                <ScorePill score={c.aiScore} tone={scoreTone(c.aiScore)} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent AI-screened candidate table */}
      <div>
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="font-display text-[15.5px] font-semibold">Recently AI-Screened</h2>
          <span className="text-xs text-muted">Click a candidate to open full evaluation</span>
        </div>
        <Card className="overflow-hidden">
          <div className="grid grid-cols-[1fr_auto_auto] gap-3 border-b border-line-2 px-5 py-3 text-[10.5px] font-semibold uppercase tracking-[0.05em] text-faint sm:grid-cols-[1fr_120px_60px]">
            <span>Candidate</span>
            <span className="hidden sm:block">Bias</span>
            <span className="text-right">Score</span>
          </div>
          {candidates.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => onOpenCandidate(c.id)}
              className="grid w-full grid-cols-[1fr_auto_auto] items-center gap-3 border-b border-line-2 px-5 py-3 text-left transition-colors last:border-none hover:bg-line-2/40 sm:grid-cols-[1fr_120px_60px]"
            >
              <div className="flex min-w-0 items-center gap-3">
                <Avatar initials={c.initials} className="h-8 w-8 text-xs" />
                <div className="min-w-0">
                  <div className="truncate text-[12.8px] font-semibold">
                    <RedactedName name={c.name} />
                    <span className="ml-1 text-[11px] font-normal text-faint">· {c.id}</span>
                  </div>
                  <div className="truncate text-[11px] text-muted">
                    {c.role} · {c.stage}
                  </div>
                </div>
              </div>
              <div className="hidden sm:block">
                <BiasBadge bias={c.bias} />
              </div>
              <ScorePill score={c.aiScore} tone={scoreTone(c.aiScore)} className="min-w-[34px] justify-self-end" />
            </button>
          ))}
        </Card>
      </div>
    </div>
  )
}
