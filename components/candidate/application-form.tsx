"use client"

import { useCallback, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useDropzone } from "react-dropzone"
import { CheckCircle2, File, Loader2, UploadCloud, X } from "lucide-react"

import { submitApplicationAction } from "@/actions/submit-application.action"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { applicationSchema, type ApplicationFormValues } from "@/lib/schemas/application.schema"

export function ApplicationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [applicationId, setApplicationId] = useState("")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [submissionError, setSubmissionError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema) as any,
    defaultValues: {
      yearsOfExperience: 0,
    },
  })

  const selectedFile = watch("resume")

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        setValue("resume", file, { shouldValidate: true })

        setIsUploading(true)
        setUploadProgress(0)

        const interval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 100) {
              clearInterval(interval)
              setIsUploading(false)
              return 100
            }
            return prev + 10
          })
        }, 200)
      }
    },
    [setValue]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
  })

  const removeFile = () => {
    setValue("resume", undefined, { shouldValidate: true })
    setUploadProgress(0)
  }

  const onSubmit = async (data: ApplicationFormValues) => {
    setIsSubmitting(true)
    setSubmissionError(null)

    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (key === "resume") {
          formData.append(key, value as File)
        } else {
          formData.append(key, value.toString())
        }
      }
    })

    const result = await submitApplicationAction(formData)

    if (!result.success) {
      setSubmissionError(result.error || "Failed to submit application.")
      setIsSubmitting(false)
      return
    }

    setApplicationId(`APP-${result.applicationId}`)
    setIsSuccess(true)
    setIsSubmitting(false)
  }

  if (isSuccess) {
    return (
      <Card className="mx-auto mt-10 max-w-2xl border-green-200">
        <CardContent className="flex flex-col items-center space-y-4 pb-12 pt-10 text-center">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
          <h2 className="text-3xl font-bold tracking-tight">Application Submitted!</h2>
          <p className="max-w-sm text-muted-foreground">
            Thank you for applying. Our recruitment team will review your profile and get back to you shortly.
          </p>
          <div className="mt-6 w-full max-w-sm rounded-lg bg-muted p-4">
            <p className="mb-1 text-sm text-muted-foreground">Your Application ID</p>
            <p className="font-mono text-xl font-bold">{applicationId}</p>
          </div>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Submit Another Application
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mx-auto max-w-3xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Submit Your Application</CardTitle>
        <CardDescription>Join our team. Please fill out the form below.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Position</h3>
            <div className="space-y-2">
              <Label>Select Job Role *</Label>
              <Controller
                name="jobId"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className={errors.jobId ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select a position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="frontend">Frontend Engineer</SelectItem>
                      <SelectItem value="backend">Backend Engineer</SelectItem>
                      <SelectItem value="fullstack">Full Stack Engineer</SelectItem>
                      <SelectItem value="design">UI/UX Designer</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.jobId && <p className="text-sm text-destructive">{errors.jobId.message}</p>}
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Personal Information</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Full Name *</Label>
                <Input {...register("fullName")} placeholder="John Doe" className={errors.fullName ? "border-destructive" : ""} />
                {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input
                  {...register("email")}
                  type="email"
                  placeholder="john@example.com"
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Phone *</Label>
                <Input {...register("phone")} placeholder="+1 234 567 8900" className={errors.phone ? "border-destructive" : ""} />
                {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>LinkedIn</Label>
                <Input {...register("linkedIn")} placeholder="https://linkedin.com/in/..." />
                {errors.linkedIn && <p className="text-sm text-destructive">{errors.linkedIn.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>GitHub</Label>
                <Input {...register("github")} placeholder="https://github.com/..." />
                {errors.github && <p className="text-sm text-destructive">{errors.github.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Portfolio</Label>
                <Input {...register("portfolio")} placeholder="https://yourwebsite.com" />
                {errors.portfolio && <p className="text-sm text-destructive">{errors.portfolio.message}</p>}
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Professional Information</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Current Company</Label>
                <Input {...register("currentCompany")} placeholder="Tech Corp" />
              </div>
              <div className="space-y-2">
                <Label>Current Position</Label>
                <Input {...register("currentPosition")} placeholder="Software Engineer" />
              </div>
              <div className="space-y-2">
                <Label>Years of Experience *</Label>
                <Input
                  {...register("yearsOfExperience")}
                  type="number"
                  min="0"
                  step="0.5"
                  className={errors.yearsOfExperience ? "border-destructive" : ""}
                />
                {errors.yearsOfExperience && <p className="text-sm text-destructive">{errors.yearsOfExperience.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Expected Salary *</Label>
                <Input
                  {...register("expectedSalary")}
                  placeholder="$120,000"
                  className={errors.expectedSalary ? "border-destructive" : ""}
                />
                {errors.expectedSalary && <p className="text-sm text-destructive">{errors.expectedSalary.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Preferred Location *</Label>
                <Input
                  {...register("preferredLocation")}
                  placeholder="Remote / New York"
                  className={errors.preferredLocation ? "border-destructive" : ""}
                />
                {errors.preferredLocation && <p className="text-sm text-destructive">{errors.preferredLocation.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Notice Period *</Label>
                <Input
                  {...register("noticePeriod")}
                  placeholder="2 weeks"
                  className={errors.noticePeriod ? "border-destructive" : ""}
                />
                {errors.noticePeriod && <p className="text-sm text-destructive">{errors.noticePeriod.message}</p>}
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Resume Upload *</h3>

            {!selectedFile ? (
              <div
                {...getRootProps()}
                className={`rounded-lg border-2 border-dashed p-10 text-center transition-colors ${
                  isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
                } ${errors.resume ? "border-destructive bg-destructive/5" : ""}`}
              >
                <input {...getInputProps()} />
                <UploadCloud className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
                <p className="mb-1 text-sm font-medium">Drag & drop your resume here, or click to select</p>
                <p className="text-xs text-muted-foreground">Supported formats: PDF, DOCX (Max 10MB)</p>
              </div>
            ) : (
              <div className="rounded-lg border bg-muted/30 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="rounded-md bg-primary/10 p-2">
                      <File className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="line-clamp-1 text-sm font-medium">{selectedFile.name}</p>
                      <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  {!isUploading && (
                    <Button type="button" variant="ghost" size="icon" onClick={removeFile}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {isUploading && (
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}
              </div>
            )}
            {errors.resume && <p className="text-sm text-destructive">{errors.resume.message as string}</p>}
          </div>

          <div className="pt-4">
            {submissionError && <p className="mb-4 text-center text-sm font-medium text-destructive">{submissionError}</p>}
            <Button type="submit" className="w-full" disabled={isSubmitting || isUploading}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting Application...
                </>
              ) : (
                "Submit Application"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
