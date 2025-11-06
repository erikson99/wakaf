import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Program Wakaf Tunai - Masjid Qoryatussalam",
  description: "Barangsiapa yang membangun MASJID ikhlas karena ALLAH maka ALLAH akan membangunkan baginya yang serupa dengannya di surga.",
  generator: "Panitia Pembangunan Masjid Qoryatussalam",
  icons: {
    icon: "/favicon.png", // ✅ relative to /public
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
