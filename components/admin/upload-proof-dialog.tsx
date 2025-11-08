"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertCircle, Upload, Loader2 } from "lucide-react"

interface Donation {
  id: string
  name: string
  unique_id: string
  proof_of_transfer?: string
}

interface UploadProofDialogProps {
  donation: Donation | null
  onClose: () => void
  onUploadComplete: (url: string) => void
}

export function UploadProofDialog({ donation, onClose, onUploadComplete }: UploadProofDialogProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!donation) return null

  const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/gif", "application/pdf"]
  const ALLOWED_EXTENSIONS = [".png", ".jpg", ".jpeg", ".gif", ".pdf"]
  const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

  const uID = donation.unique_id

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setError(null)

    if (!file) return

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Invalid file type. Please upload PNG, JPG, GIF, or PDF files only.")
      setSelectedFile(null)
      return
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError("File size exceeds 5MB limit.")
      setSelectedFile(null)
      return
    }

    setSelectedFile(file)
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file first.")
      return
    }

    try {
      setUploading(true)
      setError(null)

    // Create FormData to send file
      const formData = new FormData()
      formData.append("unique_id", uID)
      formData.append("proof_file", selectedFile)

      const response = await fetch("/api/donations/confirm", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to confirm!")
      }

      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <Dialog open={!!donation} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-green-900">Upload Bukti Transfer</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm text-green-700">
              <strong>Nama:</strong> {donation.name}
            </p>
            <p className="text-sm text-green-700">
              <strong>Kode Registrasi: </strong>{donation.unique_id}
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Select File</label>
            <div className="relative">
                <input
                  id="unique_id"
                  type="text"
                  defaultValue={donation.unique_id}
                  required
                  hidden
                />
              <input
                ref={fileInputRef}
                type="file"
                accept=".png,.jpg,.jpeg,.gif,.pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full justify-start gap-2 border-dashed"
                disabled={uploading}
              >
                <Upload className="h-4 w-4" />
                {selectedFile ? selectedFile.name : "Choose file (PNG, JPG, GIF, PDF)"}
              </Button>
            </div>
            <p className="text-xs text-gray-500">Maximum file size: 5MB</p>
          </div>

          {error && (
            <div className="flex gap-2 rounded-lg bg-red-50 p-3">
              <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-600 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {selectedFile && (
            <div className="rounded-lg bg-blue-50 p-3">
              <p className="text-sm text-blue-800">
                ✓ {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)}MB)
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={uploading}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={!selectedFile || uploading} className="gap-2">
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
