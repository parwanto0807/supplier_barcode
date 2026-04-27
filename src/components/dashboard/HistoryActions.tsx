"use client"

import { Printer, RefreshCcw, Trash2, AlertTriangle, Loader2 } from "lucide-react"
import Link from "next/link"
import { printLabels } from "@/lib/utils/print-label"
import { deleteItem } from "@/lib/actions/items"
import { useState } from "react"

export default function HistoryActions({ item }: { item: any }) {
  const [isPrinting, setIsPrinting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

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

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteItem(item.id)
      setShowConfirm(false)
    } catch (error) {
      console.error("Delete failed", error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <div className="flex items-center justify-end gap-1.5">
        <button
          onClick={handleDirectPrint}
          disabled={isPrinting}
          className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-all disabled:opacity-50"
        >
          <Printer className={`w-3.5 h-3.5 ${isPrinting ? 'animate-pulse' : ''}`} />
          Cetak
        </button>

        <Link
          href={`/dashboard/generate?productId=${item.productId}&qty=${item.qty}&totalQty=${item.totalQty}&noLotSpk=${encodeURIComponent(item.noLotSpk)}&inspector=${encodeURIComponent(item.inspector)}&customer=${item.customer}`}
          className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-all"
        >
          <RefreshCcw className="w-3.5 h-3.5" />
          Ulang
        </Link>

        <button
          onClick={() => setShowConfirm(true)}
          className="inline-flex items-center gap-1.5 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-all border border-red-100 dark:border-red-500/20"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Hapus
        </button>
      </div>

      {/* Confirm Delete Modal — bottom sheet on mobile, centered on desktop */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full sm:max-w-sm rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-300">
            {/* Drag handle (mobile only) */}
            <div className="w-10 h-1 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mt-3 sm:hidden" />

            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white mb-1">Hapus Riwayat?</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                Barcode <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{item.barcode}</span>
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-5">
                Data ini akan dihapus permanen dan tidak bisa dikembalikan.
              </p>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setShowConfirm(false)}
                  disabled={isDeleting}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-sm disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-4 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  {isDeleting ? "Menghapus..." : "Ya, Hapus"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
