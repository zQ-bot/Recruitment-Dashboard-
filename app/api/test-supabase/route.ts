import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!

  const supabase = createClient(url, key)

  const result = await supabase.storage.listBuckets()

  return NextResponse.json({
    url,
    keyStartsWith: key.substring(0, 15),
    result,
  })
}