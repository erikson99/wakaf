"use client"

import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { CheckCircle, CalendarCheck } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import axios from "axios";
import { WAGW_SERVER } from "@/app/app.config"
import CopyText from "@/components/CopyText"

// // Global baseURL
// axios.defaults.baseURL = "http://57.129.103.176:1799/";

export default function ThankYouPage() {
  const searchParams = useSearchParams()
  const uniqueId = searchParams.get("id")
  const [donationDetails, setDonationDetails] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const hasPostedRef = useRef(false) // 👈 Track axios call

  useEffect(() => {
    if (!uniqueId) {
      setError("No donation ID found")
      setIsLoading(false)
      return
    }

    const fetchDonation = async () => {
      try {
        const response = await fetch(`/api/donations/${uniqueId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch donation details")
        }
        const data = await response.json()
        setDonationDetails(data)

        // call sendWhatsMsg function
        const registerTemplate =
`السَّلاَمُ عَلَيْكُمْ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ

Alhamdulillaah, *Komitmen Wakaf* Anda sudah kami catat sebagai berikut:
   Nama: ${data.name}
   Alamat: ${data.address}
   No. HP: ${data.cellphone}
   Jml Voucher: ${data.quantity}
   Total: *Rp ${data.grand_total.toLocaleString("id-ID", { minimumFractionDigits: 0 })}*

Silakan *Transfer* ke:

🏦 *Bank Syariah Indonesia (BSI)*
🧾 *7251571346*
a.n. Pembangunan Masjid Qoryatussalam

kemudian 📤 *Konfirmasi Transfer* ke: https://s.id/WakafTunaiQS
dengan 🔒 *Kode Registrasi*: *${data.unique_id}*

وَالسَّلَامُ عَلَيْكُمْ وَرَحْمَةُاللَّهِ وَبَرَكَاتُهُ

*Panitia Pembangunan Masjid Qoryatussalam*
_This is an automated message system. Please do not reply._`;

        const registerMessage = {
          phone: data.cellphone,
          message: registerTemplate
        };

        // ✅ Prevent axios.post from running twice
        if (!hasPostedRef.current) {
          hasPostedRef.current = true

          await fetch('/wa/send/message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(registerMessage),
          })

          console.log("Notification sent successfully")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDonation()
  }, [uniqueId])

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
        {isLoading ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-600">Loading wakaf details...</p>
            </CardContent>
          </Card>
        ) : error ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center">
                <CheckCircle className="h-16 w-16 text-green-600" />
              </div>
              <CardTitle className="mt-4 text-3xl text-green-900">Jazaakallaah!</CardTitle>
              <p className="mt-2 text-green-600">Alhamdulillaah, Komitmen Wakaf Anda telah dicatat.</p>
            </CardHeader>
            <CardContent className="space-y-6 text-green-700">
              {/* Donation Details */}
              <div className="space-y-4 rounded-lg bg-gray-50 p-6">
                <h3 className="font-semibold text-green-900">Detil Wakaf</h3>

                <div className="space-y-3">
                  <div className="flex justify-between border-b border-green-200 pb-2">
                    <span className="text-green-600">Nama:</span>
                    <span className="font-medium text-green-900">{donationDetails?.name}</span>
                  </div>

                  <div className="flex justify-between border-b border-green-200 pb-2">
                    <span className="text-green-600">Alamat:</span>
                    <span className="font-medium text-green-900">{donationDetails?.address}</span>
                  </div>

                  <div className="flex justify-between border-b border-green-200 pb-2">
                    <span className="text-green-600">No. HP:</span>
                    <span className="font-medium text-green-900">{donationDetails?.cellphone}</span>
                  </div>

                  <div className="flex justify-between border-b border-green-200 pb-2">
                    <span className="text-green-600">Jumlah Voucher Wakaf:</span>
                    <span className="font-medium text-green-900">{donationDetails?.quantity}</span>
                  </div>

                  <div className="flex justify-between border-b border-green-200 pb-2">
                    <span className="text-green-600">Total Wakaf: Rp</span>
                    <span className="font-medium text-green-900">{donationDetails?.grand_total.toLocaleString("id-ID", { minimumFractionDigits: 0 })}</span>
                  </div>
                </div>
              </div>

              {/* Unique ID */}
              <div className="rounded-lg bg-blue-50 p-6 text-center">
                <p className="text-sm text-gray-600 font-bold">Kode Registrasi Anda</p>
                <CopyText text={uniqueId  || "No text"} textClassName="text-3xl font-bold text-green-700" className="mt-1 font-mono text-xl font-bold text-blue-700"tooltipPosition="top" />
                <p className="mt-1 text-xs text-gray-600">Mohon disimpan untuk Konfirmasi</p>
              </div>

              <div className="rounded-lg bg-green-50 p-6 text-center">
                {/* <p className="text-sm text-gray-600 font-bold">
                  <img src="/icon-bsi.png" alt="Bank Syariah Indonesia" width={20} height={20} />
                  Bank Syariah Indonesia (BSI)
                </p> */}
                <p className="flex items-center justify-center gap-2 text-sm text-gray-600 font-bold">
                  <img
                    src="/icon-bsi.png"
                    alt="Bank Syariah Indonesia"
                    width={25}
                    height={25}
                    className="inline-block"
                  />
                  Bank Syariah Indonesia (BSI)
                </p>
                <CopyText text="7251571346" textClassName="text-xl font-bold text-blue-700" className="mt-1 font-mono text-xl font-bold text-blue-700"tooltipPosition="top" />
                <p className="mt-1 text-sm text-gray-600">a.n. Pembangunan Masjid Qoryatussalam</p>
              </div>

              {/* Confirmation Button */}
              <Link href="/confirm">
                <Button className="w-full text-md text-yellow-300 bg-green-600 hover:bg-green-700" size="lg" style={{ cursor: 'pointer' }}>
                  <CalendarCheck className="h-4 w-4 text-yellow-300" />
                  Konfirmasi
                </Button>
              </Link>

              {/* Back to Home */}
              <div className="mt-5 text-center">
                <Link href="/" className="text-md text-green-600 hover:underline">
                  Kembali ke Beranda
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
