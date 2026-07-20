"use server"

import { createAdminClient } from "@/lib/supabase/server"
import type { LiveCandidate } from "@/src/lib/live-candidate"
import { deriveInitials } from "@/src/lib/live-candidate"

export async function getLiveCandidates() {
  try {
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from("applications")
      .select(`
        id,
        status,
        created_at,
        resume_url,
        candidates (
          full_name
        ),
        jobs (
          title
        )
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching candidates:", error)
      return []
    }

    const mapped = await Promise.all(
      (data ?? []).map(async (app: any) => {
        let resumeLink = ""

        if (app.resume_url) {
          const { data: signedUrlData, error: signedUrlError } = await supabase.storage
            .from("resumes")
            .createSignedUrl(app.resume_url, 60 * 60 * 24)

          if (!signedUrlError && signedUrlData?.signedUrl) {
            resumeLink = signedUrlData.signedUrl
          } else {
            console.error("Error generating signed URL:", signedUrlError)
            resumeLink = app.resume_url
          }
        }

        return {
          id: app.id,
          candidateName: app.candidates?.full_name || "Unknown Candidate",
          initials: deriveInitials(app.candidates?.full_name || "Unknown Candidate"),
          appliedRole: app.jobs?.title || "General Application",
          applicationDate: app.created_at,
          status: app.status,
          resumeLink,
          aiScore: null,
          recommendation: "Pending",
          summary: "Resume uploaded and queued for AI screening.",
          skillMatch: null,
          expMatch: null,
          eduMatch: null,
          certMatch: null,
          skills: { have: [], missing: [] },
          bias: "clear",
          notes: "",
        } satisfies LiveCandidate
      })
    )

    return mapped
  } catch (error) {
    console.error("Unexpected error fetching live candidates:", error)
    return []
  }
}
