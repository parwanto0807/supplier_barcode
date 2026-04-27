"use client"

import { useState } from "react"
import { Building2, MapPin, Phone, Edit, Trash2, PlusCircle } from "lucide-react"
import SupplierModal from "./SupplierModal"
import { deleteSupplier } from "@/lib/actions/suppliers"

export default function SupplierList({ initialSuppliers }: { initialSuppliers: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<any>(null)

  const handleEdit = (supplier: any) => {
    setEditingSupplier(supplier)
    setIsModalOpen(true)
  }

  const handleAdd = () => {
    setEditingSupplier(null)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this supplier? This may affect users and items linked to them.")) {
      await deleteSupplier(id)
    }
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">Supplier Management</h2>
          <p className="text-slate-500 text-xs mt-0.5 hidden sm:block">Manage partner companies and their unique codes.</p>
        </div>
        <button 
          onClick={handleAdd}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all text-xs"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Add Supplier</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {initialSuppliers.map((supplier: any) => (
          <div key={supplier.id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-all group">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="flex gap-1">
                <button onClick={() => handleEdit(supplier)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleDelete(supplier.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-0.5">{supplier.name}</h3>
            <div className="inline-flex items-center px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[9px] font-bold mb-3 uppercase">{supplier.code}</div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Phone className="w-3.5 h-3.5 text-slate-400" />{supplier.phone || "No phone"}
              </div>
              <div className="flex items-start gap-2 text-xs text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5" />
                <span className="line-clamp-2">{supplier.address || "No address"}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <SupplierModal 
          supplier={editingSupplier} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  )
}
