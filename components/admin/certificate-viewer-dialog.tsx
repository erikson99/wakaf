"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, X, BookType, Images } from "lucide-react"
import Image from "next/image"
import { Textarea } from "@/components/ui/textarea"


interface Donation {
  id: string
  name: string
  cellphone: string
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
  const MAX_ROWS = 5;

  const captionTemplate =
`السَّلاَمُ عَلَيْكُمْ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ

Bapak/Ibu *${donation.name.toUpperCase()}* yang dirahmati Allah,

Atas nama Panitia Pembangunan Masjid Qoryatussalam kami mengucapkan,

جَزَاك اللهُ خَيْرًا كَثِيْرًا وَجَزَاك اللهُ اَحْسَنَ الْجَزَاء

بَارَكَ اللهُ لَك فِيْ أَهْلِك وَمَالِك
_"Semoga Allah memberkahimu dalam keluarga dan hartamu."_

آمِيْن يَا رَبَّ العَالَمِيْنَ 🤲

وَالسَّلَامُ عَلَيْكُمْ وَرَحْمَةُاللَّهِ وَبَرَكَاتُهُ

*Panitia Pembangunan Masjid Qoryatussalam*
_This is an automated message system. Please do not reply._`;

  // Initial text
  // const [textToCopy, setTextToCopy] = useState("Copy this text");
  const [textToCopy, setTextToCopy] = useState(captionTemplate);
  // State to manage copied effect
  const [isCopied, setIsCopied] = useState(false);
  // State to manage notification visibility
  const [showNotification, setShowNotification] = useState(false);
  const [showImgNotification, setShowImgNotification] = useState(false);

  const handleCopy = async () => {
    try {
    // Copy text to clipboard
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true); // Show "Copied!" effect
      setShowNotification(true); // Show notification
       // Remove "Copied!" text after 2 seconds
      setTimeout(() => setIsCopied(false), 2000);
      // Hide notification after 3 seconds
      setTimeout(() => setShowNotification(false), 3000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const handleCopyByUrl = async () => {
    const imageUrl = donation.certificate_url || "";

    try {
      // Must be in a secure context (https or localhost)
      if (!("clipboard" in navigator)) {
        alert("Clipboard API not supported in this browser.");
        return;
      }

      const img = document.createElement("img");
      img.crossOrigin = "anonymous"; // needed if the image is from another domain and CORS-enabled
      img.src = imageUrl;

      img.onload = async () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          alert("Canvas is not supported.");
          return;
        }

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(async (blob) => {
          if (!blob) {
            alert("Failed to convert image to blob.");
            return;
          }

          try {
            // @ts-ignore ClipboardItem may not be in TS lib
            const item = new ClipboardItem({ "image/png": blob });
            await navigator.clipboard.write([item]);

            setIsCopied(true); // Show "Copied!" effect
            setShowImgNotification(true); // Show notification
            // Remove "Copied!" text after 2 seconds
            setTimeout(() => setIsCopied(false), 2000);
            // Hide notification after 3 seconds
            setTimeout(() => setShowImgNotification(false), 3000);

            // alert("Image copied to clipboard!");
          } catch (err) {
            console.error("Clipboard write failed:", err);
            alert("Clipboard write failed (browser or permission issue).");
          }
        }, "image/png");
      };

      img.onerror = () => {
        alert("Failed to load image. Check the URL and CORS.");
      };
    } catch (err) {
      console.error(err);
      alert("Unexpected error while copying image.");
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-green-900">Voucher Digital - {donation.unique_id}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm text-green-700">
              <strong>Nama:</strong> {donation.name} - {donation.cellphone}
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
          {/* Notification */}
          {showImgNotification && (
            <div
              style={{
                position: "fixed",
                bottom: "20px",
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: "#333",
                color: "#fff",
                padding: "10px 20px",
                borderRadius: "4px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                zIndex: 1000,
                transition: "opacity 0.3s ease-in-out",
              }}
            >
              Voucher copied!
            </div>
          )}

          <div className="flex items-center justify-center rounded-lg border border-gray-200 bg-white p-6">
            <Textarea
              rows={MAX_ROWS}
              className="resize-y overflow-y-auto text-base leading-6"
              style={{ maxHeight: '120px' }} // 24px * 5 = 120px
              defaultValue={captionTemplate}
              onChange={(e) => setTextToCopy(e.target.value)}
            />
          </div>
          {/* Notification */}
          {showNotification && (
            <div
              style={{
                position: "fixed",
                bottom: "20px",
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: "#333",
                color: "#fff",
                padding: "10px 20px",
                borderRadius: "4px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                zIndex: 1000,
                transition: "opacity 0.3s ease-in-out",
              }}
            >
              Caption copied!
            </div>
          )}

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
              onClick={handleCopyByUrl}
              title="Copy Voucher"
            >
              <Images className="mr-2 h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={handleCopy}
              title="Copy Caption"
            >
              <BookType className="mr-2 h-4 w-4" />
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
