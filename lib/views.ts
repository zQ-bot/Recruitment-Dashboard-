export type ViewId = "overview" | "pipeline" | "viewer" | "analytics" | "bias" | "interviews"

export const viewMeta: Record<ViewId, { title: string; subtitle: string }> = {
  overview: {
    title: "Dashboard Overview",
    subtitle: "Hiring health across all open requisitions",
  },
  pipeline: {
    title: "Candidate Pipeline",
    subtitle: "Kanban view of every stage, ranked by AI Hiring Score",
  },
  viewer: {
    title: "Resume Viewer & AI Evaluation",
    subtitle: "Grounded, evidence-cited candidate scoring",
  },
  analytics: {
    title: "Analytics Dashboard",
    subtitle: "Screening throughput, score distribution & fairness trends",
  },
  bias: {
    title: "Bias & Fairness",
    subtitle: "Guardrails, flags and audit trail for responsible AI screening",
  },
  interviews: {
    title: "Interview Planning",
    subtitle: "Panel schedules, prep notes and priority follow-ups",
  },
}
