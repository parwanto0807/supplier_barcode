"use client"

import { useState, useRef, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { QRCodeSVG } from "qrcode.react"
import { 
  Loader2, 
  QrCode, 
  Printer, 
  User, 
  Package, 
  Calculator, 
  ClipboardCheck,
  Building2,
  Box,
  Hash,
  AlertCircle
} from "lucide-react"
import { generateItemQR } from "@/lib/actions/items"
import { printLabels } from "@/lib/utils/print-label"

export default function QRGenerator({ products, suppliers, supplier, userRole }: any) {
  const [loading, setLoading] = useState(false)
  const [generatedItems, setGeneratedItems] = useState<any[] | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [totalQty, setTotalQty] = useState(1000)
  const [qtyPerLabel, setQtyPerLabel] = useState(100)
  const searchParams = useSearchParams()

  const initialProductId = searchParams.get("productId")
  const initialQty = searchParams.get("qty")
  const initialTotalQty = searchParams.get("totalQty")
  const initialNoLotSpk = searchParams.get("noLotSpk")
  const initialInspector = searchParams.get("inspector")
  const initialCustomer = searchParams.get("customer")

  useEffect(() => {
    if (initialProductId) {
      const prod = products.find((p: any) => p.id === initialProductId)
      if (prod) setSelectedProduct(prod)
    }
    if (initialTotalQty) setTotalQty(parseInt(initialTotalQty))
    if (initialQty) setQtyPerLabel(parseInt(initialQty))
  }, [initialProductId, initialTotalQty, initialQty, products])

  const labelCount = Math.ceil(totalQty / qtyPerLabel) || 0

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    try {
      const items = await generateItemQR(formData)
      setGeneratedItems(items)
    } catch (err) {
      alert("Failed to generate QR Code")
    } finally {
      setLoading(false)
    }
  }

  const handlePrint = async () => {
    if (!generatedItems || generatedItems.length === 0) return
    await printLabels(generatedItems)
  }

  return (
    <div className="flex flex-col xl:flex-row gap-4 items-start animate-in fade-in duration-700 font-inter max-w-[1400px] mx-auto">
      
      {/* Form Section */}
      <div className="flex-1 space-y-4 w-full">
        
        {/* Step 1: Identity & Authorization */}
        <section className="bg-white dark:bg-[#0f172a] p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-all hover:border-indigo-500/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none">Langkah 1: Identitas</h3>
              <p className="text-[9px] text-slate-500 font-bold mt-1 uppercase tracking-widest leading-none">Otoritas Produksi</p>
            </div>
          </div>

          <form id="qr-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userRole === "SUPER_ADMIN" && (
              <div className="md:col-span-2 space-y-1.5 pb-2 border-b border-slate-100 dark:border-slate-800">
                <label className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.2em] px-1">Admin: Select Supplier Owner</label>
                <select
                  name="supplierId"
                  required
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border-2 border-indigo-100 dark:border-indigo-500/20 rounded-xl text-slate-900 dark:text-white font-bold focus:border-indigo-600 outline-none transition-all appearance-none text-sm"
                >
                  <option value="">-- Choose Supplier --</option>
                  {suppliers.map((s: any) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">Nama Inspector</label>
              <div className="relative">
                <input
                  name="inspector"
                  defaultValue={initialInspector || ""}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 text-sm"
                  placeholder="Misal: John Doe"
                />
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">Target Customer</label>
              <div className="relative">
                <select
                  name="customer"
                  required
                  defaultValue={initialCustomer || ""}
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none text-sm"
                >
                  <option value="">-- Select Customer --</option>
                  <option value="Yamaha">Yamaha</option>
                  <option value="Honda">Honda</option>
                </select>
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </div>
          </form>
        </section>

        {/* Step 2: Product Detail */}
        <section className="bg-white dark:bg-[#0f172a] p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-all hover:border-emerald-500/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-100">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none">Langkah 2: Detail Produk</h3>
              <p className="text-[9px] text-slate-500 font-bold mt-1 uppercase tracking-widest leading-none">Katalog & Spesifikasi</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">Pilih Part Number</label>
              <div className="relative">
              <select
                form="qr-form"
                name="productId"
                required
                defaultValue={initialProductId || ""}
                onChange={(e) => setSelectedProduct(products.find((p: any) => p.id === e.target.value))}
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-emerald-500 outline-none transition-all appearance-none shadow-sm text-sm"
              >
                <option value="">-- Choose Part --</option>
                {products.map((p: any) => (
                  <option key={p.id} value={p.id}>{p.partNumber} — {p.partName}</option>
                ))}
              </select>
              <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </div>

            {selectedProduct && (
              <div className="grid grid-cols-2 gap-3 animate-in slide-in-from-top-2 duration-300">
                <div className="p-3 bg-emerald-50/50 dark:bg-emerald-500/5 rounded-xl border border-emerald-100 dark:border-emerald-500/10">
                  <p className="text-[8px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-0.5">Part Name</p>
                  <p className="font-bold text-slate-900 dark:text-white text-xs">{selectedProduct.partName}</p>
                </div>
                <div className="p-3 bg-blue-50/50 dark:bg-blue-500/5 rounded-xl border border-blue-100 dark:border-blue-500/10">
                  <p className="text-[8px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-0.5">Part Set</p>
                  <p className="font-bold text-slate-900 dark:text-white text-xs">{selectedProduct.partSet?.nameSet || "No Set"}</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Step 3: Production Logic */}
        <section className="bg-white dark:bg-[#0f172a] p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-all hover:border-amber-500/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 bg-amber-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-amber-100">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none">Langkah 3: Logika Produksi</h3>
              <p className="text-[9px] text-slate-500 font-bold mt-1 uppercase tracking-widest leading-none">Quantity & Lot Control</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">Total Qty Produksi</label>
                <div className="relative">
                  <input
                    form="qr-form"
                    name="totalQty"
                    type="number"
                    required
                    min="1"
                    value={totalQty}
                    onChange={(e) => setTotalQty(parseInt(e.target.value) || 0)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-black text-lg focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                  />
                  <Box className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                </div>
              </div>
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                {[100, 500, 1000, 2500, 5000].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setTotalQty(val)}
                    className={`px-3 py-1.5 text-[8px] font-black rounded-lg transition-all whitespace-nowrap uppercase tracking-widest
                      ${totalQty === val ? 'bg-amber-600 text-white shadow-lg shadow-amber-100' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-amber-50 dark:hover:bg-amber-500/10'}`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">Qty Per Label</label>
                <div className="relative">
                  <input
                    form="qr-form"
                    name="qty"
                    type="number"
                    required
                    min="1"
                    value={qtyPerLabel}
                    onChange={(e) => setQtyPerLabel(parseInt(e.target.value) || 0)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border-2 border-indigo-100 dark:border-indigo-500/20 rounded-xl text-indigo-600 dark:text-indigo-400 font-black text-lg focus:border-indigo-600 outline-none transition-all shadow-sm"
                  />
                  <ClipboardCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400" />
                </div>
              </div>
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                {[10, 25, 50, 100, 200].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setQtyPerLabel(val)}
                    className={`px-3 py-1.5 text-[8px] font-black rounded-lg transition-all whitespace-nowrap uppercase tracking-widest
                      ${qtyPerLabel === val ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-indigo-50 dark:bg-indigo-500/5 text-indigo-500 hover:bg-indigo-100 dark:hover:bg-indigo-500/20'}`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">Nomor Lot / No. SPK</label>
              <div className="relative">
                <input
                  form="qr-form"
                  name="noLotSpk"
                  required
                  defaultValue={initialNoLotSpk || ""}
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-amber-500 outline-none transition-all text-sm"
                  placeholder="Misal: LOT-2024-001"
                />
                <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Compact Breakdown */}
          <div className="mt-6 p-4 bg-slate-900 dark:bg-black rounded-2xl text-white flex flex-row items-center justify-between gap-4 overflow-hidden relative group">
            <div className="relative z-10">
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] mb-0.5">ESTIMASI CETAK</p>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-black text-indigo-400 leading-none">{labelCount}</span>
                <span className="text-xs font-black text-slate-400 uppercase tracking-tighter">Lembar</span>
              </div>
            </div>
            <div className="relative z-10 flex items-center gap-4">
              <button
                form="qr-form"
                type="submit"
                disabled={loading || !selectedProduct}
                className="px-6 py-3 bg-indigo-600 text-white font-black rounded-xl shadow-xl shadow-indigo-900/50 hover:bg-indigo-500 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:translate-y-0 flex items-center gap-2 uppercase tracking-widest text-[10px]"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <QrCode className="w-4 h-4" />}
                Generate QR
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Preview Section - Compact */}
      <div className="w-full xl:w-[380px] sticky top-4 flex flex-col gap-4">
        
        <div className="bg-white dark:bg-[#0f172a] rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="p-4 border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
            <h4 className="font-black text-[10px] uppercase tracking-widest text-slate-400">Preview</h4>
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-red-400" />
              <div className="w-2 h-2 rounded-full bg-amber-400" />
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
          </div>
          
          <div className="p-6 flex flex-col items-center">
            {generatedItems && generatedItems.length > 0 ? (
              <div className="w-full space-y-4 animate-in zoom-in-95 duration-500">
                <div className="p-4 bg-white rounded-2xl shadow-inner border border-slate-100 flex items-center justify-center group overflow-hidden relative">
                  <QRCodeSVG value={generatedItems[0].barcode} size={180} level="H" />
                </div>
                
                <div className="space-y-3">
                  <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">ID BARCODE</p>
                    <p className="font-mono text-[10px] font-black text-indigo-600 break-all bg-white dark:bg-black p-2 rounded-lg border border-indigo-50 dark:border-slate-800">
                      {generatedItems[0].barcode}
                    </p>
                  </div>

                  <button
                    onClick={handlePrint}
                    className="w-full py-4 bg-slate-900 dark:bg-indigo-600 text-white font-black rounded-xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group uppercase tracking-widest text-xs"
                  >
                    <Printer className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    Print All {generatedItems.length}
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center mx-auto text-slate-200 dark:text-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-800">
                  <QrCode className="w-8 h-8" />
                </div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Menunggu Input Form</p>
              </div>
            )}
          </div>
        </div>

        {/* Compact Info Legend */}
        <div className="bg-indigo-600 rounded-2xl p-5 text-white relative overflow-hidden">
          <div className="relative z-10 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-indigo-200 mt-0.5" />
            <div className="space-y-2">
              <h5 className="font-black text-xs uppercase italic">QC Standar Industri</h5>
              <ul className="space-y-1.5">
                {[
                  "Gunakan sticker thermal standar",
                  "Cek kesesuaian Lot produksi",
                  "1 label = 1 pack fisik"
                ].map((txt, i) => (
                  <li key={i} className="flex items-center gap-2 text-[9px] font-bold text-indigo-100">
                    <div className="w-1 h-1 rounded-full bg-indigo-300" />
                    {txt}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
