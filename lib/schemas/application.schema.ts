import { z } from "zod"

const MAX_FILE_SIZE = 10 * 1024 * 1024
const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]

export const applicationSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  phone: z.string().min(10, "Phone number must be at least 10 digits."),
  linkedIn: z.string().url("Must be a valid URL.").optional().or(z.literal("")),
  github: z.string().url("Must be a valid URL.").optional().or(z.literal("")),
  portfolio: z.string().url("Must be a valid URL.").optional().or(z.literal("")),

  currentCompany: z.string().optional(),
  currentPosition: z.string().optional(),
  yearsOfExperience: z.preprocess(
    (value) => (typeof value === "string" && value.trim() !== "" ? Number(value) : value),
    z.number().min(0, "Experience cannot be negative.")
  ),
  expectedSalary: z.string().min(1, "Expected salary is required."),
  preferredLocation: z.string().min(1, "Preferred location is required."),
  noticePeriod: z.string().min(1, "Notice period is required."),

  jobId: z.string().min(1, "Please select a job role."),

  resume: z
    .any()
    .refine((file) => file instanceof File, "Resume is required.")
    .refine((file) => file?.size <= MAX_FILE_SIZE, "Max file size is 10MB.")
    .refine(
      (file) => ACCEPTED_FILE_TYPES.includes(file?.type),
      "Only .pdf and .docx files are accepted."
    ),
})

export type ApplicationFormValues = z.infer<typeof applicationSchema>
