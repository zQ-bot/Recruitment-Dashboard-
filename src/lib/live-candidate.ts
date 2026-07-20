import type { Recommendation } from "@/lib/data"

export interface LiveCandidate {
  id: string
  candidateName: string
  initials: string
  appliedRole: string
  applicationDate: string
  status: string
  resumeLink: string
  aiScore: number | null
  recommendation: Recommendation
  summary: string
  skillMatch: number | null
  expMatch: number | null
  eduMatch: number | null
  certMatch: number | null
  skills: {
    have: string[]
    missing: string[]
  }
  bias: "clear" | "review"
  notes: string
}

export function deriveInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "??"
}
