"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Card } from "@/components/ui-bits"
import { getDashboardMetrics } from "@/src/actions/dashboard.action"

const axisStyle = { fontSize: 10, fontFamily: "var(--font-mono)", fill: "var(--color-faint)" }

function ChartTooltip({ active, payload, label, suffix = "" }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-line bg-surface px-3 py-2 text-xs shadow-[0_8px_24px_rgba(18,22,28,0.10)]">
      <div className="font-semibold text-foreground">{label}</div>
      <div className="font-mono text-muted">{payload[0].value}{suffix}</div>
    </div>
  )
}

function Legend({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <div className="mt-2.5 flex items-center gap-1.5 text-[11.5px] text-muted">
      <span className="h-2 w-2 rounded-full" style={{ background: color }} />
      {children}
    </div>
  )
}

export function AnalyticsView() {
  const [metrics, setMetrics] = useState({ totalApplications: 0, statusCounts: {}, monthlyApplications: {}, roleDistribution: {}, jobCount: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const data = await getDashboardMetrics()
      setMetrics(data)
      setLoading(false)
    }

    load()
  }, [])

  const scoreDist = useMemo(() => {
    const statuses = Object.entries(metrics.statusCounts)
    return [
      { band: "Applied", n: statuses.find(([status]) => status === "Applied")?.[1] ?? 0 },
      { band: "AI Screened", n: statuses.find(([status]) => status === "AI Screened")?.[1] ?? 0 },
      { band: "Shortlisted", n: statuses.find(([status]) => status === "Shortlisted")?.[1] ?? 0 },
      { band: "Interview", n: statuses.find(([status]) => status === "Interview")?.[1] ?? 0 },
      { band: "Offer", n: statuses.find(([status]) => status === "Offer")?.[1] ?? 0 },
    ]
  }, [metrics.statusCounts])

  const conversion = useMemo(() => {
    const roles = Object.entries(metrics.roleDistribution)
    return roles.length
      ? roles.map(([label, value]) => ({ label, val: Math.min(100, Math.round((value / Math.max(metrics.totalApplications, 1)) * 100)) }))
      : []
  }, [metrics.roleDistribution, metrics.totalApplications])

  const monthlyChart = useMemo(() => {
    return Object.entries(metrics.monthlyApplications).map(([label, value]) => ({ label, value }))
  }, [metrics.monthlyApplications])

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.3fr_1fr]">
      <Card className="p-5">
        <h4 className="mb-3.5 font-display text-[13px] font-semibold">Application status distribution</h4>
        {loading ? <div className="text-sm text-muted">Loading metrics…</div> : (
          <>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={scoreDist} margin={{ top: 8, right: 4, bottom: 0, left: -20 }}>
                <CartesianGrid vertical={false} stroke="var(--color-line-2)" />
                <XAxis dataKey="band" tick={axisStyle} tickLine={false} axisLine={{ stroke: "var(--color-line)" }} />
                <YAxis tick={axisStyle} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: "var(--color-line-2)" }} content={<ChartTooltip suffix=" applications" />} />
                <Bar dataKey="n" radius={[4, 4, 0, 0]}>
                  {scoreDist.map((_, i) => (
                    <Cell key={i} fill={i > 2 ? "var(--color-teal)" : "var(--color-teal-tint)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <Legend color="var(--color-teal)">Live status counts</Legend>
          </>
        )}
      </Card>

      <Card className="p-5">
        <h4 className="mb-3.5 font-display text-[13px] font-semibold">Role distribution</h4>
        <div className="space-y-3 pt-1">
          {conversion.length ? conversion.map((c) => (
            <div key={c.label}>
              <div className="mb-1 flex justify-between text-[11.5px]">
                <span className="text-muted">{c.label}</span>
                <span className="font-mono font-semibold">{c.val}%</span>
              </div>
              <div className="h-[7px] overflow-hidden rounded-full bg-line-2">
                <div className="h-full rounded-full bg-ai" style={{ width: `${c.val * 2.4}%` }} />
              </div>
            </div>
          )) : <div className="text-sm text-muted">No roles available yet.</div>}
        </div>
      </Card>

      <Card className="p-5">
        <h4 className="mb-3.5 font-display text-[13px] font-semibold">Monthly applications</h4>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={monthlyChart} margin={{ top: 8, right: 8, bottom: 0, left: -24 }}>
            <CartesianGrid vertical={false} stroke="var(--color-line-2)" />
            <XAxis dataKey="label" tick={axisStyle} tickLine={false} axisLine={{ stroke: "var(--color-line)" }} />
            <YAxis tick={axisStyle} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip cursor={{ stroke: "var(--color-line)" }} content={<ChartTooltip suffix=" applications" />} />
            <Line type="monotone" dataKey="value" stroke="var(--color-warn)" strokeWidth={2.4} dot={{ r: 3.4, fill: "var(--color-warn)", strokeWidth: 0 }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-5">
        <h4 className="mb-3.5 font-display text-[13px] font-semibold">Live recruitment snapshot</h4>
        <div className="flex h-[160px] items-end gap-7 px-2.5 pt-2.5">
          <div className="text-center">
            <div className="mx-auto h-[120px] w-14 rounded-t-lg bg-line" />
            <div className="mt-1.5 font-mono text-[13px] font-semibold">{metrics.totalApplications}</div>
            <div className="text-[11px] text-muted">Applications</div>
          </div>
          <div className="text-center">
            <div className="mx-auto h-[18px] w-14 rounded-t-lg bg-gradient-to-b from-ai to-ai-deep" />
            <div className="mt-1.5 font-mono text-[13px] font-semibold">{metrics.jobCount}</div>
            <div className="text-[11px] text-muted">Open roles</div>
          </div>
        </div>
      </Card>
    </div>
  )
}
