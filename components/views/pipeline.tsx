"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, Loader2, RefreshCcw } from "lucide-react"
import { Avatar, BiasBadge, RedactedName, ScorePill } from "@/components/ui-bits"
import { scoreTone } from "@/lib/data"
import { updateApplicationStatus } from "@/src/actions/pipeline.action"
import { getLiveCandidates } from "@/src/actions/get-candidates.action"
import type { LiveCandidate } from "@/src/lib/live-candidate"

const stages = ["Applied", "AI Screened", "Shortlisted", "Interview", "Offer"] as const

export function PipelineView({ onOpenCandidate, searchQuery, statusFilter }: { onOpenCandidate: (id: string) => void; searchQuery: string; statusFilter: string }) {
  const [candidates, setCandidates] = useState<LiveCandidate[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  async function loadCandidates() {
    setLoading(true)
    const data = await getLiveCandidates()
    setCandidates(
  data.map((candidate) => ({
    ...candidate,
    status:
      candidate.status === "new"
        ? "Applied"
        : candidate.status,
  }))
)
    setLoading(false)
  }

  useEffect(() => {
    loadCandidates()
  }, [])
  const filteredCandidates = candidates.filter((candidate) => {
  const matchesSearch =
    searchQuery === "" ||
    candidate.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    candidate.appliedRole.toLowerCase().includes(searchQuery.toLowerCase())

  const matchesStatus =
    statusFilter === "All" || candidate.status === statusFilter

  return matchesSearch && matchesStatus
})

  async function handleStatusChange(applicationId: string, nextStatus: string) {
    const previous = candidates.find((candidate) => candidate.id === applicationId)
    if (!previous) return

    setUpdatingId(applicationId)
    setCandidates((current) => current.map((candidate) => (candidate.id === applicationId ? { ...candidate, status: nextStatus } : candidate)))

    const result = await updateApplicationStatus(applicationId, nextStatus)
    if (!result.success) {
      setCandidates((current) => current.map((candidate) => (candidate.id === applicationId ? { ...candidate, status: previous.status } : candidate)))
      setMessage(result.error || "Status update failed")
    } else {
      setMessage("Candidate status updated")
    }

    setUpdatingId(null)
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-display text-[15.5px] font-semibold">Senior Backend Engineer · REQ-1042</h2>
        <button type="button" onClick={() => loadCandidates()} className="text-xs text-muted underline-offset-2 hover:underline">
          Refresh
        </button>
      </div>

      {message ? <div className="rounded-lg border border-line bg-surface px-3 py-2 text-[12px] text-muted">{message}</div> : null}

      {loading ? (
        <div className="rounded-2xl border border-line bg-surface p-6 text-center text-sm text-muted">Loading pipeline…</div>
      ) : (
        <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {stages.map((stage) => {
            const items = filteredCandidates.filter((candidate) => candidate.status === stage).sort((a, b) => (b.aiScore ?? 0) - (a.aiScore ?? 0))
            return (
              <div key={stage} className="rounded-2xl bg-[#eff0ec] p-2.5">
                <div className="flex items-center justify-between px-1.5 pb-2.5 pt-1">
                  <h3 className="text-[12.5px] font-semibold uppercase tracking-[0.03em] text-muted">{stage}</h3>
                  <span className="rounded-full border border-line bg-surface px-1.5 py-px text-[11px] text-muted">{items.length}</span>
                </div>
                {items.length === 0 ? (
                  <div className="px-1.5 py-3.5 text-[11.5px] text-faint">No candidates</div>
                ) : (
                  items.map((candidate) => (
                    <div key={candidate.id} className="mb-2.5 w-full rounded-xl border border-line bg-surface p-3 text-left transition-all last:mb-0">
                      <button type="button" onClick={() => onOpenCandidate(candidate.id)} className="w-full text-left">
                        <div className="flex items-center gap-2.5">
                          <Avatar initials={candidate.initials} className="h-8 w-8 text-xs" />
                          <div className="min-w-0">
                            <div className="truncate text-[13px] font-semibold">
                              <RedactedName name={candidate.candidateName} />
                            </div>
                            <div className="text-[11px] text-muted">{candidate.appliedRole}</div>
                          </div>
                        </div>
                        <div className="mt-2.5 flex items-center justify-between">
                          <BiasBadge bias={candidate.bias} compact />
                          <ScorePill score={candidate.aiScore} tone={scoreTone(candidate.aiScore)} />
                        </div>
                      </button>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <select
                          value={candidate.status}
                          onChange={(event) => handleStatusChange(candidate.id, event.target.value)}
                          className="w-full rounded-lg border border-line bg-white px-2 py-1.5 text-[11.5px]"
                        >
                          {stages.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                        {updatingId === candidate.id ? <Loader2 className="h-4 w-4 animate-spin text-ai" /> : <CheckCircle2 className="h-4 w-4 text-success" />}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
