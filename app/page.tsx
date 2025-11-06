"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarCheck, ShieldBan, NotebookPen } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b border-blue-100 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* <Heart className="h-8 w-8 text-blue-600" /> */}
              <img src="logo-dkmqs.png" alt="Masjid Qoryatussalam" className="h-8 w-8" />
              <h1 className="text-md font-bold text-green-900">Panitia Pembangunan Masjid Qoryatussalam</h1>
            </div>
            <nav className="flex gap-4">
              <Link href="/admin/login">
                <Button variant="outline" size="sm">
                  Admin
                  <ShieldBan className="h-4 w-4 text-green-600" />
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold tracking-tight text-green-900 sm:text-5xl">Program Wakaf Tunai Masjid Qoryatussalam</h2>
          <p className="mt-4 text-xl text-gray-600">
            DKM Qoryatussalam kembali membuka ladang amal bagi para jamaah untuk mengikuti<br/> <strong>Wakaf Pembuatan Jendela Masjid Qoryatussalam Lantai 2</strong>.
          </p>
          <p className="mt-4 text-xl text-gray-600">
            Bagi para Muhsinin yang ingin berpartisipasi, silakan mengisi form berikut ini.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/donate">
              <Button size="lg" className="text-md text-yellow-300 bg-green-600 hover:bg-green-700" style={{ cursor: 'pointer' }} title="Pendaftaran Komitmen Wakaf">
                <NotebookPen className="h-4 w-4 text-yellow-300" />
                Registrasi
              </Button>
            </Link>
            <Link href="/confirm">
              <Button size="lg" variant="outline" className="text-md text-green-700 hover:text-green-900" style={{ cursor: 'pointer' }} title="Upload Bukti Transfer">
                <CalendarCheck className="h-4 w-4 text-green-700" />
                Konfirmasi
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h3 className="text-center text-3xl font-bold text-green-900">Wakaf Tunai</h3>
          <div className="mt-12 grid gap-8 md:grid-cols-3 lg:grid-cols-3">
            <Card className="border-2 border-green-600">
              <CardHeader>
                <CardTitle className="text-center mt-4 text-green-900">Cash Waqf/Waqf al-Nuqud</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Wakaf yang dilakukan seseorang, kelompok orang, lembaga atau badan hukum dalam bentuk uang tunai, yang digunakan untuk kepentingan ibadah dan/atau kesejahteraan umat sesuai syariah.
                </p>
              </CardContent>
            </Card>
            <Card className="border-2 border-green-600">
              <CardHeader>
                <CardTitle className="text-center mt-4 text-green-900">Hadits</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-right text-gray-600">
                  قَالَ رَسُولُ اللهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ: مَنْ بَنَى مَسْجِدًا بَنَى اللَّهُ لَهُ مِثْلَهُ  فِي الجَنَّةِ
                </p>
                <p className="text-sm text-center text-gray-600">
                  <i>"Barang siapa yang membangun MASJID karena Allah, maka Allah bangunkan dia istana di surga." (H.R Bukhari & Muslim)</i>
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-600">
              <CardHeader>
                <CardTitle className="text-center mt-4 text-green-900">Rekening Pembangunan Masjid Qoryatussalam</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-center text-gray-600">
                  <strong>Bank Syariah Indonesia (BSI)</strong><br/>
                  <strong>7251 571 346</strong><br/>
                  a.n: Pembangunan Masjid Qoryatussalam
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-blue-50 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h3 className="text-center text-3xl font-bold text-green-900">Alur Wakaf</h3>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white font-bold">
                1
              </div>
              <h4 className="mt-4 text-lg font-semibold text-green-900">Mengisi Form Registrasi</h4>
              <p className="mt-2 text-gray-600">
                Isikan data Muwakif dan jumlah voucher digital yang akan diwakafkan. Setiap registran akan memperoleh Kode Registrasi yang unik.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white font-bold">
                2
              </div>
              <h4 className="mt-4 text-lg font-semibold text-green-900">Upload Bukti Transfer</h4>
              <p className="mt-2 text-gray-600">
                Gunakan Kode Registrasi untuk meng-upload Bukti Transfer Wakaf.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white font-bold">
                3
              </div>
              <h4 className="mt-4 text-lg font-semibold text-green-900">Konfirmasi dari Panitia</h4>
              <p className="mt-2 text-gray-600">
                Data wakaf Anda akan diproses dan dikonfirmasi oleh Panitia Pembangunan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8">
        <div className="mx-auto max-w-6xl px-4 text-center text-sm text-green-900 sm:px-6 lg:px-8">
          <p>&copy; 2025 Panitia Pembangunan Masjid Qoryatussalam. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
