import { createClient } from "@/lib/supabase/server"
import { generateUniqueId } from "@/lib/utils/generate-unique-id"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, address, cellphone, quantity, grand_total } = body

    if (!name || !address || !cellphone || !quantity || grand_total === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const unique_id = generateUniqueId()

    const supabase = await createClient()
    const { data, error } = await supabase.from("donations").insert({
      name,
      address,
      cellphone,
      quantity,
      grand_total,
      unique_id,
      status: "New",
    })

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to create donation" }, { status: 500 })
    }

    return NextResponse.json({ unique_id }, { status: 201 })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
