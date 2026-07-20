"use client"

import { EyeOff, Ruler, BarChart3, HelpCircle } from "lucide-react"
import { candidates } from "@/lib/data"
import { Avatar, Badge, Card, PanelHead, RedactedName } from "@/components/ui-bits"

const guardrails = [
  {
    icon: EyeOff,
    title: "Blind Evaluation",
    body: "Name, photo, age, gender-coded terms, school name and address are masked before the AI model scores the resume. Reviewers can toggle identity back on only after scoring is complete.",
  },
  {
    icon: Ruler,
    title: "Evidence-Grounded Scoring",
    body: "Every score is generated only from retrieved resume text, the job description, and the hiring rubric — never from the model's general assumptions about a candidate's background.",
  },
  {
    icon: BarChart3,
    title: "Disparate-Impact Monitoring",
    body: "Score distributions are compared across demographic groups weekly (post-hoc, not used in scoring). Gaps beyond policy threshold auto-open a review flag.",
  },
]

const triggers = [
  {
    label: "Score volatility flag",
    body: "AI Hiring Score shifts by more than 8 points between the blind and identity-visible pass for the same resume.",
  },
  {
    label: "Proxy-variable flag",
    body: "resume text contains signals that correlate with a protected class (e.g. graduation year implying age, name-based origin inference) that the model may have leaned on.",
  },
  {
    label: "Cohort gap flag",
    body: "a role's shortlist rate for one demographic cohort falls more than 2 standard deviations below the requisition average.",
  },
]

export function BiasView({ onOpenCandidate }: { onOpenCandidate: (id: string) => void }) {
  const flagged = candidates.filter((c) => c.bias === "review")

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.5fr_1fr]">
        <Card className="p-5">
          <PanelHead title="Fairness Guardrails Active">
            <Badge tone="success">3 controls enabled</Badge>
          </PanelHead>
          <div className="flex flex-col gap-3">
            {guardrails.map((g) => {
              const Icon = g.icon
              return (
                <div key={g.title} className="flex items-start gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-ai-tint text-ai">
                    <Icon className="h-4 w-4" aria-hidden />
                  </div>
                  <div>
                    <b className="text-[13px]">{g.title}</b>
                    <div className="mt-0.5 text-xs text-muted">{g.body}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        <Card className="p-5">
          <PanelHead title="Open Bias Reviews" />
          <div>
            {flagged.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => onOpenCandidate(c.id)}
                className="flex w-full items-center gap-3 border-b border-line-2 py-2.5 text-left last:border-none"
              >
                <Avatar initials={c.initials} className="h-8 w-8 text-xs" />
                <div className="min-w-0 flex-1">
                  <div className="text-[12.8px] font-semibold">
                    <RedactedName name={c.name} />
                  </div>
                  <div className="text-[11px] text-muted">{c.role} · Score shift 11 pts (blind vs. visible)</div>
                </div>
                <Badge tone="warn">Needs review</Badge>
              </button>
            ))}
            <div className="flex items-center gap-3 py-2.5">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-line-2 text-faint">
                <HelpCircle className="h-4 w-4" aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[12.8px] font-semibold">REQ-1058 · UX Researcher</div>
                <div className="text-[11px] text-muted">Cohort shortlist-rate gap flagged for recruiter review</div>
              </div>
              <Badge tone="warn">Needs review</Badge>
            </div>
          </div>
        </Card>
      </div>

      <div>
        <h2 className="mb-3 font-display text-[15.5px] font-semibold">What triggers a Bias Indicator</h2>
        <Card className="p-5 text-[12.8px] leading-[1.8] text-[#3a3f46]">
          <ul className="list-disc space-y-1 pl-5">
            {triggers.map((t) => (
              <li key={t.label}>
                <b>{t.label}</b> — {t.body}
              </li>
            ))}
            <li>
              All flags route to a human recruiter for manual adjudication — the AI never auto-rejects on a bias flag.
            </li>
          </ul>
        </Card>
      </div>
    </div>
  )
}
