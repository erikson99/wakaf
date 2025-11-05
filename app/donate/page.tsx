"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { SendHorizonal, ContactRound, MapPinHouse, Smartphone, Ticket } from "lucide-react"
import { VOUCHER_PRICE } from "@/app/app.config"


export default function DonatePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    cellphone: "",
    quantity: 1,
  })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const grandTotal = formData.quantity * VOUCHER_PRICE

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Math.max(1, Number.parseInt(value) || 1) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const response = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          quantity: Number.parseInt(formData.quantity.toString()),
          grand_total: grandTotal,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to submit donation")
      }

      const data = await response.json()

      router.push(`/thank-you?id=${data.unique_id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="border-b border-green-100 bg-white">
        <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80">
            <img src="logo-dkmqs.png" alt="Masjid Qoryatussalam" className="h-8 w-8"/>
            <span className="text-md font-bold text-green-900">Panitia Pembangunan Masjid Qoryatussalam</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <div className="flex justify-center">
              <img src="logo-dkmqs.png" alt="Masjid Qoryatussalam" className="h-24 w-24" />
            </div>
            <CardTitle className="text-2xl text-center  text-green-900">Registrasi Komitmen Wakaf</CardTitle>
            <p className="mt-2 text-center text-green-700 font-bold">
              - Data Muwakif -
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div className="space-y-2 text-green-700">
                <Label htmlFor="name">
                  <ContactRound className="h-4 w-4 text-yellow-700" />
                  Nama *</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Fulan"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Address */}
              <div className="space-y-2 text-green-700">
                <Label htmlFor="address">
                  <MapPinHouse className="h-4 w-4 text-yellow-700" />
                  Alamat/Blok *</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="Z-01"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Cellphone */}
              <div className="space-y-2 text-green-700">
                <Label htmlFor="cellphone">
                  <Smartphone className="h-4 w-4 text-yellow-700" />
                  No. HP *</Label>
                <Input
                  id="cellphone"
                  name="cellphone"
                  type="tel"
                  placeholder="No. HP"
                  value={formData.cellphone}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Quantity */}
              <div className="space-y-2 text-green-700">
                <Label htmlFor="quantity">
                  <Ticket className="h-4 w-4 text-yellow-700" />
                  Jumlah Voucher (@ <strong>Rp {VOUCHER_PRICE.toLocaleString("id-ID", { minimumFractionDigits: 0 })},-</strong>) *</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Grand Total */}
              <div className="rounded-lg bg-green-50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-green-900">Total Wakaf:</span>
                  <span className="text-2xl font-bold text-green-700">{grandTotal.toLocaleString("id-ID", { minimumFractionDigits: 0 })}</span>
                </div>
              </div>

              {/* Error Message */}
              {error && <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</div>}

              {/* Submit Button */}
              <Button type="submit" className="w-full text-md text-yellow-300 bg-green-600 hover:bg-green-700" disabled={isLoading} size="lg" style={{ cursor: 'pointer' }}>
                <SendHorizonal className="h-4 w-4 text-yellow-300" />
                {isLoading ? "Submitting..." : "Kirim Komitmen"}
              </Button>

              {/* Back Link */}
              <div className="text-center">
                <Link href="/" className="text-md text-green-600 hover:underline">
                  Kembali ke Beranda
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
