"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { ContactRound, MapPinHouse, Smartphone, Ticket, Sigma, Save, CircleX } from "lucide-react"
import { VOUCHER_PRICE } from "@/app/app.config"
import { motion, AnimatePresence } from "framer-motion"


interface Donation {
  id: string
  name: string
  address: string
  cellphone: string
  quantity: number
  grand_total: number
  status: "New" | "Confirmed" | "Done"
  unique_id: string
  created_at: string
}

interface EditDonationDialogProps {
  donation: Donation
  onClose: () => void
  onSave: (donation: Donation) => void
}

export function EditDonationDialog({ donation, onClose, onSave }: EditDonationDialogProps) {
  const [formData, setFormData] = useState(donation)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    const numericValue = Number(value) || 0

    setFormData(prev => {
      const updated = {
        ...prev,
        [name]: name === "quantity" ? numericValue : value,
      }

      // Recalculate grand_total if quantity changes
      if (name === "quantity") {
        updated.grand_total = numericValue * VOUCHER_PRICE
      }
      return updated
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const response = await fetch(`/api/admin/donations/${donation.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to update donation")

      const updated = await response.json()
      onSave(updated)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-green-900">
            Edit Wakaf</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-green-700">
              <ContactRound className="h-4 w-4 text-yellow-700" />
              Nama</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} disabled={isLoading} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-green-700">
              <MapPinHouse className="h-4 w-4 text-yellow-700" />
              Alamat/Blok</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cellphone" className="text-green-700">
              <Smartphone className="h-4 w-4 text-yellow-700" />
              No. HP</Label>
            <Input
              id="cellphone"
              name="cellphone"
              value={formData.cellphone}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity" className="text-green-700">
              <Ticket className="h-4 w-4 text-yellow-700" />
              Jumlah Voucher</Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              min="1"
              value={formData.quantity}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="grand_total" className="text-green-700">
              <Sigma className="h-4 w-4 text-yellow-700" />
              Total</Label>
              <div
                style={{
                  padding: "8px 12px",
                  background: "#f3f4f6",
                  borderRadius: 6,
                  fontWeight: "bold",
                  textAlign: "right",
                  minHeight: 40,
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={formData.grand_total} // re-trigger animation when total changes
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.25 }}
                  >
                    Rp {formData.grand_total.toLocaleString("id-ID")}
                  </motion.div>
                </AnimatePresence>
              </div>
          </div>

          {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}

          <DialogFooter>
            <Button variant="outline" onClick={onClose} disabled={isLoading} className="text-green-700">
              <CircleX className="h-4 w-4 text-yellow-700" />
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}  className="text-yellow-700">
              <Save className="h-4 w-4 text-yellow-700" />
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
