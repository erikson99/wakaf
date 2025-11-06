"use client"

import { useState, useMemo, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Edit2, Trash2, CheckCircle, Eye, SearchCheck, PencilRuler, IdCard } from "lucide-react"
import { EditDonationDialog } from "./edit-donation-dialog"
import { ConfirmDeleteDialog } from "./confirm-delete-dialog"
import { ProofViewerDialog } from "./proof-viewer-dialog"
import { CertificateViewerDialog } from "./certificate-viewer-dialog"
import { WAGW_SERVER } from "@/app/app.config"


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
  proof_of_transfer?: string
  certificate_url?: string
}

const ITEMS_PER_PAGE = 10

export function DonationDataTable({ initialData }: { initialData: Donation[] }) {
  const [donations, setDonations] = useState<Donation[]>(initialData)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"All" | "New" | "Confirmed" | "Done">("All")
  const [currentPage, setCurrentPage] = useState(1)
  const [editingDonation, setEditingDonation] = useState<Donation | null>(null)
  const [deletingDonation, setDeletingDonation] = useState<Donation | null>(null)
  const [viewingProof, setViewingProof] = useState<Donation | null>(null)
  const [confirmingDonation, setConfirmingDonation] = useState<string | null>(null)
  const [generateCertificate, setGenerateCertificate] = useState<string | null>(null)
  const [viewingCertificate, setViewingCertificate] = useState<Donation | null>(null)

  const filteredDonations = useMemo(() => {
    return donations.filter((donation) => {
      const matchesSearch =
        donation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donation.unique_id.includes(searchTerm) ||
        donation.cellphone.includes(searchTerm)

      const matchesStatus = statusFilter === "All" || donation.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [donations, searchTerm, statusFilter])

  const totalPages = Math.ceil(filteredDonations.length / ITEMS_PER_PAGE)
  const paginatedDonations = filteredDonations.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  // const hasPostedRef = useRef(false) // 👈 Track axios call

  const handleCertificate = async (donation: Donation) => {
    try {
      setGenerateCertificate(donation.id)
      const response = await fetch("/api/admin/donations/certify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: donation.id
        }),
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.error || "Failed to generate certificate!")

      setDonations((prev) =>
        prev.map((d) =>
          d.id === donation.id
          ? {
            ...d,
            // status: "Done",
            certificate_url: data.certificateUrl,
          }
          : d,
        ),
      )

    } catch (error) {
      alert("Error generating wakaf: " + (error instanceof Error ? error.message : "Unknown error"))
    } finally {
      setGenerateCertificate(null)
    }
  }

  const handleApprove = async (donation: Donation) => {
    try {
      setConfirmingDonation(donation.id)
      const response = await fetch("/api/admin/donations/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: donation.id
        }),
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.error || "Failed to confirm donation")

      setDonations((prev) =>
        prev.map((d) =>
          d.id === donation.id
            ? {
                ...d,
                status: "Done",
                // certificate_url: data.certificateUrl,
              }
            : d,
        ),
      )

      // call sendWhatsMsg function
      const certifyTemplate =
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


      const certifyMessage = {
        phone: donation.cellphone,
        caption: certifyTemplate,
        image_url: donation.certificate_url,
      };

      await fetch('/wa/send/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(certifyMessage),
      })

      console.log("Certificate sent successfully")

    } catch (error) {
      alert("Error confirming donation: " + (error instanceof Error ? error.message : "Unknown error"))
    } finally {
      setConfirmingDonation(null)
    }
  }

  const handleDelete = async (donation: Donation) => {
    try {
      const response = await fetch(`/api/admin/donations/${donation.id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete donation")

      setDonations((prev) => prev.filter((d) => d.id !== donation.id))
      setDeletingDonation(null)
    } catch (error) {
      alert("Error deleting donation: " + (error instanceof Error ? error.message : "Unknown error"))
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Done":
        return "text-blue-600";
      case "Confirmed":
        return "text-green-600";
      case "New":
        return "text-yellow-600";
      default:
        return "";
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-lg bg-white p-6 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-green-700">Search</label>
          <Input
            type="text"
            placeholder="Search by name, ID, or phone..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            className="mt-1 border-1 border-green-600"
          />
        </div>

        <div className="w-full sm:w-48">
          <label className="block text-sm font-medium text-green-700">Status</label>
          <Select
            value={statusFilter}
            onValueChange={(value: any) => {
              setStatusFilter(value)
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="mt-1 border-1 border-green-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Status</SelectItem>
              <SelectItem value="New">New</SelectItem>
              <SelectItem value="Confirmed">Confirmed</SelectItem>
              <SelectItem value="Done">Done</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg bg-white">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-200 bg-gray-50">
              <TableHead className="px-6 py-3 text-left text-sm font-semibold text-green-900">No.</TableHead>
              <TableHead className="px-6 py-3 text-left text-sm font-semibold text-green-900">Kode Reg</TableHead>
              <TableHead className="px-6 py-3 text-left text-sm font-semibold text-green-900">Nama</TableHead>
              <TableHead className="px-6 py-3 text-left text-sm font-semibold text-green-900">Alamat</TableHead>
              <TableHead className="px-6 py-3 text-left text-sm font-semibold text-green-900">No. HP</TableHead>
              <TableHead className="px-6 py-3 text-left text-sm font-semibold text-green-900">Jumlah</TableHead>
              <TableHead className="px-6 py-3 text-left text-sm font-semibold text-green-900">Total</TableHead>
              <TableHead className="px-6 py-3 text-left text-sm font-semibold text-green-900">Status</TableHead>
              <TableHead className="px-6 py-3 text-left text-sm font-semibold text-green-900">Bukti Transfer</TableHead>
              <TableHead className="px-6 py-3 text-left text-sm font-semibold text-green-900">Voucher</TableHead>
              <TableHead className="px-6 py-3 text-center text-sm font-semibold text-green-900">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedDonations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="px-6 py-8 text-center text-gray-500">
                  No donations found
                </TableCell>
              </TableRow>
            ) : (
              paginatedDonations.map((donation, index) => (
                <TableRow key={donation.id} className={`border-b border-gray-200 hover:bg-gray-50 ${getStatusColor(donation.status)}`}>
                  <TableCell className="px-6 py-4 text-sm font-mono">{((currentPage-1)*ITEMS_PER_PAGE)+(index+1)}</TableCell>
                  <TableCell className="px-6 py-4 text-sm font-mono">{donation.unique_id}</TableCell>
                  <TableCell className="px-6 py-4 text-sm">{donation.name}</TableCell>
                  <TableCell className="px-6 py-4 text-sm">{donation.address}</TableCell>
                  <TableCell className="px-6 py-4 text-sm">{donation.cellphone}</TableCell>
                  <TableCell className="px-6 py-4 text-sm text-right font-semibold ">{donation.quantity}</TableCell>
                  <TableCell className="px-6 py-4 text-sm text-right font-semibold">
                    {donation.grand_total.toLocaleString("id-ID", { minimumFractionDigits: 0 })}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm">
                    <Badge
                      variant={donation.status === "Confirmed" ? "default" : "secondary"}
                      className={
                        donation.status === "New"
                          ? "bg-yellow-100 text-yellow-800"
                          : donation.status === "Confirmed"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                      }
                    >
                      {donation.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-center">
                    {donation.proof_of_transfer ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewingProof(donation)}
                        className="gap-1 text-blue-600 hover:text-blue-700"
                        style={{ cursor: 'pointer' }}
                        title="View Bukti Transfer"
                      >
                        <SearchCheck className="h-4 w-4" />
                      </Button>
                    ) : (
                      <span className="text-gray-400">No proof</span>
                    )}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm">
                    {donation.certificate_url ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewingCertificate(donation)}
                        className="gap-1 text-blue-600 hover:text-blue-700"
                        style={{ cursor: 'pointer' }}
                        title="View Voucher"
                      >
                        <SearchCheck className="h-4 w-4" />
                      </Button>
                    ) : (
                      <span className="text-gray-400">Pending</span>
                    )}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setEditingDonation(donation)} className="gap-1" style={{ cursor: 'pointer' }} title="Edit">
                        <PencilRuler className="h-4 w-4" />
                      </Button>

                      {donation.status === "Confirmed" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCertificate(donation)}
                          disabled={generateCertificate === donation.id}
                          className="gap-1 text-yellow-600 hover:text-yellow-700"
                          style={{ cursor: 'pointer' }}
                          title="Generate Voucher"
                        >
                          <IdCard className="h-4 w-4" />
                          {generateCertificate === donation.id ? "Generating..." : ""}
                        </Button>
                      )}

                      {donation.status === "Confirmed" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleApprove(donation)}
                          disabled={confirmingDonation === donation.id}
                          className="gap-1 text-blue-600 hover:text-blue-700"
                          style={{ cursor: 'pointer' }}
                          title="Approve & Send Voucher"
                        >
                          <CheckCircle className="h-4 w-4" />
                          {confirmingDonation === donation.id ? "Confirming..." : ""}
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeletingDonation(donation)}
                        className="gap-1 text-red-600 hover:text-red-700"
                        style={{ cursor: 'pointer' }}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between rounded-lg bg-white p-6">
          <div className="text-sm text-green-600">
            Page {currentPage} of {totalPages} ({filteredDonations.length} total)
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {editingDonation && (
        <EditDonationDialog
          donation={editingDonation}
          onClose={() => setEditingDonation(null)}
          onSave={(updated) => {
            setDonations((prev) => prev.map((d) => (d.id === updated.id ? updated : d)))
            setEditingDonation(null)
          }}
        />
      )}

      {deletingDonation && (
        <ConfirmDeleteDialog
          donation={deletingDonation}
          onConfirm={() => handleDelete(deletingDonation)}
          onCancel={() => setDeletingDonation(null)}
        />
      )}

      {viewingProof && <ProofViewerDialog donation={viewingProof} onClose={() => setViewingProof(null)} />}
      {viewingCertificate && <CertificateViewerDialog donation={viewingCertificate} onClose={() => setViewingCertificate(null)} />}
    </div>
  )
}
