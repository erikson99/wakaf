"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Heart, Mail, Lock, LogIn } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const supabase = createClient()
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) throw signInError

      router.push("/admin/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-green-50 to-white px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center">
            <img src="../logo-dkmqs.png" alt="Masjid Qoryatussalam" className="h-16 w-16"/>
          </div>
          <CardTitle className="mt-4 text-2xl text-green-900">Masjid Qoryatussalam</CardTitle>
          <p className="mt-2 text-sm text-green-700 font-bold">Panitia Pembangunan</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2 text-green-700">
              <Label htmlFor="email">
                <Mail className="h-4 w-4 text-yellow-700" />
                Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2 text-green-700">
              <Label htmlFor="password">
                <Lock className="h-4 w-4 text-yellow-700" />
                Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            {error && <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</div>}

            <Button type="submit" className="w-full text-yellow-300 bg-green-600 hover:bg-green-700" disabled={isLoading} size="lg" style={{ cursor: 'pointer' }}>
              <LogIn className="h-4 w-4 text-yellow-300" />
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            <div className="text-center">
              <Link href="/" className="text-sm text-green-600 hover:underline">
                Kembali ke Beranda
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
