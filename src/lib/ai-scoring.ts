import type { Recommendation } from "@/lib/data"
import type { LiveCandidate } from "@/src/lib/live-candidate"

export interface ResumeAnalysis {
  score: number | null
  recommendation: Recommendation
  summary: string
  strengths: string[]
  weaknesses: string[]
  highlights: string[]
  matchedSkills: string[]
  missingSkills: string[]
  experience: string
  education: string
  skillMatch: number | null
  expMatch: number | null
  eduMatch: number | null
  certMatch: number | null
  jdMatch: number
  atsScore: number
  keywordCoverage: number
  notes: string
}

const REQUIRED_SKILLS = [
  "go",
  "distributed systems",
  "kafka",
  "postgresql",
  "grpc",
  "kubernetes",
  "microservices",
  "rest apis",
  "docker",
  "aws",
  "sql",
]

const SKILL_PATTERNS: Array<{ label: string; patterns: string[] }> = [
  { label: "Go", patterns: ["go", "golang"] },
  { label: "Distributed Systems", patterns: ["distributed systems", "distributed system"] },
  { label: "Kafka", patterns: ["kafka"] },
  { label: "PostgreSQL", patterns: ["postgresql", "postgres"] },
  { label: "gRPC", patterns: ["grpc", "grpc"] },
  { label: "Kubernetes", patterns: ["kubernetes"] },
  { label: "Microservices", patterns: ["microservices", "microservice"] },
  { label: "REST APIs", patterns: ["rest api", "rest apis", "restful api"] },
  { label: "Docker", patterns: ["docker"] },
  { label: "AWS", patterns: ["aws", "amazon web services"] },
  { label: "SQL", patterns: ["sql"] },
  { label: "Java", patterns: ["java"] },
  { label: "Python", patterns: ["python"] },
  { label: "TypeScript", patterns: ["typescript", "ts"] },
  { label: "Node.js", patterns: ["node.js", "nodejs", "node"] },
  { label: "React", patterns: ["react"] },
  { label: "CI/CD", patterns: ["ci/cd", "continuous integration", "continuous deployment"] },
]

function normalize(text: string) {
  return text.toLowerCase().replace(/\s+/g, " ").trim()
}

function pickRecommendation(score: number): Recommendation {
  if (score >= 90) return "Strong Yes"
  if (score >= 75) return "Yes"
  if (score >= 60) return "Maybe"
  return "No"
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export function buildFallbackAnalysis(candidate: LiveCandidate): ResumeAnalysis {
  const score = candidate.aiScore ?? null
  const recommendation = score === null ? "Pending" : pickRecommendation(score)

  return {
    score,
    recommendation,
    summary: candidate.summary || "Resume content is still being parsed for a local scoring snapshot.",
    strengths: ["Resume is queued for deterministic local scoring"],
    weaknesses: ["Resume text has not yet been parsed"],
    highlights: ["Waiting for uploaded resume text"],
    matchedSkills: [],
    missingSkills: REQUIRED_SKILLS,
    experience: "Experience details will be extracted once the PDF text is available.",
    education: "Education details will be extracted once the PDF text is available.",
    skillMatch: null,
    expMatch: null,
    eduMatch: null,
    certMatch: null,
    jdMatch: 0,
    atsScore: 0,
    keywordCoverage: 0,
    notes: candidate.notes,
  }
}

export function analyzeResumeText(candidate: LiveCandidate, rawText: string): ResumeAnalysis {
  const text = normalize(rawText)
  const matchedSkills = SKILL_PATTERNS.filter(({ patterns }) =>
    patterns.some((pattern) => text.includes(pattern))
  ).map(({ label }) => label)

  const matchedRequiredSkills = REQUIRED_SKILLS.filter((skill) => text.includes(skill))
  const missingSkills = REQUIRED_SKILLS.filter((skill) => !text.includes(skill))

  const yearsMatch = text.match(/(\d+)\s*(?:years?|yrs?)\s*(?:of\s*)?experience/)
  const years = yearsMatch ? Number(yearsMatch[1]) : 0

  const experienceSummary = years >= 7
    ? `${years} years of experience with strong backend delivery depth.`
    : years >= 4
      ? `${years} years of experience with solid backend engineering exposure.`
      : `${years || 3} years of experience with emerging backend engineering depth.`

  const educationMatch = /b\.tech|b\.sc|bsc|master|masters|mba|phd|bachelor|computer science|software engineering|engineering/i.test(rawText)
  const educationText = educationMatch
    ? "Education details appear to include a technical degree or equivalent engineering background."
    : "No clear degree signal was detected in the available resume text."

  const certifications = /certified|aws certified|kubernetes administrator|cka|aws/i.test(rawText)
  const skillScore = clamp(Math.round((matchedRequiredSkills.length / REQUIRED_SKILLS.length) * 100), 0, 100)
  const experienceScore = clamp(Math.round((years / 10) * 100), 0, 100)
  const educationScore = educationMatch ? 100 : 55
  const certificationScore = certifications ? 100 : 60

  const score = Math.round(skillScore * 0.45 + experienceScore * 0.25 + educationScore * 0.15 + certificationScore * 0.15)
  const jdMatch = clamp(Math.round(skillScore * 0.8 + (years >= 5 ? 10 : 0)), 0, 100)
  const atsScore = clamp(Math.round((matchedRequiredSkills.length / REQUIRED_SKILLS.length) * 85 + (educationMatch ? 8 : 0) + (certifications ? 7 : 0)), 0, 100)
  const keywordCoverage = clamp(Math.round((matchedRequiredSkills.length / REQUIRED_SKILLS.length) * 100), 0, 100)

  const recommendation = pickRecommendation(score)
  const strengths = [
    matchedSkills[0] ? `Strong signal on ${matchedSkills[0]}` : "Core backend delivery patterns detected",
    years >= 5 ? "Experience depth appears aligned with the role" : "Experience level is moderate but still relevant",
  ]

  const weaknesses = [
    missingSkills[0] ? `Missing ${missingSkills[0]} signal` : "No major gaps in core keyword coverage",
    !educationMatch ? "Education section was not clearly detected" : "Education signal is present",
  ]

  const highlights = [
    `${matchedRequiredSkills.length} core role keywords detected`,
    `${matchedSkills.length} relevant skills extracted locally`,
    `${years || 3} years of experience inferred from the resume text`,
  ]

  const summary = `${candidate.candidateName} appears ${score >= 80 ? "well aligned" : score >= 60 ? "moderately aligned" : "loosely aligned"} to the backend engineering role. ${matchedRequiredSkills.length} of ${REQUIRED_SKILLS.length} core requirements were detected locally, with ${missingSkills.length} remaining gaps.`

  return {
    score,
    recommendation,
    summary,
    strengths,
    weaknesses,
    highlights,
    matchedSkills,
    missingSkills,
    experience: experienceSummary,
    education: educationText,
    skillMatch: skillScore,
    expMatch: experienceScore,
    eduMatch: educationScore,
    certMatch: certificationScore,
    jdMatch,
    atsScore,
    keywordCoverage,
    notes: candidate.notes,
  }
}

export async function analyzeResumeCandidate(candidate: LiveCandidate, resumeUrl?: string): Promise<ResumeAnalysis> {
  if (!resumeUrl) {
    return buildFallbackAnalysis(candidate)
  }

  try {
    const response = await fetch(resumeUrl)
    if (!response.ok) throw new Error("Resume fetch failed")

    const contentType = response.headers.get("content-type") ?? ""
    const rawText = contentType.includes("text") ? await response.text() : ""

    if (rawText) {
      return analyzeResumeText(candidate, rawText)
    }

    return buildFallbackAnalysis(candidate)
  } catch {
    return buildFallbackAnalysis(candidate)
  }
}
