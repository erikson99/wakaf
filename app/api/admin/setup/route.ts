import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const cookieStore = await cookies()
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // Handle cookie setting errors
          }
        },
      },
    })

    // Check if any admin users already exist
    const { data: existingAdmins, error: checkError } = await supabase.from("admin_users").select("id").limit(1)

    if (checkError) {
      console.error("Error checking existing admins:", checkError)
      return NextResponse.json({ error: "Database error" }, { status: 500 })
    }

    if (existingAdmins && existingAdmins.length > 3) {
      return NextResponse.json({ error: "Admin account already exists. Please login instead." }, { status: 400 })
    }

    // Create the admin user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (authError) {
      console.error("Auth error:", authError)
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    if (!authData.user) {
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
    }

    // Add the user to admin_users table
    const { error: adminError } = await supabase.from("admin_users").insert({
      id: authData.user.id,
      email: authData.user.email,
    })

    if (adminError) {
      console.error("Admin user creation error:", adminError)
      // Try to delete the auth user if admin_users insert fails
      await supabase.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json({ error: "Failed to create admin account" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Admin account created successfully" })
  } catch (error) {
    console.error("Setup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
