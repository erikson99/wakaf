import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const unique_id = formData.get("unique_id") as string
    const proof_file = formData.get("proof_file") as File

    if (!unique_id) {
      return NextResponse.json({ error: "Kode Registrasi tidak boleh kosong!" }, { status: 400 })
    }

    if (!proof_file) {
      return NextResponse.json({ error: "Bukti Transfer tidak boleh kosong!" }, { status: 400 })
    }

    const supabase = await createClient()

    // Find the donation
    const { data: donation, error: findError } = await supabase
      .from("donations")
      .select("*")
      .eq("unique_id", unique_id)
      .single()

    if (findError || !donation) {
      return NextResponse.json({ error: "Data Wakaf tidak ditemukan! Silakan periksa Kode Registrasi Anda." }, { status: 404 })
    }

    const fileBuffer = await proof_file.arrayBuffer()
    const fileName = `${unique_id}-${Date.now()}-${proof_file.name}`
    const filePath = `proof-of-transfer/${fileName}`

    const { error: uploadError, data: uploadData } = await supabase.storage
      .from("proof-of-transfer")
      .upload(filePath, fileBuffer, {
        contentType: proof_file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error("Upload error:", uploadError)
      return NextResponse.json({ error: `Failed to upload proof of transfer: ${uploadError.message}` }, { status: 500 })
    }

    const { data: publicUrlData } = supabase.storage.from("proof-of-transfer").getPublicUrl(filePath)

    const proofUrl = publicUrlData?.publicUrl

    if (!proofUrl) {
      return NextResponse.json({ error: "Failed to generate file URL" }, { status: 500 })
    }

    const { error: updateError } = await supabase
      .from("donations")
      .update({
        status: "Confirmed",
        proof_of_transfer: proofUrl,
      })
      .eq("unique_id", unique_id)

    if (updateError) {
      console.error("Update error:", updateError)
      return NextResponse.json({ error: "Failed to confirm donation" }, { status: 500 })
    }

    return NextResponse.json({ message: "Wakaf berhasil dikonfirmasi!" })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
