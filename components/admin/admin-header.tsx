"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Heart, LogOut, Star } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export function AdminHeader({ userEmail }: { userEmail: string }) {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80">
            <img src="../logo-dkmqs.png" alt="Masjid Qoryatussalam" className="h-8 w-8"/>
            <span className="text-md font-bold text-green-900">Panitia Pembangunan Masjid Qoryatussalam</span>
          </Link>

          <div className="flex items-center gap-4">
            <Star className="h-4 w-4 text-green-900" />
            <span className="text-sm text-green-700">
              {userEmail}</span>
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 bg-transparent text-red-700">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
