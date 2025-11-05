import { createAdminClient } from "@/lib/supabase/server-admin"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const supabase = await createAdminClient()

    // Check if template already exists
    const { data: files } = await supabase.storage.from("certificates").list()
    const templateExists = files?.some((f) => f.name === "template.png")

    if (templateExists) {
      return NextResponse.json({ message: "Template already exists" })
    }

    // Upload the template from the URL
    const templateUrl =
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cert1-4aumJC2C7w4VuH0XN7vLpzy9i4P4Ho.png"

    const response = await fetch(templateUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch template from URL: ${response.statusText}`)
    }

    const templateBuffer = await response.arrayBuffer()

    const { error } = await supabase.storage.from("certificates").upload("template.png", templateBuffer, {
      contentType: "image/png",
      upsert: true,
    })

    if (error) {
      throw error
    }

    return NextResponse.json({ message: "Template uploaded successfully" })
  } catch (error) {
    console.error("Setup template error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to setup template" },
      { status: 500 },
    )
  }
}
