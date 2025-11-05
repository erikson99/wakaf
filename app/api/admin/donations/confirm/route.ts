import { createAdminClient } from "@/lib/supabase/server-admin"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Confirm route called")
    const supabase = await createAdminClient()

    // Check if user is authenticated and is admin
    const { data: user, error: userError } = await supabase.auth.getUser()
    if (userError || !user?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: adminUser } = await supabase.from("admin_users").select("*").eq("id", user.user.id).single()

    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { id } = body

    console.log("[v0] Confirming donation with id:", id)

    if (!id) {
      return NextResponse.json({ error: "Donation ID is required" }, { status: 400 })
    }

    // Get donation details
    const { data: donation, error: fetchError } = await supabase.from("donations").select("*").eq("id", id).single()

    console.log("[v0] Donation fetch result:", { donation, error: fetchError })

    if (fetchError || !donation) {
      return NextResponse.json({ error: "Donation not found" }, { status: 404 })
    }

    // let certificateUrl = null
    // try {
    //   const { generateCertificate } = await import("@/lib/utils/generate-certificate")
    //   certificateUrl = await generateCertificate(donation.name, donation.quantity, donation.grand_total, donation.unique_id)
    //   console.log("[v0] Certificate generated:", certificateUrl)
    // } catch (certError) {
    //   console.error(
    //     "[v0] Certificate generation skipped:",
    //     certError instanceof Error ? certError.message : String(certError),
    //   )
    //   // Certificate is optional - continue with confirmation
    // }

    const { error: updateError } = await supabase
      .from("donations")
      .update({
        status: "Done",
        // certificate_url: certificateUrl,
      })
      .eq("id", id)

    console.log("[v0] Update result:", { updateError })

    if (updateError) {
      return NextResponse.json({ error: "Failed to confirm donation" }, { status: 500 })
    }

    return NextResponse.json({
      message: "Donation confirmed successfully",
      // certificateUrl: certificateUrl,
    })
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json(
      { error: "Internal server error: " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 },
    )
  }
}
