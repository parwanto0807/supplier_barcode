"use client"

import { useState } from "react"
import { X, Loader2 } from "lucide-react"
import { createSupplier, updateSupplier } from "@/lib/actions/suppliers"

interface SupplierModalProps {
  supplier?: any
  onClose: () => void
}

export default function SupplierModal({ supplier, onClose }: SupplierModalProps) {
  const [loading, setLoading] = useState(false)
  const isEditing = !!supplier

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    try {
      if (isEditing) {
        await updateSupplier(supplier.id, formData)
      } else {
        await createSupplier(formData)
      }
      onClose()
    } catch (error) {
      alert("Error saving supplier. Make sure the code is unique.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-300">
        <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mt-3 mb-1 sm:hidden" />
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="font-bold text-slate-900 text-sm">{isEditing ? "Edit Supplier" : "Add New Supplier"}</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>
        <form action={handleSubmit} className="p-5 space-y-3 max-h-[80vh] overflow-y-auto">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Company Name</label>
            <input name="name" defaultValue={supplier?.name} required className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400 text-sm" placeholder="PT. Example Jaya" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Supplier Code</label>
            <input name="code" defaultValue={supplier?.code} required className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400 text-sm" placeholder="SUP-001" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Phone Number</label>
            <input name="phone" defaultValue={supplier?.phone} className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400 text-sm" placeholder="08123456789" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Address</label>
            <textarea name="address" defaultValue={supplier?.address} rows={3} className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400 resize-none text-sm" placeholder="Jl. Raya No. 123" />
          </div>
          <div className="pt-3 flex gap-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all text-sm">Cancel</button>
            <button type="submit" disabled={loading} className="flex-[2] px-4 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2 text-sm">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (isEditing ? "Update Supplier" : "Create Supplier")}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
