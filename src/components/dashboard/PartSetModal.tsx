"use client"

import { useState } from "react"
import { X, Loader2 } from "lucide-react"
import { createPartSet, updatePartSet } from "@/lib/actions/master"

export default function PartSetModal({ partSet, suppliers, userRole, onClose }: any) {
  const [loading, setLoading] = useState(false)
  const isEditing = !!partSet

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    try {
      if (isEditing) {
        await updatePartSet(partSet.id, formData)
      } else {
        await createPartSet(formData)
      }
      onClose()
    } catch (err) {
      alert("Error saving Part Set")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-300">
        <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mt-3 mb-1 sm:hidden" />
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">{isEditing ? "Edit Part Set" : "Add Part Set"}</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg"><X className="w-4 h-4 text-slate-400" /></button>
        </div>
        <form action={handleSubmit} className="p-5 space-y-3 max-h-[80vh] overflow-y-auto">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Set Name</label>
            <input name="nameSet" defaultValue={partSet?.nameSet} required className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-900 font-medium text-sm" placeholder="Example: ENGINE SET" />
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
            <p className="text-xs text-slate-400 italic">This data will be linked to your company.</p>
          )}
          <div className="pt-3 flex gap-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl font-bold text-slate-600 text-sm">Cancel</button>
            <button type="submit" disabled={loading} className="flex-[2] px-4 py-2.5 bg-indigo-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-sm">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (isEditing ? "Update" : "Create")}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
