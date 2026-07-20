"use client"

import { useEffect, useMemo, useState } from "react"
import { Sparkles, FileDown, RefreshCw, Check, X, Hourglass, BrainCircuit, AlertCircle, ExternalLink } from "lucide-react"
import { recommendationTone, scoreTone } from "@/lib/data"
import { Avatar, Badge, BiasBadge, Card, PanelHead, RedactedName } from "@/components/ui-bits"
import type { LiveCandidate } from "@/src/lib/live-candidate"
import { analyzeResumeCandidate, buildFallbackAnalysis } from "@/src/lib/ai-scoring"
import ResumePdfViewer from "@/components/views/resume-pdf-viewer"
import { getLiveCandidates } from "@/src/actions/get-candidates.action"

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

function ResumeDoc({ candidate, onRetry }: { candidate: LiveCandidate; onRetry: () => void }) {
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading")
  const [errorKey, setErrorKey] = useState(0)
  const [analysis, setAnalysis] = useState(() => buildFallbackAnalysis(candidate))

  useEffect(() => {
    setStatus("loading")
    setAnalysis(buildFallbackAnalysis(candidate))

    let ignore = false

    async function runAnalysis() {
      const result = await analyzeResumeCandidate(candidate, candidate.resumeLink || undefined)
      if (!ignore) {
        setAnalysis(result)
        setStatus("ready")
      }
    }

    runAnalysis()

    return () => {
      ignore = true
    }
  }, [candidate.id, candidate.resumeLink, errorKey])

  const canShowPdf = Boolean(candidate.resumeLink)

  return (
    <Card className="flex min-h-[640px] flex-col overflow-hidden p-0 text-[12.8px] leading-[1.75] text-[#3a3f46]">
      <div className="border-b border-line-2 px-5 py-4">
        <h3 className="font-display text-base">
          <RedactedName name={candidate.candidateName} />
        </h3>
        <div className="mt-1 text-[12.5px] text-muted">{candidate.appliedRole}</div>
      </div>

      {!canShowPdf ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 py-10 text-center text-muted">
          <AlertCircle className="h-6 w-6" aria-hidden />
          <div>No resume is available for this application yet.</div>
        </div>
      ) : status === "loading" ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-10 text-center text-muted">
          <Hourglass className="h-6 w-6 animate-pulse" aria-hidden />
          <div>Loading resume preview…</div>
        </div>
      ) : status === "error" ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-10 text-center text-muted">
          <AlertCircle className="h-6 w-6" aria-hidden />
          <div>The resume preview could not be loaded.</div>
          <button
            type="button"
            onClick={() => {
              setErrorKey((value) => value + 1)
              onRetry()
            }}
            className="rounded-lg border border-ai bg-ai px-3 py-2 text-[12.8px] font-semibold text-white"
          >
            Retry
          </button>
        </div>
      ) : (
        <ResumePdfViewer
          resumeUrl={candidate.resumeLink}
          onLoadSuccess={() => {
            setStatus("ready")
          }}
          onLoadError={() => {
            setStatus("error")
            onRetry()
          }}
        />
      )}

      <div className="border-t border-line-2 px-5 py-4">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-teal-deep">Local AI Snapshot</div>
          <div className="flex gap-2">
            {candidate.resumeLink ? (
              <>
                <a href={candidate.resumeLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[11px] font-semibold text-ai">
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                  Open
                </a>
                <a href={candidate.resumeLink} download className="inline-flex items-center gap-1 text-[11px] font-semibold text-ai">
                  <FileDown className="h-3.5 w-3.5" aria-hidden />
                  Download
                </a>
              </>
            ) : null}
          </div>
        </div>
        <div className="space-y-2 text-[12.5px] text-muted">
          <div><b>Summary:</b> {analysis.summary}</div>
          <div><b>Recommendation:</b> {analysis.recommendation}</div>
          <div><b>Score:</b> {analysis.score ?? "—"}/100</div>
          <div><b>ATS compatibility:</b> {analysis.atsScore}/100</div>
          <div><b>Keyword coverage:</b> {analysis.keywordCoverage}%</div>
        </div>
      </div>
    </Card>
  )
}

function AnalysisPanel({
  c,
  onExport,
}: {
  c: LiveCandidate
  onExport: () => void
}) {
  const [notes, setNotes] = useState(c.notes)
  const [rerunLabel, setRerunLabel] = useState<"idle" | "running" | "done">("idle")
  const [analysis, setAnalysis] = useState(() => buildFallbackAnalysis(c))

  useEffect(() => {
    setNotes(c.notes)
    setAnalysis(buildFallbackAnalysis(c))

    let ignore = false

    async function loadAnalysis() {
      const result = await analyzeResumeCandidate(c, c.resumeLink || undefined)
      if (!ignore) {
        setAnalysis(result)
      }
    }

    loadAnalysis()

    return () => {
      ignore = true
    }
  }, [c.id, c.resumeLink, c.notes])

  function rerun() {
    setRerunLabel("running")
    setTimeout(() => {
      setRerunLabel("done")
      setTimeout(() => setRerunLabel("idle"), 1400)
    }, 1100)
  }

  if (analysis.score === null) {
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
          <Badge tone={recommendationTone(analysis.recommendation)}>{analysis.recommendation}</Badge>
        </PanelHead>
        <div className="flex items-center gap-[18px]">
          <Gauge score={analysis.score} />
          <div className="flex-1 text-[12.5px] leading-relaxed text-muted">
            <b className="text-foreground">Interview Recommendation:</b> {analysis.recommendation}. Score reflects weighted
            match across skills (40%), experience (30%), education (15%) and certifications (15%), per REQ-1042 rubric
            v3.
          </div>
        </div>
        <div className="mt-3 flex items-start gap-2 rounded-[10px] bg-ai-tint px-3 py-2.5 text-[11.5px] leading-relaxed text-[#3f41a8]">
          <Sparkles className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" aria-hidden />
          <span>
            <b>AI Resume Summary</b>
            <br />
            {analysis.summary}
          </span>
        </div>
      </Card>

      {/* Match breakdown */}
      <Card className="p-5">
        <PanelHead title="Match Breakdown">
          <BiasBadge bias={c.bias} />
        </PanelHead>
        <MatchRow label="Skill Match" value={analysis.skillMatch ?? 0} color="var(--color-teal)" />
        <MatchRow label="Experience Match" value={analysis.expMatch ?? 0} color="var(--color-ai)" />
        <MatchRow label="Education Match" value={analysis.eduMatch ?? 0} color="var(--color-success)" />
        <MatchRow label="Certification Match" value={analysis.certMatch ?? 0} color="var(--color-warn)" />
      </Card>

      {/* Skills matched vs missing */}
      <Card className="p-5">
        <PanelHead title="Skills — Matched vs. Missing" />
        <div className="flex flex-wrap gap-2">
          {analysis.matchedSkills.map((s) => (
            <span key={s} className="flex items-center gap-1 rounded-full bg-success-tint px-2.5 py-1 text-[11.5px] text-success">
              <Check className="h-3 w-3" aria-hidden />
              {s}
            </span>
          ))}
          {analysis.missingSkills.map((s) => (
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

      <Card className="p-5">
        <PanelHead title="Resume Highlights" />
        <ul className="space-y-2 text-[12.5px] text-muted">
          {analysis.highlights.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <Check className="mt-0.5 h-3.5 w-3.5 text-success" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="p-5">
        <PanelHead title="Strengths & Weaknesses" />
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-success">Strengths</div>
            <ul className="space-y-1 text-[12.5px] text-muted">
              {analysis.strengths.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
          <div>
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-danger">Weaknesses</div>
            <ul className="space-y-1 text-[12.5px] text-muted">
              {analysis.weaknesses.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      <Card className="p-5">
        <PanelHead title="JD Match Signals" />
        <div className="space-y-2 text-[12.5px] text-muted">
          <div><b>Experience:</b> {analysis.experience}</div>
          <div><b>Education:</b> {analysis.education}</div>
          <div><b>JD match:</b> {analysis.jdMatch}%</div>
          <div><b>ATS compatibility:</b> {analysis.atsScore}/100</div>
          <div><b>Keyword coverage:</b> {analysis.keywordCoverage}%</div>
        </div>
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
  searchQuery,
  statusFilter,
}: {
  activeId: string
  onSelect: (id: string) => void
  onExport: (id: string) => void
  searchQuery: string
  statusFilter: string
}) {
  const [candidates, setCandidates] = useState<LiveCandidate[]>([])
  const [loading, setLoading] = useState(true)
  const [retryKey, setRetryKey] = useState(0)

  useEffect(() => {
    let ignore = false

    async function loadCandidates() {
      setLoading(true)

      try {
        const data = await getLiveCandidates()

        if (!ignore) {
          setCandidates(data)
          setLoading(false)
        }
      } catch {
        if (!ignore) {
          setCandidates([])
          setLoading(false)
        }
      }
    }

    loadCandidates()

    return () => {
      ignore = true
    }
  }, [retryKey])

  const filteredCandidates = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return candidates.filter((candidate) => {
      const matchesQuery = !query || candidate.candidateName.toLowerCase().includes(query) || candidate.appliedRole.toLowerCase().includes(query)
      const matchesStatus = statusFilter === "all" || candidate.status === statusFilter
      return matchesQuery && matchesStatus
    })
  }, [candidates, searchQuery, statusFilter])

  const active = useMemo(() => {
    if (!filteredCandidates.length) return null
    return filteredCandidates.find((candidate) => candidate.id === activeId) ?? filteredCandidates[0]
  }, [activeId, filteredCandidates])

  if (loading) {
    return (
      <div className="flex min-h-[360px] items-center justify-center rounded-2xl border border-line bg-surface px-6 py-10 text-center text-muted">
        Loading candidates…
      </div>
    )
  }

  if (!active) {
    return (
      <div className="flex min-h-[360px] items-center justify-center rounded-2xl border border-line bg-surface px-6 py-10 text-center text-muted">
        No live candidates available yet.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="scroll-thin flex gap-2 overflow-x-auto pb-1">
        {filteredCandidates.length ? filteredCandidates.map((candidate) => (
          <button
            key={candidate.id}
            type="button"
            onClick={() => onSelect(candidate.id)}
            className={`flex flex-shrink-0 items-center gap-2 rounded-xl border bg-surface py-1.5 pl-1.5 pr-3 text-[12.5px] transition ${
              candidate.id === active.id ? "border-ink shadow-[0_0_0_1px_var(--color-ink)]" : "border-line"
            }`}
          >
            <Avatar initials={candidate.initials} className="h-[26px] w-[26px] text-[10.5px]" />
            <div className="text-left">
              <RedactedName name={candidate.candidateName} />
              <div className="text-[10px] text-faint">{candidate.status}</div>
            </div>
          </button>
        )) : <div className="rounded-lg border border-line bg-surface px-3 py-2 text-sm text-muted">No candidates match the current filters.</div>}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.15fr]">
        <ResumeDoc candidate={active} onRetry={() => setRetryKey((value) => value + 1)} />
        <AnalysisPanel c={active} onExport={() => onExport(active.id)} />
      </div>
    </div>
  )
}
