"use client"

import { LayoutGrid, ListFilter, FileText, BarChart3, ShieldCheck, CalendarDays } from "lucide-react"
import type { ViewId } from "@/lib/views"

const workspace: { id: ViewId; label: string; icon: typeof LayoutGrid }[] = [
  { id: "overview", label: "Dashboard Overview", icon: LayoutGrid },
  { id: "pipeline", label: "Candidate Pipeline", icon: ListFilter },
  { id: "viewer", label: "Resume Viewer & AI Score", icon: FileText },
  { id: "interviews", label: "Interview Planning", icon: CalendarDays },
  { id: "analytics", label: "Analytics Dashboard", icon: BarChart3 },
]

const governance: { id: ViewId; label: string; icon: typeof LayoutGrid }[] = [
  { id: "bias", label: "Bias & Fairness", icon: ShieldCheck },
]

function NavItem({
  item,
  active,
  onClick,
}: {
  item: { id: ViewId; label: string; icon: typeof LayoutGrid }
  active: boolean
  onClick: () => void
}) {
  const Icon = item.icon
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`mb-0.5 flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-left text-[13.5px] font-medium transition-colors ${
        active
          ? "bg-ai/20 text-white"
          : "text-[#aeb4bf] hover:bg-white/5 hover:text-white"
      }`}
    >
      <Icon className={`h-[17px] w-[17px] flex-shrink-0 ${active ? "text-[#8b8ff0]" : "opacity-85"}`} aria-hidden />
      {item.label}
    </button>
  )
}

export function Sidebar({
  active,
  onNavigate,
  variant = "desktop",
}: {
  active: ViewId
  onNavigate: (view: ViewId) => void
  variant?: "desktop" | "mobile"
}) {
  const visibility =
    variant === "mobile" ? "flex h-full" : "sticky top-0 hidden h-screen lg:flex"
  return (
    <aside className={`${visibility} flex-col bg-ink px-4 pb-4 pt-[22px] text-[#c9cdd4]`}>
      <div className="mb-[18px] flex items-center gap-2.5 border-b border-white/10 px-1.5 pb-[22px]">
        <div className="flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-ai to-teal font-display text-sm font-bold text-white">
          TL
        </div>
        <div>
          <div className="font-display text-[15px] font-semibold text-white">Talent Lens</div>
          <div className="text-[10.5px] uppercase tracking-[0.04em] text-[#7c828e]">AI Recruitment</div>
        </div>
      </div>

      <div className="px-2.5 pb-1.5 pt-3.5 text-[10.5px] uppercase tracking-[0.07em] text-[#5b6270]">Workspace</div>
      {workspace.map((item) => (
        <NavItem key={item.id} item={item} active={active === item.id} onClick={() => onNavigate(item.id)} />
      ))}

      <div className="px-2.5 pb-1.5 pt-3.5 text-[10.5px] uppercase tracking-[0.07em] text-[#5b6270]">Governance</div>
      {governance.map((item) => (
        <NavItem key={item.id} item={item} active={active === item.id} onClick={() => onNavigate(item.id)} />
      ))}

      <div className="mt-auto border-t border-white/10 pt-3.5">
        <div className="flex items-start gap-2 rounded-xl bg-white/5 p-2.5 text-[11.5px] leading-relaxed text-[#9ba1ac]">
          <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#8b8ff0]" aria-hidden />
          <div>
            <b className="mb-0.5 block text-xs text-[#d7dae0]">Grounded &amp; audited</b>
            Every score cites job description, resume evidence &amp; hiring policy — no unsourced judgments.
          </div>
        </div>
      </div>
    </aside>
  )
}
