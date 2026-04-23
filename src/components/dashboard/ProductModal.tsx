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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900">{isEditing ? "Edit Master Product" : "Add Master Product"}</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-lg"><X className="w-5 h-5 text-slate-400" /></button>
        </div>
        <form action={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Part Number</label>
            <input name="partNumber" defaultValue={product?.partNumber} required className="w-full px-4 py-2 border border-slate-200 rounded-xl text-slate-900 font-medium" placeholder="PN-001-XYZ" />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Part Name</label>
            <input name="partName" defaultValue={product?.partName} required className="w-full px-4 py-2 border border-slate-200 rounded-xl text-slate-900 font-medium" placeholder="Gear Box Type A" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Unit (Satuan)</label>
              <input name="unit" defaultValue={product?.unit} required className="w-full px-4 py-2 border border-slate-200 rounded-xl text-slate-900 font-medium" placeholder="Pcs" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Part Set</label>
              <select name="partSetId" defaultValue={product?.partSetId} className="w-full px-4 py-2 border border-slate-200 rounded-xl bg-white text-slate-900 font-medium">
                <option value="">None</option>
                {partSets.map((ps: any) => <option key={ps.id} value={ps.id}>{ps.nameSet}</option>)}
              </select>
            </div>
          </div>

          {!isEditing && userRole === "SUPER_ADMIN" && (
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Supplier</label>
              <select name="supplierId" required className="w-full px-4 py-2 border border-slate-200 rounded-xl bg-white text-slate-900 font-medium">
                <option value="">Select Supplier...</option>
                {suppliers.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          )}

          {userRole !== "SUPER_ADMIN" && (
            <p className="text-xs text-slate-400 italic">This master product will be linked to your company catalog.</p>
          )}

          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl font-bold text-slate-600">Cancel</button>
            <button type="submit" disabled={loading} className="flex-[2] px-4 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 flex items-center justify-center gap-2">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isEditing ? "Update Product" : "Create Product")}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
