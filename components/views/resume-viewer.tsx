"use client"

import { useState } from "react"
import { Sparkles, FileDown, RefreshCw, Check, X, Hourglass, BrainCircuit } from "lucide-react"
import {
  candidates,
  recommendationTone,
  scoreTone,
  toneClasses,
  type Candidate,
} from "@/lib/data"
import { Avatar, Badge, BiasBadge, Card, PanelHead, RedactedName } from "@/components/ui-bits"

const toneStroke: Record<string, string> = {
  success: "var(--color-success)",
  warn: "var(--color-warn)",
  danger: "var(--color-danger)",
  neutral: "var(--color-muted)",
}

function Gauge({ score }: { score: number | null }) {
  const tone = scoreTone(score)
  const r = 38
  const c = 2 * Math.PI * r
  const pct = score === null ? 0 : score / 100
  const offset = c * (1 - pct)
  return (
    <div className="relative h-[88px] w-[88px] flex-shrink-0">
      <svg width="88" height="88" viewBox="0 0 88 88" className="-rotate-90">
        <circle cx="44" cy="44" r={r} fill="none" stroke="var(--color-line-2)" strokeWidth="9" />
        <circle
          cx="44"
          cy="44"
          r={r}
          fill="none"
          stroke={toneStroke[tone]}
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <b className="font-mono text-[22px] leading-none">{score ?? "—"}</b>
        <span className="text-[9px] uppercase tracking-[0.04em] text-muted">/ 100</span>
      </div>
    </div>
  )
}

function MatchRow({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="mb-3 flex items-center gap-2.5">
      <span className="w-[108px] flex-shrink-0 text-xs text-muted">{label}</span>
      <div className="h-[7px] flex-1 overflow-hidden rounded-full bg-line-2">
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
      </div>
      <span className="w-[38px] flex-shrink-0 text-right font-mono text-xs font-semibold">{value}%</span>
    </div>
  )
}

function ResumeDoc({ c }: { c: Candidate }) {
  const processed = c.aiScore !== null
  return (
    <Card className="scroll-thin max-h-[820px] overflow-y-auto p-7 text-[12.8px] leading-[1.75] text-[#3a3f46]">
      <h3 className="font-display text-base">
        <RedactedName name={c.name} />
      </h3>
      {!processed ? (
        <>
          <div className="mb-3.5 text-[12.5px] text-muted">Application queued for AI screening</div>
          <p className="text-[12.5px] text-muted">
            This resume has been ingested and embedded into the retrieval index. It will be scored against REQ-1042
            (Senior Backend Engineer) in the next screening batch.
          </p>
        </>
      ) : (
        <>
          <div className="mb-3.5 text-[12.5px] text-muted">
            {c.resume.title} · {c.resume.appliedFor}
          </div>

          <h4 className="mb-2 mt-[18px] border-b border-line-2 pb-1.5 font-display text-[11px] uppercase tracking-[0.06em] text-teal-deep">
            Experience
          </h4>
          {c.resume.exp.map((e, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between text-[12.8px] font-semibold">
                <span className={e.org.startsWith("Redacted") ? "" : "redact-target"}>
                  {e.title} · {e.org}
                </span>
                <span className="font-medium text-faint">{e.period}</span>
              </div>
              <ul className="list-disc pl-[18px]">
                {e.bullets.map((b, j) => (
                  <li key={j} className="mb-1.5">
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <h4 className="mb-2 mt-[18px] border-b border-line-2 pb-1.5 font-display text-[11px] uppercase tracking-[0.06em] text-teal-deep">
            Education
          </h4>
          <ul className="list-disc pl-[18px]">
            {c.resume.edu.map((e, i) => (
              <li key={i} className="mb-1.5">
                <RedactedName name={e.school} /> — {e.degree}, {e.year}
              </li>
            ))}
          </ul>

          <h4 className="mb-2 mt-[18px] border-b border-line-2 pb-1.5 font-display text-[11px] uppercase tracking-[0.06em] text-teal-deep">
            Certifications
          </h4>
          <ul className="list-disc pl-[18px]">
            {c.resume.certs.length ? (
              c.resume.certs.map((x, i) => (
                <li key={i} className="mb-1.5">
                  {x}
                </li>
              ))
            ) : (
              <li className="text-faint">None listed</li>
            )}
          </ul>
        </>
      )}
    </Card>
  )
}

function AnalysisPanel({
  c,
  onExport,
}: {
  c: Candidate
  onExport: () => void
}) {
  const [notes, setNotes] = useState(c.notes)
  const [rerunLabel, setRerunLabel] = useState<"idle" | "running" | "done">("idle")

  function rerun() {
    setRerunLabel("running")
    setTimeout(() => {
      setRerunLabel("done")
      setTimeout(() => setRerunLabel("idle"), 1400)
    }, 1100)
  }

  if (c.aiScore === null) {
    return (
      <Card className="flex flex-col items-center px-5 py-10 text-center">
        <Hourglass className="mb-2 h-7 w-7 text-muted" aria-hidden />
        <b className="font-display">Awaiting AI evaluation</b>
        <p className="mt-1.5 text-[12.5px] text-muted">
          Skill, experience, education and certification matching will appear here once screening completes.
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-3.5">
      {/* AI recommendation card */}
      <Card className="p-5">
        <PanelHead title="AI Hiring Score">
          <Badge tone={recommendationTone(c.recommendation)}>{c.recommendation}</Badge>
        </PanelHead>
        <div className="flex items-center gap-[18px]">
          <Gauge score={c.aiScore} />
          <div className="flex-1 text-[12.5px] leading-relaxed text-muted">
            <b className="text-foreground">Interview Recommendation:</b> {c.recommendation}. Score reflects weighted
            match across skills (40%), experience (30%), education (15%) and certifications (15%), per REQ-1042 rubric
            v3.
          </div>
        </div>
        <div className="mt-3 flex items-start gap-2 rounded-[10px] bg-ai-tint px-3 py-2.5 text-[11.5px] leading-relaxed text-[#3f41a8]">
          <Sparkles className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" aria-hidden />
          <span>
            <b>AI Resume Summary</b>
            <br />
            {c.summary}
          </span>
        </div>
      </Card>

      {/* Match breakdown */}
      <Card className="p-5">
        <PanelHead title="Match Breakdown">
          <BiasBadge bias={c.bias} />
        </PanelHead>
        <MatchRow label="Skill Match" value={c.skillMatch ?? 0} color="var(--color-teal)" />
        <MatchRow label="Experience Match" value={c.expMatch ?? 0} color="var(--color-ai)" />
        <MatchRow label="Education Match" value={c.eduMatch ?? 0} color="var(--color-success)" />
        <MatchRow label="Certification Match" value={c.certMatch ?? 0} color="var(--color-warn)" />
      </Card>

      {/* Skills matched vs missing */}
      <Card className="p-5">
        <PanelHead title="Skills — Matched vs. Missing" />
        <div className="flex flex-wrap gap-2">
          {c.skills.have.map((s) => (
            <span key={s} className="flex items-center gap-1 rounded-full bg-success-tint px-2.5 py-1 text-[11.5px] text-success">
              <Check className="h-3 w-3" aria-hidden />
              {s}
            </span>
          ))}
          {c.skills.missing.map((s) => (
            <span key={s} className="flex items-center gap-1 rounded-full bg-danger-tint px-2.5 py-1 text-[11.5px] text-danger">
              <X className="h-3 w-3" aria-hidden />
              {s}
            </span>
          ))}
        </div>
      </Card>

      {/* Recruiter notes */}
      <Card className="p-5">
        <PanelHead title="Recruiter Notes" />
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add context for the hiring panel…"
          className="min-h-[78px] w-full resize-y rounded-lg border border-line bg-[#fbfbfa] px-3 py-2.5 text-[12.5px] focus:border-teal focus:outline-none"
        />
      </Card>

      <div className="flex flex-col gap-2.5 sm:flex-row">
        <button
          type="button"
          onClick={onExport}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-ink bg-ink px-4 py-2.5 text-[12.8px] font-semibold text-white transition hover:brightness-110"
        >
          <FileDown className="h-4 w-4" aria-hidden />
          Export Report
        </button>
        <button
          type="button"
          onClick={rerun}
          disabled={rerunLabel === "running"}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-ai bg-ai px-4 py-2.5 text-[12.8px] font-semibold text-white transition hover:brightness-110 disabled:opacity-70"
        >
          {rerunLabel === "running" && <RefreshCw className="h-4 w-4 animate-spin" aria-hidden />}
          {rerunLabel === "done" && <Check className="h-4 w-4" aria-hidden />}
          {rerunLabel === "idle" && <BrainCircuit className="h-4 w-4" aria-hidden />}
          {rerunLabel === "running"
            ? "Re-scoring against REQ-1042…"
            : rerunLabel === "done"
              ? "Score confirmed — no change"
              : "Re-run AI Evaluation"}
        </button>
      </div>
    </div>
  )
}

export function ResumeViewerView({
  activeId,
  onSelect,
  onExport,
}: {
  activeId: string
  onSelect: (id: string) => void
  onExport: (id: string) => void
}) {
  const active = candidates.find((c) => c.id === activeId) ?? candidates[0]

  return (
    <div className="space-y-4">
      {/* candidate switch strip */}
      <div className="scroll-thin flex gap-2 overflow-x-auto pb-1">
        {candidates.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => onSelect(c.id)}
            className={`flex flex-shrink-0 items-center gap-2 rounded-xl border bg-surface py-1.5 pl-1.5 pr-3 text-[12.5px] transition ${
              c.id === active.id ? "border-ink shadow-[0_0_0_1px_var(--color-ink)]" : "border-line"
            }`}
          >
            <Avatar initials={c.initials} className="h-[26px] w-[26px] text-[10.5px]" />
            <div className="text-left">
              <RedactedName name={c.name} />
              <div className="text-[10px] text-faint">{c.stage}</div>
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.15fr]">
        <ResumeDoc c={active} />
        <AnalysisPanel c={active} onExport={() => onExport(active.id)} />
      </div>
    </div>
  )
}
