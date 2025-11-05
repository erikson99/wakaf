"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface Donation {
  id: string
  name: string
  unique_id: string
}

interface ConfirmDeleteDialogProps {
  donation: Donation
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDeleteDialog({ donation, onConfirm, onCancel }: ConfirmDeleteDialogProps) {
  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Donation</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-gray-600">Are you sure you want to delete this donation? This action cannot be undone.</p>
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="text-sm text-gray-600">
              <strong>Name:</strong> {donation.name}
            </p>
            <p className="text-sm text-gray-600">
              <strong>ID:</strong> {donation.unique_id}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
