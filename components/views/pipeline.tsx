"use client"

import { candidates, scoreTone, stages } from "@/lib/data"
import { Avatar, BiasBadge, RedactedName, ScorePill } from "@/components/ui-bits"

export function PipelineView({ onOpenCandidate }: { onOpenCandidate: (id: string) => void }) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-display text-[15.5px] font-semibold">Senior Backend Engineer · REQ-1042</h2>
        <span className="text-xs text-muted">Sorted by AI Hiring Score within each stage</span>
      </div>

      <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {stages.map((stage) => {
          const items = candidates
            .filter((c) => c.stage === stage)
            .sort((a, b) => (b.aiScore ?? 0) - (a.aiScore ?? 0))
          return (
            <div key={stage} className="rounded-2xl bg-[#eff0ec] p-2.5">
              <div className="flex items-center justify-between px-1.5 pb-2.5 pt-1">
                <h3 className="text-[12.5px] font-semibold uppercase tracking-[0.03em] text-muted">{stage}</h3>
                <span className="rounded-full border border-line bg-surface px-1.5 py-px text-[11px] text-muted">
                  {items.length}
                </span>
              </div>
              {items.length === 0 ? (
                <div className="px-1.5 py-3.5 text-[11.5px] text-faint">No candidates</div>
              ) : (
                items.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => onOpenCandidate(c.id)}
                    className="mb-2.5 w-full rounded-xl border border-line bg-surface p-3 text-left transition-all last:mb-0 hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(18,22,28,0.10)]"
                  >
                    <div className="flex items-center gap-2.5">
                      <Avatar initials={c.initials} className="h-8 w-8 text-xs" />
                      <div className="min-w-0">
                        <div className="truncate text-[13px] font-semibold">
                          <RedactedName name={c.name} />
                        </div>
                        <div className="text-[11px] text-muted">Sr. Backend Eng.</div>
                      </div>
                    </div>
                    <div className="mt-2.5 flex items-center justify-between">
                      <BiasBadge bias={c.bias} compact />
                      <ScorePill score={c.aiScore} tone={scoreTone(c.aiScore)} />
                    </div>
                  </button>
                ))
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
