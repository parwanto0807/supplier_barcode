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
  AlertCircle,
  Calendar,
  Search,
  ChevronDown
} from "lucide-react"
import { generateItemQR } from "@/lib/actions/items"
import { printLabels } from "@/lib/utils/print-label"

export default function QRGenerator({ products, suppliers, supplier, userRole }: any) {
  const [loading, setLoading] = useState(false)
  const [generatedItems, setGeneratedItems] = useState<any[] | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [totalQty, setTotalQty] = useState(1000)
  const [qtyPerLabel, setQtyPerLabel] = useState(100)

  // Derive unique part sets from products
  const partSets = Array.from(new Set(products.map((p: any) => p.partSet?.nameSet).filter(Boolean))).sort() as string[]
  const [selectedSetName, setSelectedSetName] = useState<string>("")
  const [searchSetName, setSearchSetName] = useState<string>("")
  const [searchPartNumber, setSearchPartNumber] = useState<string>("")
  const [isOpenSet, setIsOpenSet] = useState(false)
  const [isOpenPart, setIsOpenPart] = useState(false)
  const [focusedIndexSet, setFocusedIndexSet] = useState(-1)
  const [focusedIndexPart, setFocusedIndexPart] = useState(-1)
  const searchParams = useSearchParams()

  const filteredPartSets = partSets.filter(setName => setName.toLowerCase().includes(searchSetName.toLowerCase()))
  const filteredProducts = (selectedSetName
    ? products.filter((p: any) => p.partSet?.nameSet === selectedSetName)
    : products
  ).filter((p: any) =>
    p.partNumber.toLowerCase().includes(searchPartNumber.toLowerCase()) ||
    p.partName.toLowerCase().includes(searchPartNumber.toLowerCase())
  )

  const handleSetKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (!isOpenSet) setIsOpenSet(true)
      setFocusedIndexSet(prev => Math.min(prev + 1, filteredPartSets.length))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setFocusedIndexSet(prev => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (isOpenSet && focusedIndexSet >= 0) {
        if (focusedIndexSet === 0) {
          setSelectedSetName("")
          setSearchSetName("")
          setSelectedProduct(null)
          setSearchPartNumber("")
        } else {
          const setName = filteredPartSets[focusedIndexSet - 1]
          if (setName) {
            setSelectedSetName(setName)
            setSearchSetName(setName)
            setSelectedProduct(null)
            setSearchPartNumber("")
          }
        }
        setIsOpenSet(false)
        setFocusedIndexSet(-1)
      }
    } else if (e.key === 'Escape') {
      setIsOpenSet(false)
      setFocusedIndexSet(-1)
    }
  }

  const handlePartKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (!isOpenPart) setIsOpenPart(true)
      setFocusedIndexPart(prev => Math.min(prev + 1, filteredProducts.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setFocusedIndexPart(prev => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (isOpenPart && focusedIndexPart >= 0) {
        const p = filteredProducts[focusedIndexPart]
        if (p) {
          setSelectedProduct(p)
          setSearchPartNumber(`${p.partNumber} — ${p.partName}`)
        }
        setIsOpenPart(false)
        setFocusedIndexPart(-1)
      }
    } else if (e.key === 'Escape') {
      setIsOpenPart(false)
      setFocusedIndexPart(-1)
    }
  }

  const initialProductId = searchParams.get("productId")
  const initialQty = searchParams.get("qty")
  const initialTotalQty = searchParams.get("totalQty")
  const initialNoLotSpk = searchParams.get("noLotSpk")
  const initialInspector = searchParams.get("inspector")
  const initialCustomer = searchParams.get("customer")
  const initialCustomerName = searchParams.get("customerName")
  const [customerType, setCustomerType] = useState<string>(initialCustomer || "")

  useEffect(() => {
    if (initialProductId) {
      const prod = products.find((p: any) => p.id === initialProductId)
      if (prod) {
        setSelectedProduct(prod)
        if (prod.partSet?.nameSet) setSelectedSetName(prod.partSet.nameSet)
      }
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
    <div className="flex flex-col xl:flex-row gap-4 items-start animate-in fade-in duration-700 font-inter">

      {/* Form Section */}
      <div className="flex-1 space-y-3 w-full">

        {/* Step 1: Identity & Authorization */}
        <section className="bg-white dark:bg-[#0f172a] p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 transition-all hover:border-indigo-500/30">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <User className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none">Langkah 1: Identitas</h3>
              <p className="text-[8px] text-slate-500 font-bold mt-0.5 uppercase tracking-widest leading-none">Otoritas Produksi</p>
            </div>
          </div>

          <form id="qr-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {userRole === "SUPER_ADMIN" && (
              <div className="md:col-span-2 space-y-1 pb-2 border-b border-slate-100 dark:border-slate-800">
                <label className="text-[8px] font-black text-indigo-500 uppercase tracking-[0.2em] px-1">Admin: Select Supplier Owner</label>
                <select
                  name="supplierId"
                  required
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-indigo-100 dark:border-indigo-500/20 rounded-lg text-slate-900 dark:text-white font-bold focus:border-indigo-600 outline-none transition-all appearance-none text-xs"
                >
                  <option value="">-- Choose Supplier --</option>
                  {suppliers.map((s: any) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">Nama Inspector</label>
              <div className="relative">
                <input
                  name="inspector"
                  defaultValue={initialInspector || ""}
                  required
                  className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 text-xs"
                  placeholder="Misal: John Doe"
                />
                <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">Target Customer</label>
              <div className="relative">
                <select
                  name="customer"
                  required
                  value={customerType}
                  onChange={(e) => setCustomerType(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none text-xs"
                >
                  <option value="">-- Select Customer --</option>
                  <option value="Yamaha">Yamaha</option>
                  <option value="Honda">Honda</option>
                  <option value="Other">Other Customer</option>
                </select>
                <Building2 className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>

            {customerType === "Other" && (
              <div className="space-y-1 md:col-span-2">
                <label className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">Customer Name</label>
                <div className="relative">
                  <input
                    name="customerName"
                    defaultValue={initialCustomerName || ""}
                    required
                    className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 text-xs"
                    placeholder="Masukkan nama customer lain"
                  />
                  <Building2 className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>
            )}
          </form>
        </section>

        {/* Step 2: Product Detail */}
        <section className="bg-white dark:bg-[#0f172a] p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 transition-all hover:border-emerald-500/30">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center text-white">
              <Package className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none">Langkah 2: Detail Produk</h3>
              <p className="text-[8px] text-slate-500 font-bold mt-0.5 uppercase tracking-widest leading-none">Katalog & Spesifikasi</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">Pilih Nama Set</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="-- Semua Set / Cari Set --"
                  value={searchSetName}
                  onChange={(e) => {
                    setSearchSetName(e.target.value)
                    setIsOpenSet(true)
                    setFocusedIndexSet(-1)
                  }}
                  onFocus={() => setIsOpenSet(true)}
                  onBlur={() => setTimeout(() => { setIsOpenSet(false); setFocusedIndexSet(-1) }, 200)}
                  onKeyDown={handleSetKeyDown}
                  className="w-full pl-8 pr-8 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-xs placeholder:text-slate-400"
                />
                <Package className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <ChevronDown className={`absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 transition-transform ${isOpenSet ? 'rotate-180' : ''}`} />

                {isOpenSet && filteredPartSets.length > 0 && (
                  <ul className="absolute z-50 w-full mt-1 max-h-48 overflow-y-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg py-1">
                    <li
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        setSelectedSetName("")
                        setSearchSetName("")
                        setSelectedProduct(null)
                        setSearchPartNumber("")
                        setIsOpenSet(false)
                      }}
                      className={`px-3 py-2 text-xs cursor-pointer italic ${focusedIndexSet === 0 ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' : 'hover:bg-emerald-50 dark:hover:bg-emerald-500/10 text-slate-500'}`}
                    >
                      -- Reset / Semua Set --
                    </li>
                    {filteredPartSets.map((setName, index) => (
                      <li
                        key={setName}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          setSelectedSetName(setName)
                          setSearchSetName(setName)
                          setSelectedProduct(null)
                          setSearchPartNumber("")
                          setIsOpenSet(false)
                        }}
                        className={`px-3 py-2 text-xs cursor-pointer font-medium ${focusedIndexSet === index + 1 ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' : 'hover:bg-emerald-50 dark:hover:bg-emerald-500/10 text-slate-700 dark:text-slate-300'}`}
                      >
                        {setName}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">Pilih Part Number</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="-- Pilih Part / Cari --"
                  value={searchPartNumber}
                  onChange={(e) => {
                    setSearchPartNumber(e.target.value)
                    setIsOpenPart(true)
                    setFocusedIndexPart(-1)
                  }}
                  onFocus={() => setIsOpenPart(true)}
                  onBlur={() => setTimeout(() => { setIsOpenPart(false); setFocusedIndexPart(-1) }, 200)}
                  onKeyDown={handlePartKeyDown}
                  className="w-full pl-8 pr-8 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-xs placeholder:text-slate-400"
                />
                <Hash className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <ChevronDown className={`absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 transition-transform ${isOpenPart ? 'rotate-180' : ''}`} />

                {isOpenPart && filteredProducts.length > 0 && (
                  <ul className="absolute z-50 w-full mt-1 max-h-48 overflow-y-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg py-1">
                    {filteredProducts.map((p: any, index: number) => (
                      <li
                        key={p.id}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          setSelectedProduct(p)
                          setSearchPartNumber(`${p.partNumber} — ${p.partName}`)
                          setIsOpenPart(false)
                        }}
                        className={`px-3 py-2 text-xs cursor-pointer ${focusedIndexPart === index ? 'bg-emerald-100 dark:bg-emerald-500/20' : 'hover:bg-emerald-50 dark:hover:bg-emerald-500/10'}`}
                      >
                        <span className="font-bold text-slate-900 dark:text-white">{p.partNumber}</span> <span className="text-slate-500">— {p.partName}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <input type="hidden" name="productId" form="qr-form" value={selectedProduct?.id || ""} required />
              </div>
            </div>

            {selectedProduct && (
              <div className="grid grid-cols-2 gap-2 animate-in slide-in-from-top-2 duration-300">
                <div className="p-2.5 bg-emerald-50/50 dark:bg-emerald-500/5 rounded-lg border border-emerald-100 dark:border-emerald-500/10">
                  <p className="text-[7px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-0.5">Part Name</p>
                  <p className="font-bold text-slate-900 dark:text-white text-xs">{selectedProduct.partName}</p>
                </div>
                <div className="p-2.5 bg-blue-50/50 dark:bg-blue-500/5 rounded-lg border border-blue-100 dark:border-blue-500/10">
                  <p className="text-[7px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-0.5">Part Set</p>
                  <p className="font-bold text-slate-900 dark:text-white text-xs">{selectedProduct.partSet?.nameSet || "No Set"}</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Step 3: Production Logic */}
        <section className="bg-white dark:bg-[#0f172a] p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 transition-all hover:border-amber-500/30">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-7 h-7 bg-amber-600 rounded-lg flex items-center justify-center text-white">
              <Calculator className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none">Langkah 3: Logika Produksi</h3>
              <p className="text-[8px] text-slate-500 font-bold mt-0.5 uppercase tracking-widest leading-none">Quantity & Lot Control</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="space-y-1">
                <label className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">Total Qty Produksi</label>
                <div className="relative">
                  <input
                    form="qr-form"
                    name="totalQty"
                    type="number"
                    required
                    min="1"
                    value={totalQty}
                    onChange={(e) => setTotalQty(parseInt(e.target.value) || 0)}
                    className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-black text-base focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                  />
                  <Box className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>
              <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
                {[100, 500, 1000, 2500, 5000].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setTotalQty(val)}
                    className={`px-2.5 py-1 text-[8px] font-black rounded transition-all whitespace-nowrap uppercase tracking-widest
                      ${totalQty === val ? 'bg-amber-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-amber-50 dark:hover:bg-amber-500/10'}`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="space-y-1">
                <label className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">Qty Per Label</label>
                <div className="relative">
                  <input
                    form="qr-form"
                    name="qty"
                    type="number"
                    required
                    min="1"
                    value={qtyPerLabel}
                    onChange={(e) => setQtyPerLabel(parseInt(e.target.value) || 0)}
                    className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-slate-800 border border-indigo-100 dark:border-indigo-500/20 rounded-lg text-indigo-600 dark:text-indigo-400 font-black text-base focus:border-indigo-600 outline-none transition-all"
                  />
                  <ClipboardCheck className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-indigo-400" />
                </div>
              </div>
              <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
                {[10, 25, 50, 100, 200].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setQtyPerLabel(val)}
                    className={`px-2.5 py-1 text-[8px] font-black rounded transition-all whitespace-nowrap uppercase tracking-widest
                      ${qtyPerLabel === val ? 'bg-indigo-600 text-white' : 'bg-indigo-50 dark:bg-indigo-500/5 text-indigo-500 hover:bg-indigo-100 dark:hover:bg-indigo-500/20'}`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">Nomor Lot / No. SPK</label>
              <div className="relative">
                <input
                  form="qr-form"
                  name="noLotSpk"
                  required
                  defaultValue={initialNoLotSpk || ""}
                  className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-amber-500 outline-none transition-all text-xs"
                  placeholder="Misal: LOT-2024-001"
                />
                <Hash className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>

            {/* Packing Date */}
            <div className="space-y-1">
              <label className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">Tanggal Packing</label>
              <div className="relative">
                <input
                  form="qr-form"
                  name="packingDate"
                  type="date"
                  required
                  defaultValue={new Date().toISOString().split('T')[0]}
                  className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-amber-500 outline-none transition-all text-xs"
                />
                <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>

            {/* Toggle Display */}
            <div className="flex items-center gap-3 pt-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="showPackingDate" defaultChecked className="sr-only peer" form="qr-form" value="true" />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:inset-s-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                <span className="ms-2 text-[9px] font-black text-slate-500 uppercase tracking-wider">Tampilkan di Label?</span>
              </label>
            </div>
          </div>

          {/* Compact Breakdown */}
          <div className="mt-4 p-3 bg-slate-900 dark:bg-black rounded-xl text-white flex flex-row items-center justify-between gap-3 overflow-hidden relative">
            <div className="relative z-10">
              <p className="text-[7px] font-black text-slate-500 uppercase tracking-[0.3em] mb-0.5">ESTIMASI CETAK</p>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black text-indigo-400 leading-none">{labelCount}</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Lembar</span>
              </div>
            </div>
            <div className="relative z-10 flex items-center gap-3">
              <button
                form="qr-form"
                type="submit"
                disabled={loading || !selectedProduct}
                className="px-5 py-2 bg-indigo-600 text-white font-black rounded-lg hover:bg-indigo-500 transition-all disabled:opacity-50 flex items-center gap-1.5 uppercase tracking-widest text-[9px]"
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <QrCode className="w-3.5 h-3.5" />}
                Generate QR
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Preview Section */}
      <div className="w-full xl:w-75 xl:sticky xl:top-4 flex flex-col gap-3">

        <div className="bg-white dark:bg-[#0f172a] rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="px-4 py-2.5 border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
            <h4 className="font-black text-[9px] uppercase tracking-widest text-slate-400">Preview</h4>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
          </div>

          <div className="p-4 flex flex-col items-center">
            {loading ? (
              <div className="w-full space-y-3 animate-pulse">
                <div className="w-full aspect-square bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-slate-300 animate-spin" />
                </div>
                <div className="space-y-2">
                  <div className="h-10 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800"></div>
                  <div className="h-9 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
                </div>
              </div>
            ) : generatedItems && generatedItems.length > 0 ? (
              <div className="w-full space-y-3 animate-in zoom-in-95 duration-500">
                <div className="p-3 bg-white rounded-xl shadow-inner border border-slate-100 flex items-center justify-center overflow-hidden">
                  <QRCodeSVG value={generatedItems[0].barcode} size={150} level="H" />
                </div>

                <div className="space-y-2">
                  <div className="bg-slate-50 dark:bg-slate-900 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                    <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1">ID BARCODE</p>
                    <p className="font-mono text-[9px] font-black text-indigo-600 break-all bg-white dark:bg-black p-1.5 rounded border border-indigo-50 dark:border-slate-800">
                      {generatedItems[0].barcode}
                    </p>
                  </div>

                  <button
                    onClick={handlePrint}
                    className="w-full py-2.5 bg-slate-900 dark:bg-indigo-600 text-white font-black rounded-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group uppercase tracking-widest text-xs"
                  >
                    <Printer className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    Print All {generatedItems.length}
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 bg-slate-50 dark:bg-slate-900 rounded-xl flex items-center justify-center mx-auto text-slate-200 dark:text-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-800">
                  <QrCode className="w-6 h-6" />
                </div>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Menunggu Input Form</p>
              </div>
            )}
          </div>
        </div>

        {/* Compact Info Legend */}
        <div className="bg-indigo-600 rounded-xl p-4 text-white relative overflow-hidden">
          <div className="relative z-10 flex items-start gap-2.5">
            <AlertCircle className="w-3.5 h-3.5 text-indigo-200 mt-0.5 shrink-0" />
            <div className="space-y-1.5">
              <h5 className="font-black text-[10px] uppercase italic">QC Standar Industri</h5>
              <ul className="space-y-1">
                {[
                  "Gunakan sticker thermal standar",
                  "Cek kesesuaian Lot produksi",
                  "1 label = 1 pack fisik"
                ].map((txt: string, i: number) => (
                  <li key={i} className="flex items-center gap-1.5 text-[8px] font-bold text-indigo-100">
                    <div className="w-1 h-1 rounded-full bg-indigo-300 shrink-0" />
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
