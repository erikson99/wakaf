import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const supabase = await createClient()

    // Get the list of existing buckets
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()

    if (listError) {
      console.error("[v0] Error listing buckets:", listError)
      return NextResponse.json({ error: "Failed to list buckets" }, { status: 500 })
    }

    // Check if proof-of-transfer bucket exists
    const bucketExists = buckets?.some((b) => b.name === "proof-of-transfer")

    if (!bucketExists) {
      // Create the bucket
      const { data: createData, error: createError } = await supabase.storage.createBucket("proof-of-transfer", {
        public: true,
      })

      if (createError) {
        console.error("[v0] Error creating bucket:", createError)
        return NextResponse.json({ error: `Failed to create bucket: ${createError.message}` }, { status: 500 })
      }

      console.log("[v0] Bucket created successfully:", createData)
    }

    return NextResponse.json({
      message: "Storage bucket is ready",
      bucketExists: bucketExists,
      bucketName: "proof-of-transfer",
    })
  } catch (error) {
    console.error("[v0] Setup storage error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
