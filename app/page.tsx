"use client"

import { useState } from "react"
import { X } from "lucide-react"
import type { ViewId } from "@/lib/views"
import { Sidebar } from "@/components/sidebar"
import { Topbar } from "@/components/topbar"
import { OverviewView } from "@/components/views/overview"
import { PipelineView } from "@/components/views/pipeline"
import { ResumeViewerView } from "@/components/views/resume-viewer"
import { AnalyticsView } from "@/components/views/analytics"
import { BiasView } from "@/components/views/bias"
import { InterviewPlanningView } from "@/components/views/interviews"
import { ExportModal } from "@/components/export-modal"

export default function Page() {
  const [view, setView] = useState<ViewId>("overview")
  const [blindMode, setBlindMode] = useState(false)
  const [activeCandidate, setActiveCandidate] = useState("C-1042")
  const [exportId, setExportId] = useState<string | null>(null)
  const [mobileNav, setMobileNav] = useState(false)

  function openCandidate(id: string) {
    setActiveCandidate(id)
    setView("viewer")
  }

  function navigate(v: ViewId) {
    setView(v)
    setMobileNav(false)
  }

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[236px_1fr]">
      <Sidebar active={view} onNavigate={navigate} />

      {/* Mobile nav drawer */}
      {mobileNav && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/50" onClick={() => setMobileNav(false)} />
          <div className="absolute left-0 top-0 h-full w-[236px]">
            <button
              type="button"
              onClick={() => setMobileNav(false)}
              className="absolute right-2 top-2 z-10 rounded-md p-1.5 text-white/70 hover:bg-white/10"
              aria-label="Close navigation"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
            <Sidebar active={view} onNavigate={navigate} variant="mobile" />
          </div>
        </div>
      )}

      <main className={`min-w-0 ${blindMode ? "blind" : ""}`}>
        <Topbar
          view={view}
          blindMode={blindMode}
          onToggleBlind={() => setBlindMode((b) => !b)}
          onOpenMenu={() => setMobileNav(true)}
        />
        <div className="px-5 pb-14 pt-6 md:px-7">
          {view === "overview" && <OverviewView onOpenCandidate={openCandidate} />}
          {view === "pipeline" && <PipelineView onOpenCandidate={openCandidate} />}
          {view === "viewer" && (
            <ResumeViewerView activeId={activeCandidate} onSelect={setActiveCandidate} onExport={setExportId} />
          )}
          {view === "interviews" && <InterviewPlanningView />}
          {view === "analytics" && <AnalyticsView />}
          {view === "bias" && <BiasView onOpenCandidate={openCandidate} />}
        </div>
      </main>

      <ExportModal candidateId={exportId} blindMode={blindMode} onClose={() => setExportId(null)} />
    </div>
  )
}
