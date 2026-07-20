export interface Database {
  public: {
    Tables: {
      candidates: {
        Row: {
          id: string
          email: string
          full_name: string
          phone: string | null
          linkedin_url: string | null
          github_url: string | null
          portfolio_url: string | null
          created_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["candidates"]["Row"], "id" | "created_at">
      }
      applications: {
        Row: {
          id: string
          candidate_id: string
          job_id: string
          status: string
          current_company: string | null
          current_position: string | null
          years_of_experience: number | null
          expected_salary: string | null
          preferred_location: string | null
          notice_period: string | null
          resume_url: string
          created_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["applications"]["Row"], "id" | "created_at" | "status">
      }
      jobs: {
        Row: {
          id: string
          title: string
          status: string
          created_at: string
        }
      }
    }
  }
}
