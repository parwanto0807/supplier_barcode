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
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg text-white">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Sync from MySQL</h2>
              <p className="text-xs text-slate-500 font-medium">Kategori: <span className="text-indigo-600 font-bold uppercase">Penjualan</span></p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-all text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari Nama atau Nomor Part di MySQL..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium text-slate-900"
            />
            <button 
              type="submit" 
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-all"
            >
              Cari
            </button>
          </form>

          <div className="max-height-[400px] overflow-y-auto pr-2 space-y-3 custom-scrollbar" style={{ maxHeight: "350px" }}>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-3">
                <Loader2 className="w-8 h-8 animate-spin" />
                <p className="text-sm font-medium">Menghubungkan ke MySQL...</p>
              </div>
            ) : results.length > 0 ? (
              results.map((item: any, index: number) => (
                <div key={`${item.partNumber}-${index}`} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-indigo-200 hover:shadow-sm transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-slate-50 rounded-xl text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{item.partName}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-xs text-slate-500 font-mono">{item.partNumber} • {item.unit}</p>
                        {item.setName && (
                          <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-500 text-[10px] font-bold rounded uppercase">
                            Set: {item.setName}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {item.added ? (
                    <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs bg-emerald-50 px-3 py-1.5 rounded-xl">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Added
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAdd(item)}
                      disabled={addingId === item.partNumber}
                      className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 disabled:opacity-50 transition-all flex items-center gap-2"
                    >
                      {addingId === item.partNumber ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                      Tambahkan
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-slate-400 italic text-sm">
                Tidak ada data ditemukan
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
