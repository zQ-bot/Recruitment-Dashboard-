
"use client"

import { useEffect, useMemo, useState } from "react"
import { ClipboardList, BrainCircuit, Timer, Scale, ArrowUp, ArrowDown, Sparkles } from "lucide-react"
import { scoreTone } from "@/lib/data"
import { Avatar, Badge, Card, RedactedName, ScorePill } from "@/components/ui-bits"
import { getLiveCandidates } from "@/src/actions/get-candidates.action"
import type { LiveCandidate } from "@/src/lib/live-candidate"

type KpiTone = "teal" | "ai" | "success" | "warn"

const kpiIconClasses: Record<KpiTone, string> = {
  teal: "bg-teal-tint text-teal-deep",
  ai: "bg-ai-tint text-ai",
  success: "bg-success-tint text-success",
  warn: "bg-warn-tint text-warn",
}

const kpiBase: {
  tone: KpiTone
  icon: typeof ClipboardList
  label: string
  delta: string
  deltaDir: "up" | "down" | "flat"
  unit?: string
}[] = [
  { tone: "teal", icon: ClipboardList, label: "Open Requisitions", delta: "Live", deltaDir: "up" },
  { tone: "ai", icon: BrainCircuit, label: "Live Applications", delta: "Fresh", deltaDir: "up" },
  { tone: "success", icon: Timer, label: "Shortlisted", delta: "Ready", deltaDir: "down" },
  { tone: "warn", icon: Scale, label: "Need Review", delta: "Open", deltaDir: "flat" },
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


export function OverviewView({
  onOpenCandidate,
  searchQuery,
  statusFilter,
}: {
  onOpenCandidate: (id: string) => void
  searchQuery: string
  statusFilter: string
}) {
  const [liveCandidates, setLiveCandidates] = useState<LiveCandidate[]>([])

  useEffect(() => {
    async function loadCandidates() {
      const data = await getLiveCandidates()
      setLiveCandidates(data)
    }

    loadCandidates()
  }, [])

  const filteredCandidates = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return liveCandidates.filter((candidate) => {
      const matchesQuery =
        !query ||
        candidate.candidateName.toLowerCase().includes(query) ||
        candidate.appliedRole.toLowerCase().includes(query) ||
        candidate.status.toLowerCase().includes(query)
      const matchesStatus = statusFilter === "all" || candidate.status === statusFilter
      return matchesQuery && matchesStatus
    })
  }, [liveCandidates, searchQuery, statusFilter])

  const ranked = [...filteredCandidates]
    .sort((a, b) => (b.aiScore ?? 0) - (a.aiScore ?? 0))
    .slice(0, 5)

  const funnel = [
    { label: "Applied", n: filteredCandidates.filter((candidate) => candidate.status === "Applied").length, h: 100 },
    { label: "AI Screened", n: filteredCandidates.filter((candidate) => candidate.status === "AI Screened").length, h: 88 },
    { label: "Shortlisted", n: filteredCandidates.filter((candidate) => candidate.status === "Shortlisted").length, h: 62 },
    { label: "Interview", n: filteredCandidates.filter((candidate) => candidate.status === "Interview").length, h: 38 },
    { label: "Offer", n: filteredCandidates.filter((candidate) => candidate.status === "Offer").length, h: 16 },
  ]

  const kpis = useMemo(() => {
    const openRequisitions = new Set(filteredCandidates.map((candidate) => candidate.appliedRole)).size
    const shortlisted = filteredCandidates.filter((candidate) => candidate.status === "Shortlisted").length
    const review = filteredCandidates.filter((candidate) => candidate.status === "Applied" || candidate.status === "AI Screened").length

    return [
      { ...kpiBase[0], value: String(openRequisitions || filteredCandidates.length || 0) },
      { ...kpiBase[1], value: String(filteredCandidates.length) },
      { ...kpiBase[2], value: String(shortlisted), unit: "candidates" },
      { ...kpiBase[3], value: String(review), unit: "review" },
    ]
  }, [filteredCandidates])

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
            <Badge tone="neutral">{filteredCandidates.length} candidates</Badge>
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
              <b>AI note</b> — grounded in the live pipeline data for REQ-1042, the current funnel shows the latest application mix and stage movement without manual overrides.
            </span>
          </div>
        </Card>

        <Card className="p-5">
          <h4 className="mb-3 font-display text-[13px] font-semibold">Top-Ranked Candidates Today</h4>
          <div>
            {ranked.length ? ranked.map((candidate, i) => (
              <div key={candidate.id} className="flex items-center gap-3 border-b border-line-2 py-2.5 last:border-none">
                <div className="w-[22px] font-mono text-[12.5px] text-faint">{i + 1}</div>
                <Avatar initials={candidate.initials} className="h-8 w-8 text-xs" />
                <div className="min-w-0 flex-1">
                  <div className="text-[12.8px] font-semibold">
                    <RedactedName name={candidate.candidateName} />
                  </div>
                  <div className="text-[11px] text-muted">{candidate.appliedRole}</div>
                </div>
                <ScorePill score={candidate.aiScore} tone={scoreTone(candidate.aiScore)} />
              </div>
            )) : <div className="text-sm text-muted">No candidates match the current search.</div>}
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
            <span className="hidden sm:block">Status</span>
            <span className="text-right">Applied</span>
          </div>
          {filteredCandidates.length ? filteredCandidates.map((candidate) => (
            <button
              key={candidate.id}
              type="button"
              onClick={() => onOpenCandidate(candidate.id)}
              className="grid w-full grid-cols-[1fr_auto_auto] items-center gap-3 border-b border-line-2 px-5 py-3 text-left last:border-none sm:grid-cols-[1fr_120px_60px]"
            >
              <div className="min-w-0">
                <div className="truncate text-[12.8px] font-semibold">{candidate.candidateName}</div>
                <div className="truncate text-[11px] text-muted">{candidate.appliedRole}</div>
              </div>

              <div className="hidden sm:block">
                <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700">{candidate.status}</span>
              </div>

              <div className="justify-self-end text-xs text-muted">
                {new Date(candidate.applicationDate).toLocaleDateString()}
              </div>
            </button>
          )) : <div className="px-5 py-4 text-sm text-muted">No live candidates match the current filters.</div>}
        </Card>
      </div>
    </div>
  )
}
