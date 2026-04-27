"use client"

import { useState } from "react"
import { X, Loader2 } from "lucide-react"
import { createProduct, updateProduct } from "@/lib/actions/master"

export default function ProductModal({ product, partSets, suppliers, userRole, onClose }: any) {
  const [loading, setLoading] = useState(false)
  const isEditing = !!product

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    try {
      if (isEditing) {
        await updateProduct(product.id, formData)
      } else {
        await createProduct(formData)
      }
      onClose()
    } catch (err) {
      alert("Error saving Product. Check if Part Number is unique for this supplier.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-300">
        <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mt-3 mb-1 sm:hidden" />
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">{isEditing ? "Edit Master Product" : "Add Master Product"}</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-200 rounded-lg"><X className="w-4 h-4 text-slate-400" /></button>
        </div>
        <form action={handleSubmit} className="p-5 space-y-3 max-h-[80vh] overflow-y-auto">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Part Number</label>
            <input name="partNumber" defaultValue={product?.partNumber} required className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-900 font-medium text-sm" placeholder="PN-001-XYZ" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Part Name</label>
            <input name="partName" defaultValue={product?.partName} required className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-900 font-medium text-sm" placeholder="Gear Box Type A" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Unit</label>
              <input name="unit" defaultValue={product?.unit} required className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-900 font-medium text-sm" placeholder="Pcs" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Part Set</label>
              <select name="partSetId" defaultValue={product?.partSetId} className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-900 font-medium text-sm">
                <option value="">None</option>
                {partSets.map((ps: any) => <option key={ps.id} value={ps.id}>{ps.nameSet}</option>)}
              </select>
            </div>
          </div>
          {!isEditing && userRole === "SUPER_ADMIN" && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Supplier</label>
              <select name="supplierId" required className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-900 font-medium text-sm">
                <option value="">Select Supplier...</option>
                {suppliers.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          )}
          {userRole !== "SUPER_ADMIN" && (
            <p className="text-xs text-slate-400 italic">This master product will be linked to your company catalog.</p>
          )}
          <div className="pt-3 flex gap-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl font-bold text-slate-600 text-sm">Cancel</button>
            <button type="submit" disabled={loading} className="flex-[2] px-4 py-2.5 bg-indigo-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-sm">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (isEditing ? "Update Product" : "Create Product")}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
