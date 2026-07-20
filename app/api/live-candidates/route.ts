import { NextResponse } from "next/server"
import { getLiveCandidates } from "@/src/actions/get-candidates.action"

export async function GET() {
  try {
    const candidates = await getLiveCandidates()

    return NextResponse.json(candidates)
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: "Failed to fetch candidates" },
      { status: 500 }
    )
  }
}