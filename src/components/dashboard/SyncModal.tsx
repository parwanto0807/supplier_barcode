"use client"

import { useState, useEffect } from "react"
import { Search, Database, X, Plus, Loader2, Package, CheckCircle2 } from "lucide-react"
import { searchExternalProducts, importSingleProduct } from "@/lib/actions/master"

export default function SyncModal({ onClose, supplierId }: { onClose: () => void, supplierId: string }) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [addingId, setAddingId] = useState<string | null>(null)

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault()
    setLoading(true)
    try {
      const data = await searchExternalProducts(query)
      setResults(data)
    } catch (err) {
      alert("Error searching database")
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async (item: any) => {
    setAddingId(item.partNumber)
    try {
      const res = await importSingleProduct(item, supplierId)
      // Optional: mark as added in UI
      setResults(prev => prev.map(r => r.partNumber === item.partNumber ? { ...r, added: true } : r))
    } catch (err) {
      alert("Failed to add product")
    } finally {
      setAddingId(null)
    }
  }

  useEffect(() => {
    handleSearch()
  }, [])

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-2xl rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-300">
        <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mt-3 mb-1 sm:hidden" />
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg text-white">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Sync from MySQL</h2>
              <p className="text-[10px] text-slate-500 font-medium">Kategori: <span className="text-indigo-600 font-bold uppercase">Penjualan</span></p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-all text-slate-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari Nama atau Nomor Part..."
              className="w-full pl-10 pr-16 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium text-slate-900 text-sm"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-all">
              Cari
            </button>
          </form>

          <div className="overflow-y-auto space-y-2" style={{ maxHeight: "50vh" }}>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-10 text-slate-400 gap-3">
                <Loader2 className="w-6 h-6 animate-spin" />
                <p className="text-xs font-medium">Menghubungkan ke MySQL...</p>
              </div>
            ) : results.length > 0 ? (
              results.map((item: any, index: number) => (
                <div key={`${item.partNumber}-${index}`} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl hover:border-indigo-200 transition-all group">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-1.5 bg-slate-50 rounded-lg text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors flex-shrink-0">
                      <Package className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 text-xs truncate">{item.partName}</p>
                      <p className="text-[9px] text-slate-500 font-mono">{item.partNumber} • {item.unit}</p>
                    </div>
                  </div>
                  {item.added ? (
                    <div className="flex items-center gap-1 text-emerald-600 font-bold text-[10px] bg-emerald-50 px-2.5 py-1 rounded-lg flex-shrink-0">
                      <CheckCircle2 className="w-3 h-3" />Added
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAdd(item)}
                      disabled={addingId === item.partNumber}
                      className="px-3 py-1.5 bg-slate-900 text-white text-[10px] font-bold rounded-lg hover:bg-slate-800 disabled:opacity-50 transition-all flex items-center gap-1.5 flex-shrink-0"
                    >
                      {addingId === item.partNumber ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                      Tambah
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-slate-400 italic text-sm">Tidak ada data ditemukan</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
