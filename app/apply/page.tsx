import { ApplicationForm } from "@/components/candidate/application-form"

export const metadata = {
  title: "Apply for a Position | TalentLens AI",
  description: "Submit your application to join our team.",
}

export default function ApplyPage() {
  return (
    <div className="min-h-screen bg-muted/10 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-bold tracking-tight">Join Our Team</h1>
          <p className="text-lg text-muted-foreground">
            We are looking for talented individuals to help us build the future.
          </p>
        </div>

        <ApplicationForm />
      </div>
    </div>
  )
}
