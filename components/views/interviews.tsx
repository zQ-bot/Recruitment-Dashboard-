"use client"

import { useEffect, useMemo, useState } from "react"
import { CalendarClock, MessageSquareText, Sparkles } from "lucide-react"
import { Badge, Card, PanelHead } from "@/components/ui-bits"
import { getLiveCandidates } from "@/src/actions/get-candidates.action"
import type { LiveCandidate } from "@/src/lib/live-candidate"

type InterviewSlot = {
  id: string
  candidate: string
  role: string
  time: string
  round: string
  panel: string
  status: "Booked" | "Prep" | "Pending" | "High Priority"
  notes: string
}

const statusTone: Record<InterviewSlot["status"], "ai" | "success" | "warn" | "danger" | "neutral"> = {
  Booked: "success",
  Prep: "ai",
  Pending: "neutral",
  "High Priority": "warn",
}

function StatusBadge({ status }: { status: InterviewSlot["status"] }) {
  return <Badge tone={statusTone[status]}>{status}</Badge>
}

export function InterviewPlanningView({ searchQuery, statusFilter }: { searchQuery: string; statusFilter: string }) {
  const [candidates, setCandidates] = useState<LiveCandidate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const data = await getLiveCandidates()
      setCandidates(data)
      setLoading(false)
    }

    load()
  }, [])

  const schedule = useMemo<InterviewSlot[]>(() => {
    const query = searchQuery.trim().toLowerCase()
    const visibleCandidates = candidates.filter((candidate) => {
      const matchesQuery = !query || candidate.candidateName.toLowerCase().includes(query) || candidate.appliedRole.toLowerCase().includes(query)
      const matchesStatus = statusFilter === "all" || candidate.status === statusFilter
      return matchesQuery && matchesStatus
    })

    return visibleCandidates.slice(0, 4).map((candidate, index) => ({
      id: candidate.id,
      candidate: candidate.candidateName,
      role: candidate.appliedRole,
      time: index === 0 ? "Today · 2:00 PM" : index === 1 ? "Tomorrow · 11:30 AM" : index === 2 ? "Thursday · 4:15 PM" : "Friday · 9:00 AM",
      round: index === 0 ? "Panel Interview" : index === 1 ? "Technical Screen" : index === 2 ? "Hiring Panel" : "Offer Alignment",
      panel: index === 0 ? "Engineering + Hiring Manager" : index === 1 ? "Principal Engineer" : index === 2 ? "Recruiter + Engineering Lead" : "Talent + Finance",
      status: index === 2 ? "High Priority" : index === 3 ? "Pending" : "Booked",
      notes: candidate.summary,
    }))
  }, [candidates])

  return (
    <div className="space-y-4">
      <Card className="p-5">
        <PanelHead title="Upcoming interview cadence">
          <Badge tone="ai">{schedule.length} sessions this week</Badge>
        </PanelHead>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-line bg-line-2/60 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ai-tint text-ai">
                <CalendarClock className="h-4.5 w-4.5" aria-hidden />
              </div>
              <div>
                <div className="font-display text-[13px] font-semibold">Panel readiness snapshot</div>
                <div className="mt-1 text-[12px] leading-relaxed text-muted">
                  Live candidate applications are now surfaced here so interview planning stays aligned with the latest pipeline changes.
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge tone="success">{schedule.filter((slot) => slot.status === "Booked").length} confirmed</Badge>
              <Badge tone="warn">{schedule.filter((slot) => slot.status === "High Priority").length} high priority</Badge>
              <Badge tone="neutral">{schedule.filter((slot) => slot.status === "Pending").length} pending prep</Badge>
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-surface p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-tint text-teal-deep">
                <MessageSquareText className="h-4.5 w-4.5" aria-hidden />
              </div>
              <div>
                <div className="font-display text-[13px] font-semibold">Prep notes to send</div>
                <div className="mt-1 text-[12px] leading-relaxed text-muted">
                  Candidate-specific follow-up areas and score summaries are surfaced directly from the latest application data.
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden p-0">
        <div className="grid grid-cols-[1.2fr_0.8fr_0.7fr_0.8fr] gap-3 border-b border-line-2 px-5 py-3 text-[10.5px] font-semibold uppercase tracking-[0.05em] text-faint">
          <span>Candidate</span>
          <span>Time</span>
          <span>Round</span>
          <span>Status</span>
        </div>
        {loading ? <div className="px-5 py-4 text-sm text-muted">Loading interviews…</div> : schedule.map((slot) => (
          <div key={slot.id} className="grid grid-cols-[1.2fr_0.8fr_0.7fr_0.8fr] items-start gap-3 border-b border-line-2 px-5 py-3 text-[12.5px] last:border-none">
            <div>
              <div className="font-semibold">{slot.candidate}</div>
              <div className="mt-0.5 text-[11px] text-muted">{slot.role}</div>
              <div className="mt-2 flex items-start gap-1.5 rounded-lg bg-ai-tint px-2.5 py-1.5 text-[11px] text-[#3f41a8]">
                <Sparkles className="mt-0.5 h-3 w-3 flex-shrink-0" aria-hidden />
                <span>{slot.notes}</span>
              </div>
            </div>
            <div className="text-muted">{slot.time}</div>
            <div>
              <div className="font-medium">{slot.round}</div>
              <div className="mt-0.5 text-[11px] text-faint">{slot.panel}</div>
            </div>
            <div>
              <StatusBadge status={slot.status} />
            </div>
          </div>
        ))}
      </Card>
    </div>
  )
}
