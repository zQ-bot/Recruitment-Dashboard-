"use client"

import { CalendarClock, MessageSquareText, Sparkles } from "lucide-react"
import { interviewSchedule, type InterviewSlot } from "@/lib/data"
import { Badge, Card, PanelHead } from "@/components/ui-bits"

const statusTone: Record<InterviewSlot["status"], "ai" | "success" | "warn" | "danger" | "neutral"> = {
  Booked: "success",
  Prep: "ai",
  Pending: "neutral",
  "High Priority": "warn",
}

function StatusBadge({ status }: { status: InterviewSlot["status"] }) {
  return <Badge tone={statusTone[status]}>{status}</Badge>
}

export function InterviewPlanningView() {
  return (
    <div className="space-y-4">
      <Card className="p-5">
        <PanelHead title="Upcoming interview cadence">
          <Badge tone="ai">4 sessions this week</Badge>
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
                  Two interviews are already confirmed, one is awaiting recruiter sign-off, and one is waiting for the
                  compensation package to be finalized.
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge tone="success">2 confirmed</Badge>
              <Badge tone="warn">1 high priority</Badge>
              <Badge tone="neutral">1 pending prep</Badge>
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
                  Share role-specific evaluation prompts, the interview rubric, and any candidate-specific follow-up areas
                  before the panel convenes.
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
        {interviewSchedule.map((slot) => (
          <div
            key={slot.id}
            className="grid grid-cols-[1.2fr_0.8fr_0.7fr_0.8fr] items-start gap-3 border-b border-line-2 px-5 py-3 text-[12.5px] last:border-none"
          >
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
