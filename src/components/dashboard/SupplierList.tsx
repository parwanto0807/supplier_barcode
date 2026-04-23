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
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Supplier Management</h2>
          <p className="text-slate-500 mt-1">Manage partner companies and their unique codes.</p>
        </div>
        <button 
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
        >
          <PlusCircle className="w-5 h-5" />
          Add New Supplier
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {initialSuppliers.map((supplier) => (
          <div key={supplier.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleEdit(supplier)} 
                  className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(supplier.id)} 
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-1">{supplier.name}</h3>
            <div className="inline-flex items-center px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-bold mb-4 uppercase">
              {supplier.code}
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 text-sm text-slate-500">
                <Phone className="w-4 h-4 text-slate-400" />
                {supplier.phone || "No phone"}
              </div>
              <div className="flex items-start gap-2.5 text-sm text-slate-500">
                <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
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
