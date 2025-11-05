"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Upload, CalendarCheck, ScanBarcode, CloudUpload } from "lucide-react"
import axios from "axios";
import Swal from "sweetalert2";


// Global baseURL
axios.defaults.baseURL = "http://57.129.103.176:1799/";

export default function ConfirmPage() {
  const [uniqueId, setUniqueId] = useState("")
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [fileName, setFileName] = useState<string>("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type (images and PDFs only)
      const validTypes = ["image/jpeg", "image/png", "image/gif", "application/pdf"]
      if (!validTypes.includes(file.type)) {
        setError("Silakan upload file format image (JPG, PNG, GIF) atau PDF")
        setProofFile(null)
        setFileName("")
        return
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB")
        setProofFile(null)
        setFileName("")
        return
      }
      setProofFile(file)
      setFileName(file.name)
      setError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      if (!uniqueId) {
        throw new Error("Kode Registrasi tidak boleh kosong!")
      }
      if (!proofFile) {
        throw new Error("Bukti Transfer tidak boleh kosong!")
      }

      // Create FormData to send file
      const formData = new FormData()
      formData.append("unique_id", uniqueId)
      formData.append("proof_file", proofFile)

      console.log("Submitting donation confirmation with file:", proofFile.name)

      const response = await fetch("/api/donations/confirm", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      console.log("Confirmation response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to confirm!")
      }


      // send notify message to Admins
//       const notifyTemplate =
// `*Konfirmasi Wakaf*
//    Nama: ${data.name}
//    Alamat: ${data.address}
//    No. HP: ${data.cellphone}
//    Jml Voucher: ${data.quantity}
//    Total: *Rp ${data.grand_total.toLocaleString("id-ID", { minimumFractionDigits: 0 })}*

// Silakan dicek pada *Dashboard Admin* dan jika sudah sesuai, silakan klik *Confirm* pada data tersebut.

// *Panitia Pembangunan Masjid Qoryatussalam*
// _This is an automated message system. Please do not reply_`;

//       console.log("Notify Template:", notifyTemplate);

//       // list all admins
//       const admins = await fetch("/api/admin/users", {
//         method: "GET",
//       })

//       const dataAdmins = await response.json()


//       const notifyMessage = {
//         phone: data.cellphone,
//         message: notifyTemplate
//       };
//       console.log("Notify Message:", notifyMessage);



      console.log("Donation confirmed successfully")
      // alert("Wakaf berhasil dikonfirmasi!")
      Swal.fire({
        title: "Konfirmasi Wakaf",
        text: "Wakaf berhasil dikonfirmasi!",
        icon: "success",
      });


      setUniqueId("")
      setProofFile(null)
      setFileName("")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      console.error("Confirmation error:", errorMessage)
      setError(errorMessage)
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
            <CardTitle className="text-center text-2xl text-green-900">Konfirmasi Wakaf</CardTitle>
            <p className="mt-2 text-sm text-green-600">
              Persiapkan 8 digit Kode Registrasi dan Bukti Transfer Wakaf Anda.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2  text-green-700">
                <Label htmlFor="unique_id">
                  <ScanBarcode className="h-4 w-4 text-yellow-700" />
                  Kode Registrasi *</Label>
                <Input
                  id="unique_id"
                  type="text"
                  placeholder="12345678"
                  value={uniqueId}
                  onChange={(e) => setUniqueId(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2 text-green-700">
                <Label htmlFor="proof_file">
                  <CloudUpload className="h-4 w-4 text-yellow-700" />
                  Upload Bukti Transfer *</Label>
                <div className="relative">
                  <input
                    id="proof_file"
                    type="file"
                    accept="image/jpeg,image/png,image/gif,application/pdf"
                    onChange={handleFileChange}
                    disabled={isLoading}
                    className="hidden"
                  />
                  <label
                    htmlFor="proof_file"
                    className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-green-300 bg-green-50 px-4 py-8 transition-colors hover:border-green-500 hover:bg-green-100"
                  >
                    <Upload className="h-5 w-5 text-green-600" />
                    <div className="text-center">
                      <p className="text-sm font-medium text-green-900">
                        {fileName || "Klik untuk upload atau drag and drop"}
                      </p>
                      <p className="text-xs text-green-600">PNG, JPG, GIF or PDF (max 5MB)</p>
                    </div>
                  </label>
                </div>
              </div>

              {error && <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</div>}

              <Button type="submit" className="w-full text-md text-yellow-300 bg-green-600 hover:bg-green-700" disabled={isLoading} size="lg" style={{ cursor: 'pointer' }}>
                <CalendarCheck className="h-4 w-4 text-yellow-300" />
                {isLoading ? "Pengecekan data..." : "Konfirmasi Wakaf"}
              </Button>

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
