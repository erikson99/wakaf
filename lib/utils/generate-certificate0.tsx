import { createAdminClient } from "@/lib/supabase/server-admin"
import { createCanvas, loadImage, registerFont } from 'canvas';

export async function generateCertificate(donorName: string, amount: number, uniqueId: string): Promise<string | null> {
  try {
    const supabase = await createAdminClient()

    // Get the template image URL from public folder
    // The template is stored in Vercel Blob Storage
    const templateUrl = "/template1.png"

    // Create a simple canvas-based certificate using SVG
    const svgCertificate = `
      <svg width="1200" height="600" xmlns="http://www.w3.org/2000/svg">
        <image href="${templateUrl}" width="1200" height="600" />
        <text x="600" y="300" font-size="48" font-weight="bold" text-anchor="middle" fill="#5a3a2a" font-family="serif">
          ${escapeXml(donorName)}
        </text>
        <text x="600" y="380" font-size="36" text-anchor="middle" fill="#5a3a2a" font-family="serif">
          PKR ${amount.toLocaleString()}
        </text>
        <text x="600" y="450" font-size="24" text-anchor="middle" fill="#5a3a2a" font-family="serif">
          ID: ${uniqueId}
        </text>
      </svg>
    `

    // Convert SVG to buffer
    const svgBuffer = Buffer.from(svgCertificate)

    console.log("[v0] Certificate SVG:", svgCertificate)
    console.log("[v0] Certificate buffer:", svgBuffer)

    // Upload to Supabase Storage
    const fileName = `cert_${uniqueId}_${Date.now()}.svg`
    const { data, error } = await supabase.storage.from("certificates").upload(fileName, svgBuffer, {
      contentType: "image/svg+xml",
      upsert: false,
    })

    if (error) {
      console.error("[v0] Storage upload error:", error)
      return null
    }

    // Get public URL
    const { data: publicData } = supabase.storage.from("certificates").getPublicUrl(fileName)

    console.log("[v0] Certificate URL:", publicData.publicUrl)
    return publicData.publicUrl
  } catch (error) {
    console.error("[v0] Certificate generation error:", error)
    return null
  }
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;"
      case ">":
        return "&gt;"
      case "&":
        return "&amp;"
      case "'":
        return "&apos;"
      case '"':
        return "&quot;"
      default:
        return c
    }
  })
}
