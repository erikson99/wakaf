import { createAdminClient } from "@/lib/supabase/server-admin"
import { createCanvas, loadImage, registerFont } from "canvas";
import path from "path"


export async function generateCertificate(donorName: string, qty: number, amount: number, uniqueId: string): Promise<string | null> {
  try {
    const supabase = await createAdminClient()

    // Load the template image
    const templatePath = "./public/template.jpg"
    const template = await loadImage(templatePath);

    // Load font
    registerFont(path.join(process.cwd(), "public/fonts/Arial.ttf"), { family: "Arial" })
    registerFont(path.join(process.cwd(), "public/fonts/Arialbd.ttf"), { family: "Arial", weight: "bold" })

    // Create canvas with same dimensions as template
    const canvas = createCanvas(template.width, template.height);
    const ctx = canvas.getContext('2d');

    // Draw the template image
    ctx.drawImage(template, 0, 0);

    // Configure text styling for name
    ctx.font = 'bold 55px Arial';
    ctx.fillStyle = '#ffff00';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    // Draw name (centered horizontally, positioned at 45% height)
    const nameY = template.height * 0.75;
    ctx.fillText(donorName.toUpperCase(), template.width / 29, nameY);

    // Configure text styling for amount
    ctx.font = 'bold 48px Arial';
    ctx.fillStyle = '#ffff00';

    // Generate display text
    const qtyText = `${qty} Pcs = `;
    const totalText = typeof amount === 'number' ? `Rp ${amount.toLocaleString("id-ID", { minimumFractionDigits: 0 })}` : amount
    const amountText = `${qtyText}${totalText}`;

    // Draw amount (centered horizontally, positioned at 60% height)
    const amountY = template.height * 0.85;
    ctx.fillText(amountText, template.width / 29, amountY);

    // Draw dua
    ctx.textAlign = 'center';
    const doaText = "جَزَاك اللهُ خَيْرًا كَثِيْرًا وَجَزَاك اللهُ اَحْسَنَ الْجَزَاء";
    ctx.fillText(doaText, template.width / 2, template.height * 0.95);

    // Convert canvas to buffer
    const buffer = canvas.toBuffer('image/jpeg');

    // Generate unique filename
    const filename = `cert_${uniqueId}_${Date.now()}.png`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('certificates')
      .upload(filename, buffer, {
        contentType: 'image/jpeg',
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error("Storage upload error:", error)
      return null
    }

    // Get public URL
    const { data: publicData } = supabase.storage.from("certificates").getPublicUrl(filename)

    console.log("Certificate URL:", publicData.publicUrl)
    return publicData.publicUrl
  } catch (error) {
    console.error("Certificate generation error:", error)
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
