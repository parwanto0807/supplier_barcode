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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight uppercase">Daftar Part Set</h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mt-0.5 hidden sm:block">Kelola grup barang Anda secara teratur.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari..."
              className="pl-8 pr-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-xs font-medium dark:text-white w-full sm:w-40"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={handleAdd} 
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-all text-xs uppercase tracking-widest whitespace-nowrap"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tambah Set</span>
            <span className="sm:hidden">Tambah</span>
          </button>
        </div>
      </div>

      {/* ─── DESKTOP TABLE ─── */}
      <div className="hidden md:block bg-white dark:bg-slate-900 rounded-2xl shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
                <th className="px-4 py-3 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Part Set Name</th>
                <th className="px-4 py-3 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Supplier</th>
                <th className="px-4 py-3 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Produk Terkait</th>
                <th className="px-4 py-3 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Tgl Dibuat</th>
                <th className="px-4 py-3 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {filteredSets.length > 0 ? filteredSets.map((set: any) => (
                <tr key={set.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg flex items-center justify-center">
                        <LayoutGrid className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white text-xs tracking-tight">{set.nameSet}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium text-xs">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {set.supplier.name}
                      <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 text-[9px] px-1.5 py-0.5 rounded uppercase font-bold">{set.supplier.code}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-amber-50 dark:bg-amber-500/10 rounded text-amber-700 dark:text-amber-400 font-bold text-[9px] uppercase">
                      <Package className="w-3 h-3" />{set._count.products} Items
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(set.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button onClick={() => handleEdit(set)} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[9px] font-black uppercase tracking-widest rounded border border-indigo-100 dark:border-indigo-500/20 hover:bg-indigo-100 transition-all">
                        <Edit className="w-3 h-3" />Edit
                      </button>
                      <button onClick={async () => { if(confirm("Hapus set ini?")) await deletePartSet(set.id) }} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-[9px] font-black uppercase tracking-widest rounded border border-red-100 dark:border-red-500/20 hover:bg-red-100 transition-all">
                        <Trash2 className="w-3 h-3" />Del
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center text-slate-400 italic text-sm">Belum ada data Part Set</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── MOBILE CARD LIST ─── */}
      <div className="md:hidden space-y-2">
        {filteredSets.length === 0 && (
          <div className="text-center py-12 text-slate-400 italic text-sm">Belum ada data Part Set</div>
        )}
        {filteredSets.map((set: any) => (
          <div key={set.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="w-9 h-9 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center flex-shrink-0">
                <LayoutGrid className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-900 dark:text-white text-sm leading-tight">{set.nameSet}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Building2 className="w-3 h-3 text-slate-400" />
                  <span className="text-[10px] text-slate-500 font-medium">{set.supplier.name}</span>
                  <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 text-[8px] px-1.5 py-0.5 rounded uppercase font-bold">{set.supplier.code}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button onClick={() => handleEdit(set)} className="p-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg">
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button onClick={async () => { if(confirm("Hapus set ini?")) await deletePartSet(set.id) }} className="p-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 pb-3">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 dark:bg-amber-500/10 rounded text-amber-700 dark:text-amber-400 font-bold text-[9px] uppercase">
                <Package className="w-2.5 h-2.5" />{set._count.products} Items
              </span>
              <span className="text-[9px] text-slate-400 font-medium">
                {new Date(set.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>
        ))}
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
