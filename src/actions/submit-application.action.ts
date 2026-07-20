"use server"

import { createAdminClient } from "@/lib/supabase/server"

export async function submitApplicationAction(formData: FormData) {
  try {
    const supabase = await createAdminClient()

    const file = formData.get("resume") as File
    const email = formData.get("email") as string

    if (!file || !email) {
      return { success: false, error: "Missing required fields." }
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const fileExt = file.name.split(".").pop()
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `applications/${fileName}`

    const { data: storageData, error: storageError } = await supabase.storage
  .from("resumes")
  .upload(filePath, buffer, {
    contentType: file.type,
    upsert: false,
  })

console.log("Storage Data:", storageData)
console.log("Storage Error:", storageError)

if (storageError) {
  console.error(storageError)
  throw new Error(JSON.stringify(storageError))
}


    let candidateId: string
    const { data: existingCandidate, error: existingCandidateError } = await supabase
      .from("candidates")
      .select("id")
      .eq("email", email)
      .maybeSingle<{ id: string }>()

    if (existingCandidateError) throw new Error(`Candidate lookup failed: ${existingCandidateError.message}`)

    if (existingCandidate) {
      candidateId = existingCandidate.id
    } else {
      const { data: newCandidate, error: candidateError } = await supabase
        .from("candidates")
        .insert({
          email,
          full_name: formData.get("fullName") as string,
          phone: (formData.get("phone") as string) || null,
          linkedin_url: (formData.get("linkedIn") as string) || null,
          github_url: (formData.get("github") as string) || null,
          portfolio_url: (formData.get("portfolio") as string) || null,
        } as never)
        .select("id")
        .single<{ id: string }>()

      if (candidateError) throw new Error(`Failed to create candidate: ${candidateError.message}`)
      candidateId = newCandidate.id
    }

    const jobTitleMap: Record<string, string> = {
      frontend: "Frontend Engineer",
      backend: "Backend Engineer",
      fullstack: "Full Stack Engineer",
      design: "UI/UX Designer",
    }

    const mappedTitle = jobTitleMap[formData.get("jobId") as string] || "Frontend Engineer"

    const { data: jobData } = await supabase.from("jobs").select("id").eq("title", mappedTitle).limit(1).single<{ id: string }>()

    const { data: application, error: applicationError } = await supabase
      .from("applications")
      .insert({
        candidate_id: candidateId,
        job_id: jobData?.id,
        current_company: (formData.get("currentCompany") as string) || null,
        current_position: (formData.get("currentPosition") as string) || null,
        years_of_experience: Number(formData.get("yearsOfExperience")),
        expected_salary: (formData.get("expectedSalary") as string) || null,
        preferred_location: (formData.get("preferredLocation") as string) || null,
        notice_period: (formData.get("noticePeriod") as string) || null,
        resume_url: storageData.path,
      } as never)
      .select("id")
      .single<{ id: string }>()

    if (applicationError) throw new Error(`Application error: ${applicationError.message}`)

    return { success: true, applicationId: application.id.split("-")[0].toUpperCase() }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred."
    console.error("Submission Error:", error)
    return { success: false, error: message }
  }
}
