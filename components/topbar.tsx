"use client"

import { Search, Menu } from "lucide-react"
import type { ViewId } from "@/lib/views"
import { viewMeta } from "@/lib/views"

export function Topbar({
  view,
  blindMode,
  onToggleBlind,
  onOpenMenu,
  searchValue,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: {
  view: ViewId
  blindMode: boolean
  onToggleBlind: () => void
  onOpenMenu: () => void
  searchValue: string
  onSearchChange: (value: string) => void
  statusFilter: string
  onStatusFilterChange: (value: string) => void
}) {
  const meta = viewMeta[view]
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-line bg-background/90 px-5 py-3.5 backdrop-blur-md md:px-7">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMenu}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-surface text-muted lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" aria-hidden />
        </button>
        <div className="flex flex-col gap-0.5">
          <h1 className="font-display text-[19px] font-semibold text-foreground">{meta.title}</h1>
          <span className="text-xs text-muted">{meta.subtitle}</span>
        </div>
      </div>

      <div className="flex items-center gap-3.5">
        <div className="hidden items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2 text-[13px] text-faint xl:flex">
          <Search className="h-4 w-4" aria-hidden />
          <input
            type="search"
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search candidates, roles, req IDs…"
            className="w-[200px] bg-transparent text-foreground placeholder:text-faint focus:outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(event) => onStatusFilterChange(event.target.value)}
          className="hidden rounded-lg border border-line bg-surface px-2.5 py-2 text-[12.5px] text-foreground xl:block"
        >
          <option value="all">All stages</option>
          <option value="Applied">Applied</option>
          <option value="AI Screened">AI Screened</option>
          <option value="Shortlisted">Shortlisted</option>
          <option value="Interview">Interview</option>
          <option value="Offer">Offer</option>
        </select>

        <div className="flex items-center gap-2.5 rounded-xl border border-line bg-surface py-1.5 pl-3.5 pr-2 shadow-[0_1px_2px_rgba(18,22,28,0.06)]">
          <div className="hidden flex-col leading-tight sm:flex">
            <b className="text-[12.5px] font-semibold">Blind Evaluation</b>
            <span className="text-[10.5px] text-muted">
              {blindMode ? "On — identity masked for scoring" : "Off — identity visible"}
            </span>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={blindMode}
            aria-label="Toggle blind evaluation"
            onClick={onToggleBlind}
            className={`relative h-6 w-11 flex-shrink-0 rounded-full transition-colors ${
              blindMode ? "bg-ink" : "bg-line"
            }`}
          >
            <span
              className={`absolute top-[3px] h-[18px] w-[18px] rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.25)] transition-all ${
                blindMode ? "left-[23px] bg-[#8b8ff0]" : "left-[3px] bg-white"
              }`}
            />
          </button>
        </div>

        <button
          type="button"
          className="flex h-[34px] w-[34px] items-center justify-center rounded-lg bg-ink-2 text-[12.5px] font-semibold text-white"
          aria-label="Account menu"
        >
          RS
        </button>
      </div>
    </header>
  )
}
