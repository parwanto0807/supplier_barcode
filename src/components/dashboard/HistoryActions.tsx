"use client"

import { Printer, RefreshCcw } from "lucide-react"
import Link from "next/link"
import { printLabels } from "@/lib/utils/print-label"
import { useState } from "react"

export default function HistoryActions({ item }: { item: any }) {
  const [isPrinting, setIsPrinting] = useState(false)

  const handleDirectPrint = async () => {
    setIsPrinting(true)
    try {
      await printLabels([item])
    } catch (error) {
      console.error("Print failed", error)
    } finally {
      setIsPrinting(false)
    }
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <button
        onClick={handleDirectPrint}
        disabled={isPrinting}
        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all shadow-sm disabled:opacity-50"
      >
        <Printer className={`w-3.5 h-3.5 ${isPrinting ? 'animate-pulse' : ''}`} />
        Cetak
      </button>
      
      <Link
        href={`/dashboard/generate?productId=${item.productId}&qty=${item.qty}&totalQty=${item.totalQty}&noLotSpk=${encodeURIComponent(item.noLotSpk)}&inspector=${encodeURIComponent(item.inspector)}&customer=${item.customer}`}
        className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all shadow-sm"
      >
        <RefreshCcw className="w-3.5 h-3.5" />
        Generate Ulang
      </Link>
    </div>
  )
}
