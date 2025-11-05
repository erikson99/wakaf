"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, X } from "lucide-react"
import Image from "next/image"

interface Donation {
  id: string
  name: string
  unique_id: string
  certificate_url?: string
  grand_total: number
}

interface CertificateViewerDialogProps {
  donation: Donation
  onClose: () => void
}

export function CertificateViewerDialog({ donation, onClose }: CertificateViewerDialogProps) {
  if (!donation.certificate_url) {
    return null
  }

  const isPdf = donation.certificate_url.endsWith(".pdf") || donation.certificate_url.includes("pdf")
  const fileName = donation.certificate_url.split("/").pop() || "cert"

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-green-900">Voucher Digital - {donation.unique_id}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm text-green-700">
              <strong>Nama:</strong> {donation.name}
            </p>
            <p className="text-sm text-green-700">
              <strong>Total Wakaf:</strong>Rp {donation.grand_total.toLocaleString("id-ID", { minimumFractionDigits: 0 })}
            </p>
          </div>

          {/* Preview */}
          <div className="flex items-center justify-center rounded-lg border border-gray-200 bg-white p-6">
            {isPdf ? (
              <div className="text-center">
                <div className="mb-4 inline-block rounded-lg bg-red-100 p-4">
                  <svg className="h-12 w-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-900">{fileName}</p>
                <p className="text-xs text-gray-500">PDF Document</p>
              </div>
            ) : (
              <div className="relative h-64 w-full">
                <Image
                  src={donation.certificate_url || "/placeholder.svg"}
                  alt="Wakaf Voucher"
                  fill
                  className="object-contain"
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={() => {
                const link = document.createElement("a")
                link.href = donation.certificate_url!
                link.download = fileName
                link.click()
              }}
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={() => window.open(donation.certificate_url, "_blank")}
            >
              Open in New Tab
            </Button>
            <Button variant="outline" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
