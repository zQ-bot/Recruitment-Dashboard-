"use client"

import { useEffect, useState } from "react"

export default function ResumePdfViewer({
  resumeUrl,
  onLoadSuccess,
  onLoadError,
}: {
  resumeUrl: string
  onLoadSuccess: () => void
  onLoadError: () => void
}) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(false)
  }, [resumeUrl])

  return (
    <div className="flex-1 overflow-auto bg-[#f8f8f7] p-3">
      <iframe
        src={resumeUrl}
        title="Resume preview"
        className="h-full min-h-[420px] w-full rounded-lg border border-line bg-white"
        onLoad={() => {
          setReady(true)
          onLoadSuccess()
        }}
        onError={() => {
          setReady(false)
          onLoadError()
        }}
      />
      {!ready && (
        <div className="mt-3 text-center text-[12.5px] text-muted">Loading preview…</div>
      )}
    </div>
  )
}
