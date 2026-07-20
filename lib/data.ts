export type Stage = "Applied" | "AI Screened" | "Shortlisted" | "Interview" | "Offer"
export type Recommendation = "Strong Yes" | "Yes" | "Maybe" | "No" | "Pending"
export type Bias = "clear" | "review"

export interface Experience {
  org: string
  title: string
  period: string
  bullets: string[]
}

export interface Candidate {
  id: string
  name: string
  initials: string
  role: string
  stage: Stage
  aiScore: number | null
  recommendation: Recommendation
  bias: Bias
  skillMatch: number | null
  expMatch: number | null
  eduMatch: number | null
  certMatch: number | null
  skills: { have: string[]; missing: string[] }
  summary: string
  resume: {
    title: string
    appliedFor: string
    exp: Experience[]
    edu: { school: string; degree: string; year: string }[]
    certs: string[]
  }
  notes: string
}

export const stages: Stage[] = ["Applied", "AI Screened", "Shortlisted", "Interview", "Offer"]

export const candidates: Candidate[] = [
  {
    id: "C-1042",
    name: "Priya Nandakumar",
    initials: "PN",
    role: "Senior Backend Engineer",
    stage: "Interview",
    aiScore: 91,
    recommendation: "Strong Yes",
    bias: "clear",
    skillMatch: 94,
    expMatch: 88,
    eduMatch: 100,
    certMatch: 75,
    skills: {
      have: ["Go", "Distributed Systems", "Kafka", "PostgreSQL", "gRPC"],
      missing: ["Kubernetes (prod-scale)"],
    },
    summary:
      "8 yrs backend engineering with direct experience scaling event-driven services; led a migration from monolith to microservices handling 40M+ daily events. Strong overlap with REQ-1042 core requirements.",
    resume: {
      title: "Senior Backend Engineer",
      appliedFor: "8 years experience · Bengaluru, IN",
      exp: [
        {
          org: "Redacted Fintech Co.",
          title: "Staff Backend Engineer",
          period: "2022 – Present",
          bullets: [
            "Led migration of payments monolith to 12 Go microservices, cutting P99 latency 43%",
            "Owns event pipeline processing 40M+ daily transactions on Kafka",
          ],
        },
        {
          org: "Redacted Cloud Systems",
          title: "Backend Engineer II",
          period: "2019 – 2022",
          bullets: [
            "Built multi-region PostgreSQL replication layer for 99.99% uptime SLA",
            "Mentored 4 junior engineers",
          ],
        },
      ],
      edu: [{ school: "Indian Institute of Technology", degree: "B.Tech, Computer Science", year: "2016" }],
      certs: ["AWS Certified Solutions Architect – Professional"],
    },
    notes: "Panel felt strong on systems design. Confirm gRPC depth in onsite.",
  },
  {
    id: "C-1043",
    name: "Daniel Okafor",
    initials: "DO",
    role: "Senior Backend Engineer",
    stage: "Shortlisted",
    aiScore: 83,
    recommendation: "Yes",
    bias: "clear",
    skillMatch: 80,
    expMatch: 85,
    eduMatch: 100,
    certMatch: 40,
    skills: {
      have: ["Java", "Spring Boot", "Distributed Systems", "MySQL"],
      missing: ["Kafka", "Kubernetes"],
    },
    summary:
      "Solid full-lifecycle backend experience in fintech and logistics domains. Strong data-modeling background; limited exposure to the streaming-infra stack this role leans on.",
    resume: {
      title: "Backend Engineer",
      appliedFor: "6 years experience · Lagos, NG (Remote)",
      exp: [
        {
          org: "Redacted Logistics Platform",
          title: "Senior Software Engineer",
          period: "2021 – Present",
          bullets: [
            "Designed order-routing service handling 2M orders/month",
            "Reduced DB query costs 30% via schema redesign",
          ],
        },
        {
          org: "Redacted Bank",
          title: "Software Engineer",
          period: "2018 – 2021",
          bullets: ["Built core-banking API layer used by 3 product teams"],
        },
      ],
      edu: [{ school: "University of Lagos", degree: "B.Sc, Computer Engineering", year: "2018" }],
      certs: [],
    },
    notes: "",
  },
  {
    id: "C-1044",
    name: "Mei Lin Tan",
    initials: "MT",
    role: "Senior Backend Engineer",
    stage: "AI Screened",
    aiScore: 76,
    recommendation: "Maybe",
    bias: "review",
    skillMatch: 70,
    expMatch: 72,
    eduMatch: 100,
    certMatch: 60,
    skills: {
      have: ["Python", "PostgreSQL", "REST APIs", "Docker"],
      missing: ["Go", "Kafka", "gRPC"],
    },
    summary:
      "Strong general backend fundamentals in Python; the required Go/Kafka stack is not represented in the resume evidence, which caps the skill-match score despite solid seniority signals.",
    resume: {
      title: "Backend Developer",
      appliedFor: "7 years experience · Singapore",
      exp: [
        {
          org: "Redacted E-commerce Co.",
          title: "Lead Backend Developer",
          period: "2020 – Present",
          bullets: [
            "Owns checkout service (Python/Django) for a 5M-user marketplace",
            "Introduced async task pipeline reducing checkout latency 22%",
          ],
        },
      ],
      edu: [{ school: "National University of Singapore", degree: "M.Sc, Computer Science", year: "2017" }],
      certs: ["Certified Kubernetes Administrator"],
    },
    notes:
      "Flagged for bias review — 11-pt score shift between blind and identity-visible pass. Pending recruiter adjudication.",
  },
  {
    id: "C-1045",
    name: "Carlos Ibáñez",
    initials: "CI",
    role: "Senior Backend Engineer",
    stage: "AI Screened",
    aiScore: 64,
    recommendation: "Maybe",
    bias: "clear",
    skillMatch: 58,
    expMatch: 60,
    eduMatch: 100,
    certMatch: 0,
    skills: {
      have: ["Node.js", "MongoDB", "REST APIs"],
      missing: ["Go", "Kafka", "PostgreSQL", "gRPC"],
    },
    summary:
      "Mid-level generalist backend profile. Stack overlap with REQ-1042 is limited — strongest fit would be a Node-centric backend req rather than this Go/Kafka-heavy role.",
    resume: {
      title: "Backend Developer",
      appliedFor: "4 years experience · Madrid, ES",
      exp: [
        {
          org: "Redacted SaaS Startup",
          title: "Backend Developer",
          period: "2021 – Present",
          bullets: [
            "Built internal tooling APIs on Node.js/Express",
            "Maintained MongoDB clusters for analytics workloads",
          ],
        },
      ],
      edu: [{ school: "Universidad Politécnica de Madrid", degree: "B.Sc, Software Engineering", year: "2020" }],
      certs: [],
    },
    notes: "",
  },
  {
    id: "C-1046",
    name: "Aisha Rahman",
    initials: "AR",
    role: "Senior Backend Engineer",
    stage: "Applied",
    aiScore: null,
    recommendation: "Pending",
    bias: "clear",
    skillMatch: null,
    expMatch: null,
    eduMatch: null,
    certMatch: null,
    skills: { have: [], missing: [] },
    summary: "Queued for AI screening — evaluation will complete within the next batch cycle (~2 min).",
    resume: { title: "Not yet processed", appliedFor: "—", exp: [], edu: [], certs: [] },
    notes: "",
  },
  {
    id: "C-1047",
    name: "James Whitfield",
    initials: "JW",
    role: "Senior Backend Engineer",
    stage: "Offer",
    aiScore: 95,
    recommendation: "Strong Yes",
    bias: "clear",
    skillMatch: 97,
    expMatch: 95,
    eduMatch: 100,
    certMatch: 90,
    skills: {
      have: ["Go", "Kafka", "Kubernetes", "PostgreSQL", "gRPC", "Distributed Systems"],
      missing: [],
    },
    summary:
      "Near-perfect coverage of REQ-1042 requirements with direct production experience across the full target stack, including Kubernetes at scale.",
    resume: {
      title: "Staff Backend Engineer",
      appliedFor: "10 years experience · Austin, US",
      exp: [
        {
          org: "Redacted Streaming Platform",
          title: "Staff Engineer",
          period: "2020 – Present",
          bullets: [
            "Architected multi-region Kafka backbone processing 200M events/day",
            "Led Kubernetes platform migration for 60+ microservices",
          ],
        },
      ],
      edu: [{ school: "University of Texas at Austin", degree: "B.S., Computer Science", year: "2014" }],
      certs: ["Certified Kubernetes Administrator", "AWS Certified Solutions Architect – Professional"],
    },
    notes: "Offer extended 07/12. Awaiting candidate decision.",
  },
]

export interface InterviewSlot {
  id: string
  candidate: string
  role: string
  time: string
  round: string
  panel: string
  status: "Booked" | "Prep" | "Pending" | "High Priority"
  notes: string
}

export const interviewSchedule: InterviewSlot[] = [
  {
    id: "INT-201",
    candidate: "Priya Nandakumar",
    role: "Senior Backend Engineer",
    time: "Today · 2:00 PM",
    round: "Panel Interview",
    panel: "Engineering + Hiring Manager",
    status: "Booked",
    notes: "Prepare a systems-design follow-up around event streaming resilience.",
  },
  {
    id: "INT-202",
    candidate: "Daniel Okafor",
    role: "Senior Backend Engineer",
    time: "Tomorrow · 11:30 AM",
    round: "Technical Screen",
    panel: "Principal Engineer",
    status: "Prep",
    notes: "Confirm schema design examples and cross-team collaboration evidence.",
  },
  {
    id: "INT-203",
    candidate: "Mei Lin Tan",
    role: "Senior Backend Engineer",
    time: "Thursday · 4:15 PM",
    round: "Hiring Panel",
    panel: "Recruiter + Engineering Lead",
    status: "High Priority",
    notes: "Bias review requires recruiter sign-off before the panel proceeds.",
  },
  {
    id: "INT-204",
    candidate: "James Whitfield",
    role: "Senior Backend Engineer",
    time: "Friday · 9:00 AM",
    round: "Offer Alignment",
    panel: "Talent + Finance",
    status: "Pending",
    notes: "Share compensation framework and relocation checklist before the call.",
  },
]

export type ScoreTone = "success" | "warn" | "danger" | "neutral"

export function scoreTone(score: number | null): ScoreTone {
  if (score === null) return "neutral"
  if (score >= 85) return "success"
  if (score >= 70) return "warn"
  return "danger"
}

export const toneClasses: Record<ScoreTone, string> = {
  success: "bg-success-tint text-success",
  warn: "bg-warn-tint text-warn",
  danger: "bg-danger-tint text-danger",
  neutral: "bg-line-2 text-muted",
}

export function recommendationTone(rec: Recommendation): ScoreTone {
  switch (rec) {
    case "Strong Yes":
    case "Yes":
      return "success"
    case "Maybe":
      return "warn"
    case "No":
      return "danger"
    default:
      return "neutral"
  }
}
