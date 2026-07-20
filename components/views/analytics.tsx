"use client"

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

const scoreDist = [
  { band: "0–20", n: 2 },
  { band: "20–40", n: 4 },
  { band: "40–60", n: 9 },
  { band: "60–70", n: 18 },
  { band: "70–80", n: 34 },
  { band: "80–90", n: 41 },
  { band: "90–100", n: 22 },
]

const conversion = [
  { label: "Backend", val: 24.6 },
  { label: "Frontend", val: 31.2 },
  { label: "Data / ML", val: 18.4 },
  { label: "Product Design", val: 29.0 },
  { label: "DevOps / SRE", val: 22.1 },
]

const biasTrend = [
  { week: "W1", flags: 1 },
  { week: "W2", flags: 2 },
  { week: "W3", flags: 1 },
  { week: "W4", flags: 3 },
  { week: "W5", flags: 2 },
  { week: "W6", flags: 4 },
  { week: "W7", flags: 3 },
  { week: "W8", flags: 3 },
]

const axisStyle = { fontSize: 10, fontFamily: "var(--font-mono)", fill: "var(--color-faint)" }

function ChartTooltip({ active, payload, label, suffix = "" }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-line bg-surface px-3 py-2 text-xs shadow-[0_8px_24px_rgba(18,22,28,0.10)]">
      <div className="font-semibold text-foreground">{label}</div>
      <div className="font-mono text-muted">
        {payload[0].value}
        {suffix}
      </div>
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
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.3fr_1fr]">
      <Card className="p-5">
        <h4 className="mb-3.5 font-display text-[13px] font-semibold">
          AI Hiring Score Distribution — all active requisitions
        </h4>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={scoreDist} margin={{ top: 8, right: 4, bottom: 0, left: -20 }}>
            <CartesianGrid vertical={false} stroke="var(--color-line-2)" />
            <XAxis dataKey="band" tick={axisStyle} tickLine={false} axisLine={{ stroke: "var(--color-line)" }} />
            <YAxis tick={axisStyle} tickLine={false} axisLine={false} />
            <Tooltip cursor={{ fill: "var(--color-line-2)" }} content={<ChartTooltip suffix=" resumes" />} />
            <Bar dataKey="n" radius={[4, 4, 0, 0]}>
              {scoreDist.map((_, i) => (
                <Cell key={i} fill={i > 4 ? "var(--color-teal)" : "var(--color-teal-tint)"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <Legend color="var(--color-teal)">Score band (0–100)</Legend>
      </Card>

      <Card className="p-5">
        <h4 className="mb-3.5 font-display text-[13px] font-semibold">Screen → Shortlist Conversion by Role Family</h4>
        <div className="space-y-3 pt-1">
          {conversion.map((c) => (
            <div key={c.label}>
              <div className="mb-1 flex justify-between text-[11.5px]">
                <span className="text-muted">{c.label}</span>
                <span className="font-mono font-semibold">{c.val}%</span>
              </div>
              <div className="h-[7px] overflow-hidden rounded-full bg-line-2">
                <div className="h-full rounded-full bg-ai" style={{ width: `${c.val * 2.4}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-5">
        <h4 className="mb-3.5 font-display text-[13px] font-semibold">Bias Flags — trailing 8 weeks</h4>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={biasTrend} margin={{ top: 8, right: 8, bottom: 0, left: -24 }}>
            <CartesianGrid vertical={false} stroke="var(--color-line-2)" />
            <XAxis dataKey="week" tick={axisStyle} tickLine={false} axisLine={{ stroke: "var(--color-line)" }} />
            <YAxis tick={axisStyle} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip cursor={{ stroke: "var(--color-line)" }} content={<ChartTooltip suffix=" flags" />} />
            <Line
              type="monotone"
              dataKey="flags"
              stroke="var(--color-warn)"
              strokeWidth={2.4}
              dot={{ r: 3.4, fill: "var(--color-warn)", strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <Legend color="var(--color-warn)">Flags requiring human review</Legend>
      </Card>

      <Card className="p-5">
        <h4 className="mb-3.5 font-display text-[13px] font-semibold">Time-to-Screen — before vs. after AI ranking</h4>
        <div className="flex h-[160px] items-end gap-7 px-2.5 pt-2.5">
          <div className="text-center">
            <div className="mx-auto h-[120px] w-14 rounded-t-lg bg-line" />
            <div className="mt-1.5 font-mono text-[13px] font-semibold">5.2 days</div>
            <div className="text-[11px] text-muted">Manual screening</div>
          </div>
          <div className="text-center">
            <div className="mx-auto h-[18px] w-14 rounded-t-lg bg-gradient-to-b from-ai to-ai-deep" />
            <div className="mt-1.5 font-mono text-[13px] font-semibold">4.2 min</div>
            <div className="text-[11px] text-muted">AI-assisted screening</div>
          </div>
        </div>
      </Card>
    </div>
  )
}
