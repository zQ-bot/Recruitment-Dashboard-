"use server"

import { createAdminClient } from "@/src/lib/supabase/server"

export async function getDashboardMetrics() {
  try {
    const supabase = createAdminClient()

    const [{ data: apps, error: appsError }, { data: jobs, error: jobsError }] = await Promise.all([
      supabase.from("applications").select("id, status, created_at, candidate_id").order("created_at", { ascending: false }),
      supabase.from("jobs").select("id, title"),
    ])

    if (appsError || jobsError) {
      throw new Error(appsError?.message || jobsError?.message || "Failed to fetch dashboard metrics")
    }

    const totalApplications = apps?.length ?? 0
    const statusCounts = (apps ?? []).reduce<Record<string, number>>((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1
      return acc
    }, {})

    const monthlyApplications = (apps ?? []).reduce<Record<string, number>>((acc, app) => {
      const month = new Date(app.created_at).toLocaleString("en-US", { month: "short" })
      acc[month] = (acc[month] || 0) + 1
      return acc
    }, {})

    const roleDistribution = (jobs ?? []).reduce<Record<string, number>>((acc, job) => {
      acc[job.title] = (acc[job.title] || 0) + 1
      return acc
    }, {})

    return {
      totalApplications,
      statusCounts,
      monthlyApplications,
      roleDistribution,
      jobCount: jobs?.length ?? 0,
    }
  } catch (error) {
    console.error("Failed to load dashboard metrics:", error)
    return {
      totalApplications: 0,
      statusCounts: {},
      monthlyApplications: {},
      roleDistribution: {},
      jobCount: 0,
    }
  }
}
