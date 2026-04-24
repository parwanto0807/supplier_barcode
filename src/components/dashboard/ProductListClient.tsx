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
    <div className="space-y-6 font-inter">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Master Products</h2>
          <p className="text-slate-500 dark:text-slate-400 font-semibold mt-1">Manage your catalog of parts and items.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSync}
            className="group flex items-center gap-3 px-6 py-3 bg-white dark:bg-slate-900 border-2 border-emerald-500/30 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-black rounded-2xl hover:bg-emerald-600 hover:text-white transition-all shadow-lg shadow-emerald-100 dark:shadow-none text-[11px] uppercase tracking-widest"
          >
            <Database className="w-5 h-5 transition-transform group-hover:scale-110 group-active:rotate-12" />
            Add Product
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Product Details</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Part Set</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Unit</th>
                {userRole === "SUPER_ADMIN" && <th className="px-6 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Owner</th>}
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {initialProducts.map((prod: any) => (
                <tr key={prod.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Package className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-black text-slate-900 dark:text-white text-base tracking-tight leading-none mb-1">{prod.partName}</p>
                        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 font-mono tracking-widest uppercase">{prod.partNumber}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    {prod.partSet ? (
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-100 dark:border-emerald-500/20">
                        <Layers className="w-3.5 h-3.5" />
                        {prod.partSet.nameSet}
                      </div>
                    ) : (
                      <span className="text-slate-300 dark:text-slate-600 italic text-[10px] font-black uppercase tracking-widest">No Set Assigned</span>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400 font-black text-[10px] uppercase tracking-widest">
                      {prod.unit}
                    </div>
                  </td>
                  {userRole === "SUPER_ADMIN" && (
                    <td className="px-6 py-5">
                      <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-1 rounded-lg uppercase tracking-widest border border-indigo-100 dark:border-indigo-500/20">
                        {prod.supplier.code}
                      </span>
                    </td>
                  )}
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(prod)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-indigo-100 dark:border-indigo-500/20 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-all"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      <button
                        onClick={() => openDeleteModal(prod)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-red-100 dark:border-red-500/20 hover:bg-red-100 dark:hover:bg-red-500/20 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Hapus Produk?</h3>
              <p className="text-slate-500 mb-8 leading-relaxed">
                Anda akan menghapus <span className="font-bold text-slate-900">{productToDelete?.partName}</span>.
                Tindakan ini tidak dapat dibatalkan.
              </p>

              {deleteError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm text-left animate-in fade-in slide-in-from-top-2 duration-300">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="font-medium leading-tight">{deleteError}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all font-sans"
                >
                  Batal
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-6 py-3 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-all shadow-lg shadow-red-100 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
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
