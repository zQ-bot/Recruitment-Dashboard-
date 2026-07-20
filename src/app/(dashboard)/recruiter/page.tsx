import { getLiveCandidates } from "@/actions/get-candidates.action"

export const metadata = {
  title: "Recruiter Dashboard | TalentLens AI",
}

export default async function RecruiterDashboardPage() {
  const liveCandidates = await getLiveCandidates()

  return (
    <div className="min-h-screen bg-background px-6 py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recruiter Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Live applications from Supabase</p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_1px_2px_rgba(18,22,28,0.06)]">
          <div className="grid grid-cols-[1.2fr_0.9fr_0.8fr_0.7fr] gap-3 border-b border-line-2 px-5 py-3 text-[10.5px] font-semibold uppercase tracking-[0.05em] text-faint">
            <span>Name</span>
            <span>Role</span>
            <span>Date</span>
            <span>Status</span>
          </div>
          {liveCandidates.length === 0 ? (
            <div className="px-5 py-6 text-sm text-muted-foreground">No applications have been submitted yet.</div>
          ) : (
            liveCandidates.map((candidate) => (
              <div key={candidate.id} className="grid grid-cols-[1.2fr_0.9fr_0.8fr_0.7fr] items-center gap-3 border-b border-line-2 px-5 py-3 text-sm last:border-none">
                <div>
                  <div className="font-semibold text-foreground">{candidate.candidateName}</div>
                  <div className="text-xs text-muted-foreground">{candidate.resumeLink}</div>
                </div>
                <div className="text-muted-foreground">{candidate.appliedRole}</div>
                <div className="text-muted-foreground">{new Date(candidate.applicationDate).toLocaleDateString()}</div>
                <div className="rounded-full bg-ai-tint px-2.5 py-1 text-center text-xs font-semibold text-ai capitalize">
                  {candidate.status}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
