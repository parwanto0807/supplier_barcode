"use client"

import { useState } from "react"
import { Package, PlusCircle, Tag, Layers, Edit, Trash2, Database, Loader2, AlertCircle } from "lucide-react"
import { deleteProduct } from "@/lib/actions/master"
import ProductModal from "./ProductModal"
import SyncModal from "./SyncModal"

export default function ProductListClient({ initialProducts, partSets, suppliers, userRole, supplierId }: any) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)

  const handleSync = () => {
    if (!supplierId && userRole !== "SUPER_ADMIN") {
      alert("Supplier ID not found. Cannot sync.")
      return
    }
    setIsSyncModalOpen(true)
  }

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<any>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const handleEdit = (prod: any) => {
    setEditingProduct(prod)
    setIsModalOpen(true)
  }

  const openDeleteModal = (prod: any) => {
    setProductToDelete(prod)
    setDeleteError(null)
    setIsDeleteModalOpen(true)
  }

  const handleDelete = async () => {
    if (!productToDelete) return
    setIsDeleting(true)
    setDeleteError(null)
    try {
      await deleteProduct(productToDelete.id)
      setIsDeleteModalOpen(false)
      setProductToDelete(null)
    } catch (err: any) {
      console.error(err)
      setDeleteError("Gagal menghapus: Barang ini sudah memiliki riwayat cetak (History) dan tidak bisa dihapus.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-4 font-inter">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight uppercase">Master Products</h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mt-0.5 hidden sm:block">Manage your catalog of parts and items.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSync}
            className="group flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-emerald-500/30 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold rounded-xl hover:bg-emerald-600 hover:text-white transition-all text-xs uppercase tracking-widest"
          >
            <Database className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add Product</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* ─── DESKTOP TABLE ─── */}
      <div className="hidden md:block bg-white dark:bg-slate-900 rounded-2xl shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
                <th className="px-4 py-3 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Product Details</th>
                <th className="px-4 py-3 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Part Set</th>
                <th className="px-4 py-3 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Unit</th>
                {userRole === "SUPER_ADMIN" && <th className="px-4 py-3 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Owner</th>}
                <th className="px-4 py-3 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {initialProducts.map((prod: any) => (
                <tr key={prod.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg flex items-center justify-center">
                        <Package className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white text-xs tracking-tight leading-none mb-0.5">{prod.partName}</p>
                        <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 font-mono tracking-widest uppercase">{prod.partNumber}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {prod.partSet ? (
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded text-[9px] font-black uppercase tracking-widest border border-emerald-100 dark:border-emerald-500/20">
                        <Layers className="w-3 h-3" />{prod.partSet.nameSet}
                      </div>
                    ) : (
                      <span className="text-slate-300 dark:text-slate-600 italic text-[9px] font-bold uppercase tracking-widest">No Set</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="inline-flex items-center px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-600 dark:text-slate-400 font-bold text-[9px] uppercase tracking-widest">
                      {prod.unit}
                    </div>
                  </td>
                  {userRole === "SUPER_ADMIN" && (
                    <td className="px-4 py-3">
                      <span className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded uppercase tracking-widest border border-indigo-100 dark:border-indigo-500/20">
                        {prod.supplier.code}
                      </span>
                    </td>
                  )}
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button onClick={() => handleEdit(prod)} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[9px] font-black uppercase tracking-widest rounded border border-indigo-100 dark:border-indigo-500/20 hover:bg-indigo-100 transition-all">
                        <Edit className="w-3 h-3" />Edit
                      </button>
                      <button onClick={() => openDeleteModal(prod)} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-[9px] font-black uppercase tracking-widest rounded border border-red-100 dark:border-red-500/20 hover:bg-red-100 transition-all">
                        <Trash2 className="w-3 h-3" />Del
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── MOBILE CARD LIST ─── */}
      <div className="md:hidden space-y-2">
        {initialProducts.length === 0 && (
          <div className="text-center py-12 text-slate-400 italic text-sm">Belum ada produk.</div>
        )}
        {initialProducts.map((prod: any) => (
          <div key={prod.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="w-9 h-9 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center flex-shrink-0">
                <Package className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-900 dark:text-white text-sm leading-tight truncate">{prod.partName}</p>
                <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider mt-0.5">{prod.partNumber}</p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button onClick={() => handleEdit(prod)} className="p-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg">
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => openDeleteModal(prod)} className="p-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 pb-3 flex-wrap">
              {prod.partSet ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded text-[9px] font-black uppercase">
                  <Layers className="w-2.5 h-2.5" />{prod.partSet.nameSet}
                </span>
              ) : (
                <span className="text-[9px] text-slate-400 italic">No Set</span>
              )}
              <span className="inline-flex items-center px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-600 dark:text-slate-400 font-bold text-[9px] uppercase">{prod.unit}</span>
              {userRole === "SUPER_ADMIN" && (
                <span className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded uppercase">{prod.supplier.code}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <ProductModal
          product={editingProduct}
          partSets={partSets}
          suppliers={suppliers}
          userRole={userRole}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {isSyncModalOpen && (
        <SyncModal
          supplierId={supplierId || (suppliers[0]?.id)}
          onClose={() => setIsSyncModalOpen(false)}
        />
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">Hapus Produk?</h3>
              <p className="text-slate-500 text-sm mb-5 leading-relaxed">
                Anda akan menghapus <span className="font-bold text-slate-900">{productToDelete?.partName}</span>.
                Tindakan ini tidak dapat dibatalkan.
              </p>

              {deleteError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2.5 text-red-600 text-xs text-left animate-in fade-in slide-in-from-top-2 duration-300">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <p className="font-medium leading-tight">{deleteError}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all text-sm"
                >
                  Batal
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  Ya, Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
