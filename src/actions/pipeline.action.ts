"use server"

import { createAdminClient } from "@/src/lib/supabase/server"

export async function updateApplicationStatus(applicationId: string, status: string) {
  try {
    const supabase = createAdminClient()
    const { error } = await supabase.from("applications").update({ status }).eq("id", applicationId)

    if (error) {
      throw error
    }

    return { success: true }
  } catch (error) {
    console.error("Failed to update application status:", error)
    return { success: false, error: "Unable to update candidate status right now." }
  }
}
