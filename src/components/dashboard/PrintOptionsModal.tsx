"use client"

import { useState } from "react"
import { Printer, ShieldCheck, KeyRound, X } from "lucide-react"

interface PrintOptionsModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (includeUniqueCode: boolean) => void
  isPrinting?: boolean
  itemCount?: number
}

export default function PrintOptionsModal({
  isOpen,
  onClose,
  onConfirm,
  isPrinting = false,
  itemCount = 1
}: PrintOptionsModalProps) {
  const [includeUniqueCode, setIncludeUniqueCode] = useState<boolean>(false)

  if (!isOpen) return null

  const handleConfirm = () => {
    onConfirm(includeUniqueCode)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 font-inter">
      <div 
        className="bg-white dark:bg-slate-900 w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 animate-in slide-in-from-bottom sm:zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag Indicator */}
        <div className="w-10 h-1 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mt-3 sm:hidden" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Opsi Cetak Label</h3>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Format Data Barcode QR Code</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
            Pilih opsi format data yang akan dimasukkan ke dalam QR Code sebelum mencetak {itemCount > 1 ? `${itemCount} label` : "label"}:
          </p>

          <div className="space-y-2.5">
            {/* Option 1: Without Unique Code (Default) */}
            <label
              onClick={() => setIncludeUniqueCode(false)}
              className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                !includeUniqueCode
                  ? "bg-indigo-50/50 dark:bg-indigo-500/10 border-indigo-600 dark:border-indigo-500 shadow-sm"
                  : "bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              <input
                type="radio"
                name="uniqueCodeOption"
                checked={!includeUniqueCode}
                onChange={() => setIncludeUniqueCode(false)}
                className="mt-1 text-indigo-600 focus:ring-indigo-500 dark:bg-slate-900"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-slate-900 dark:text-white">Tidak Sertakan Kode Unik</span>
                  <span className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Default
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                  Format: Part Number | Qty | No. Lot
                </p>
                <div className="flex items-center gap-1 mt-1 text-[9px] text-slate-400">
                  <ShieldCheck className="w-3 h-3 text-emerald-500" />
                  <span>Lebih sederhana & kompatibel dengan scanner standar</span>
                </div>
              </div>
            </label>

            {/* Option 2: With Unique Code */}
            <label
              onClick={() => setIncludeUniqueCode(true)}
              className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                includeUniqueCode
                  ? "bg-indigo-50/50 dark:bg-indigo-500/10 border-indigo-600 dark:border-indigo-500 shadow-sm"
                  : "bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              <input
                type="radio"
                name="uniqueCodeOption"
                checked={includeUniqueCode}
                onChange={() => setIncludeUniqueCode(true)}
                className="mt-1 text-indigo-600 focus:ring-indigo-500 dark:bg-slate-900"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-slate-900 dark:text-white">Sertakan Kode Unik</span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                  Format: Part Number | Qty | No. Lot | [Kode Unik 8 Karakter]
                </p>
                <div className="flex items-center gap-1 mt-1 text-[9px] text-slate-400">
                  <KeyRound className="w-3 h-3 text-indigo-500" />
                  <span>Menambahkan string acak unik untuk anti-duplikasi</span>
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2 px-5 py-3.5 bg-slate-50/50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            disabled={isPrinting}
            className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-xl transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isPrinting}
            className="px-5 py-2 text-xs font-black text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center gap-2 uppercase tracking-wider disabled:opacity-50"
          >
            <Printer className="w-3.5 h-3.5" />
            {isPrinting ? "Menyiapkan..." : "Cetak Label"}
          </button>
        </div>
      </div>
    </div>
  )
}
