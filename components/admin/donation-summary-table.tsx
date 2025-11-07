"use client"
import React, { useMemo } from "react"
import { Badge } from "@/components/ui/badge"


interface Donation {
  id?: string
  status: string
  quantity: number
  grand_total: number
}

interface DonationSummaryTableProps {
  data: Donation[]
}

const DonationSummaryTable: React.FC<DonationSummaryTableProps> = ({ data }) => {
  // 🧩 Ensure base statuses always shown
  const allStatuses = useMemo(() => {
    const fromData = Array.from(new Set(data.map((d) => d.status)))
    const base = ["New", "Confirmed", "Done"]
    return Array.from(new Set([...base, ...fromData]))
  }, [data])

  // 🧮 Compute summary per status
  const summaryRows = useMemo(() => {
    const summary = allStatuses.map((status) => ({
      status,
      record: 0,
      qty: 0,
      total: 0,
      percentage: 0,
    }))

    data.forEach((d) => {
      const row = summary.find((s) => s.status === d.status)
      if (row) {
        row.record += 1
        row.qty += d.quantity || 0
        row.total += d.grand_total || 0
      }
    })

    const totalDonation = summary.reduce((sum, r) => sum + r.total, 0)
    summary.forEach((r) => {
      r.percentage = totalDonation ? (r.total / totalDonation) * 100 : 0
    })

    return summary
  }, [data, allStatuses])

  // 🧾 Totals
  const totalQty = summaryRows.reduce((sum, r) => sum + r.qty, 0)
  const totalDonation = summaryRows.reduce((sum, r) => sum + r.total, 0)
  const totalRecord = summaryRows.reduce((sum, r) => sum + r.record, 0)

  // 🎨 Color helper based on status
  const getColor = (status: string) => {
    switch (status) {
      case "New":
        return "bg-yellow-100 text-yellow-800"
      case "Confirmed":
        return "bg-green-100 text-green-800"
      case "Done":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-400"
    }
  }

  // 🧱 Render
  return (
    <div className="mt-5 overflow-x-auto">
      <table className="min-w-xl border border-gray-300 text-xs rounded-md overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-2 text-center">Status</th>
            <th className="border px-3 py-2 text-right">Record</th>
            <th className="border px-3 py-2 text-right">Voucher</th>
            <th className="border px-3 py-2 text-right">Total</th>
            <th className="border px-3 py-2 text-right">% of Total</th>
          </tr>
        </thead>
        <tbody>
          {summaryRows.map((row) => (
            // <tr key={row.status} className="even:bg-gray-50">
            <tr key={row.status} className={getColor(row.status)}>
              <td className="border px-3 py-2">
                <Badge className={getColor(row.status)}>{row.status}</Badge>
              </td>
              <td className="border px-3 py-2 text-right">{row.record}</td>
              <td className="border px-3 py-2 text-right">{row.qty}</td>
              <td className="border px-3 py-2 text-right">
                {row.total.toLocaleString("id-ID")}
              </td>
              <td className="border px-3 py-2">
                <div className="flex items-center justify-end gap-2">
                  {/* <div className="w-24 bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`${getColor(row.status)} h-2`}
                      style={{ width: `${row.percentage}%` }}
                    />
                  </div> */}
                  <span className="w-12 text-right text-green-700 font-bold">
                    {row.percentage.toFixed(1)}%
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-gray-50 font-bold">
          <tr>
            <td className="border px-3 py-2 text-center">Grand Total</td>
            <td className="border px-3 py-2 text-right">{totalRecord}</td>
            <td className="border px-3 py-2 text-right">{totalQty}</td>
            <td className="border px-3 py-2 text-right">
              {totalDonation.toLocaleString("id-ID")}
            </td>
            <td className="border px-3 py-2 text-right">100%</td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

export default DonationSummaryTable
