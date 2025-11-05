import axios from "axios"
import { NextResponse } from "next/server"

// Global baseURL
// axios.defaults.baseURL = "http://57.129.103.176:1799/";

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const registerMessage = body

    console.log("Register Message2:", registerMessage);

    // ✅ Forward this data to your external API
    const externalResponse = await axios.post("http://57.129.103.176:1799/send/message", registerMessage);


    return NextResponse.json({
      success: true,
      externalResponse: externalResponse.data,
    })
  } catch (error: any) {
    console.error("Error in /api/notify:", error)
    return NextResponse.json(
      { success: false, message: error.message || "Failed to send notification" },
      { status: 500 }
    )
  }
}

