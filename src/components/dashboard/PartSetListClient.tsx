"use client"

import { useState } from "react"
import { LayoutGrid, PlusCircle, Building2, Edit, Trash2, Search, Calendar, Package } from "lucide-react"
import { deletePartSet } from "@/lib/actions/master"
import PartSetModal from "./PartSetModal"

export default function PartSetListClient({ initialPartSets, suppliers, userRole }: any) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSet, setEditingSet] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const handleEdit = (set: any) => {
    setEditingSet(set)
    setIsModalOpen(true)
  }

  const handleAdd = () => {
    setEditingSet(null)
    setIsModalOpen(true)
  }

  const filteredSets = initialPartSets.filter((set: any) => 
    set.nameSet.toLowerCase().includes(searchTerm.toLowerCase()) ||
    set.supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header & Action Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Daftar Part Set</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Kelola grup barang Anda secara teratur.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari Part Set..."
              className="pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={handleAdd} 
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-black rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all text-[10px] uppercase tracking-widest"
          >
            <PlusCircle className="w-5 h-5" />
            Tambah Set
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Part Set Name</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Supplier</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Produk Terkait</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Tgl Dibuat</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {filteredSets.length > 0 ? filteredSets.map((set: any) => (
                <tr key={set.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center">
                        <LayoutGrid className="w-5 h-5" />
                      </div>
                      <span className="font-black text-slate-900 dark:text-white text-base tracking-tight">{set.nameSet}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-semibold">
                      <Building2 className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                      {set.supplier.name}
                      <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] px-2 py-0.5 rounded-full uppercase font-black ml-1">
                        {set.supplier.code}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 dark:bg-amber-500/10 rounded-lg text-amber-700 dark:text-amber-400 font-bold text-xs uppercase tracking-tighter">
                      <Package className="w-3.5 h-3.5" />
                      {set._count.products} Items
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-sm font-medium">
                      <Calendar className="w-4 h-4" />
                      {new Date(set.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleEdit(set)} 
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-indigo-100 dark:border-indigo-500/20 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-all"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      <button 
                        onClick={async () => { if(confirm("Hapus set ini? Semua produk di dalamnya akan menjadi 'No Set'.")) await deletePartSet(set.id) }} 
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-red-100 dark:border-red-500/20 hover:bg-red-100 dark:hover:bg-red-500/20 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-slate-400 dark:text-slate-500 italic">
                    Belum ada data Part Set ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <PartSetModal 
          partSet={editingSet} 
          suppliers={suppliers} 
          userRole={userRole} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  )
}
