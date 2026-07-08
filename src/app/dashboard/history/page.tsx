import prisma from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { History as HistoryIcon, Tag, User, ChevronLeft, ChevronRight } from "lucide-react"
import HistoryActions from "@/components/dashboard/HistoryActions"
import SearchBar from "@/components/dashboard/SearchBar"
import Link from "next/link"

const PAGE_SIZE = 10

export default async function HistoryPage({ searchParams }: { searchParams: any }) {
  const params = await searchParams
  const query = params.q || ""
  const currentPage = Math.max(1, parseInt(params.page || "1", 10))
  const session = await auth()
  if (!session) redirect("/login")

  const role = (session.user as any).role
  const supplierId = (session.user as any).supplierId

  const baseFilter = role === "SUPER_ADMIN" ? {} : { supplierId }
  
  const filter = {
    AND: [
      baseFilter,
      query ? {
        OR: [
          { product: { partName: { contains: query, mode: "insensitive" as any } } },
          { product: { partNumber: { contains: query, mode: "insensitive" as any } } },
          { customer: { contains: query, mode: "insensitive" as any } },
          { customerName: { contains: query, mode: "insensitive" as any } },
          { noLotSpk: { contains: query, mode: "insensitive" as any } },
        ]
      } : {}
    ]
  }

  const totalCount = await prisma.item.count({ where: filter })
  const cappedTotal = Math.min(totalCount, 200)
  const totalPages = Math.max(1, Math.ceil(cappedTotal / PAGE_SIZE))
  const safePage = Math.min(currentPage, totalPages)

  const items = await prisma.item.findMany({
    where: filter,
    include: { product: true, supplier: true },
    take: PAGE_SIZE,
    skip: (safePage - 1) * PAGE_SIZE,
    orderBy: { createdAt: "desc" }
  })

  const buildPageUrl = (page: number) => {
    const p = new URLSearchParams()
    if (query) p.set("q", query)
    p.set("page", String(page))
    return `/dashboard/history?${p.toString()}`
  }

  // Build pagination range with ellipsis
  const paginationRange = (): (number | "...")[] => {
    const delta = 2
    const range: (number | "...")[] = []
    const left = safePage - delta
    const right = safePage + delta

    let prev: number | null = null
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= left && i <= right)) {
        if (prev !== null && i - prev > 1) range.push("...")
        range.push(i)
        prev = i
      }
    }
    return range
  }

  return (
    <div className="space-y-3 animate-in fade-in duration-700 font-inter">
      {/* Page Header */}
      <div>
        <h1 className="text-base font-black text-slate-900 dark:text-white tracking-tight uppercase">Riwayat Cetak</h1>
        <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mt-0.5 hidden sm:block">Log aktivitas pencetakan barcode dan pelacakan unit produksi.</p>
      </div>

      {/* Search + Count */}
      <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex-1">
          <SearchBar />
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <div className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest whitespace-nowrap">
            {cappedTotal} records
          </div>
          {totalPages > 1 && (
            <div className="text-[9px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest whitespace-nowrap">
              Hal {safePage} / {totalPages}
            </div>
          )}
        </div>
      </div>

      {/* ─── DESKTOP TABLE ─── */}
      <div className="hidden md:block bg-white dark:bg-slate-900 rounded-2xl shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
                <th className="px-4 py-3 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Waktu / Barcode</th>
                <th className="px-4 py-3 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Product Detail</th>
                <th className="px-4 py-3 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Customer</th>
                <th className="px-4 py-3 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center">Qty</th>
                <th className="px-4 py-3 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center">Tgl. Packing</th>
                <th className="px-4 py-3 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Produksi</th>
                {role === "SUPER_ADMIN" && <th className="px-4 py-3 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Supplier</th>}
                <th className="px-4 py-3 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {items.map((item: any) => (
                <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 font-mono tracking-tight uppercase">
                        {new Date(item.createdAt).toLocaleString("id-ID", { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: "Asia/Jakarta" })}
                      </span>
                      <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 font-mono flex items-center gap-1 mt-0.5">
                        <Tag className="w-3 h-3" />{item.barcode}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 dark:text-white text-xs tracking-tight">{item.product.partName}</span>
                      <span className="text-[9px] text-slate-500 dark:text-slate-400 font-bold tracking-widest font-mono uppercase mt-0.5">{item.product.partNumber}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      item.customer === "Yamaha" 
                        ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20" 
                        : item.customer === "Honda"
                          ? "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-500/20"
                          : "bg-slate-50 dark:bg-slate-700/10 text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-700/20"
                    }`}>{item.customerName || item.customer}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-xs font-black text-slate-900 dark:text-white">
                      {item.totalQty || item.qty} <span className="text-[9px] text-slate-500 uppercase">{item.product.unit}</span>
                    </span>
                    <p className="text-[9px] text-slate-400 font-bold uppercase">{item.labelCount || 1} LBL</p>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
                      {item.packingDate ? (() => {
                        const [y, m, d] = item.packingDate.split("-");
                        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                        return `${d}-${months[parseInt(m) - 1]}-${y}`;
                      })() : "-"}
                    </span>
                    <p className="text-[8px] font-black text-indigo-500 uppercase tracking-tighter">{item.showPackingDate ? "Visible" : "Hidden"}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-xs text-slate-800 dark:text-slate-200">
                      <User className="w-3 h-3 text-slate-400" />
                      <span className="font-bold text-xs">{item.inspector}</span>
                    </div>
                    <p className="text-[9px] text-slate-500 font-bold uppercase mt-0.5">LOT: <span className="text-indigo-600 dark:text-indigo-400">{item.noLotSpk}</span></p>
                  </td>
                  {role === "SUPER_ADMIN" && (
                    <td className="px-4 py-3">
                      <span className="text-[9px] font-black bg-slate-900 dark:bg-slate-800 text-white px-2 py-0.5 rounded border border-slate-700 uppercase tracking-widest">
                        {item.supplier.code}
                      </span>
                    </td>
                  )}
                  <td className="px-4 py-3 text-right">
                    <HistoryActions item={item} />
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={role === "SUPER_ADMIN" ? 7 : 6} className="px-8 py-16 text-center text-slate-400 dark:text-slate-500 italic">
                    <HistoryIcon className="w-8 h-8 mx-auto mb-3 opacity-10" />
                    Belum ada riwayat pencetakan barcode.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── MOBILE CARD LIST ─── */}
      <div className="md:hidden space-y-2">
        {items.length === 0 && (
          <div className="text-center py-12 text-slate-400 dark:text-slate-500 italic text-sm">
            <HistoryIcon className="w-8 h-8 mx-auto mb-3 opacity-20" />
            Belum ada riwayat pencetakan.
          </div>
        )}
        {items.map((item: any) => (
          <div key={item.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
            {/* Card Header */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-mono text-[10px] font-black">
                <Tag className="w-3 h-3" />
                <span className="truncate max-w-[160px]">{item.barcode}</span>
              </div>
              <span className="text-[9px] text-slate-400 font-medium">
                {new Date(item.createdAt).toLocaleString("id-ID", { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: "Asia/Jakarta" })}
              </span>
            </div>
            {/* Card Body */}
            <div className="px-4 py-3 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 dark:text-white text-sm leading-tight truncate">{item.product.partName}</p>
                  <p className="text-[9px] text-slate-500 font-mono uppercase tracking-wider mt-0.5">{item.product.partNumber}</p>
                </div>
                <span className={`flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                  item.customer === "Yamaha" 
                    ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" 
                    : item.customer === "Honda"
                      ? "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400"
                      : "bg-slate-50 dark:bg-slate-700/10 text-slate-700 dark:text-slate-300"
                }`}>{item.customerName || item.customer}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase font-bold">Qty</span>
                    <p className="font-black text-slate-900 dark:text-white">{item.totalQty || item.qty} <span className="text-[9px] text-slate-400">{item.product.unit}</span></p>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase font-bold">Label</span>
                    <p className="font-black text-slate-900 dark:text-white">{item.labelCount || 1} lbr</p>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase font-bold">Inspector</span>
                    <p className="font-bold text-slate-900 dark:text-white text-xs">{item.inspector}</p>
                  </div>
                </div>
                {role === "SUPER_ADMIN" && (
                  <span className="text-[9px] font-black bg-slate-900 text-white px-2 py-0.5 rounded uppercase">{item.supplier.code}</span>
                )}
              </div>
              <div className="text-[9px] text-slate-500 font-bold uppercase">
                LOT: <span className="text-indigo-600 dark:text-indigo-400 font-black">{item.noLotSpk}</span>
              </div>
            </div>
            {/* Card Footer: Actions */}
            <div className="px-4 py-2.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20">
              <HistoryActions item={item} />
            </div>
          </div>
        ))}
      </div>

      {/* ─── PAGINATION ─── */}
      {cappedTotal > 0 && (
        <div className="flex items-center justify-center gap-1 py-2 select-none">
          {/* Prev */}
          <Link
            href={buildPageUrl(safePage - 1)}
            aria-disabled={safePage <= 1}
            className={`flex items-center justify-center w-8 h-8 rounded-lg border text-xs font-bold transition-all ${
              safePage <= 1
                ? "pointer-events-none opacity-30 border-slate-100 dark:border-slate-800 text-slate-400"
                : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:border-indigo-300 dark:hover:border-indigo-500/30 hover:text-indigo-600 dark:hover:text-indigo-400"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>

          {/* Page numbers */}
          {paginationRange().map((pageItem, idx) =>
            pageItem === "..." ? (
              <span
                key={`ellipsis-${idx}`}
                className="flex items-center justify-center w-8 h-8 text-xs font-bold text-slate-400 dark:text-slate-600"
              >
                …
              </span>
            ) : (
              <Link
                key={pageItem}
                href={buildPageUrl(pageItem)}
                className={`flex items-center justify-center w-8 h-8 rounded-lg border text-xs font-black transition-all ${
                  pageItem === safePage
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-sm shadow-indigo-200 dark:shadow-indigo-900/30"
                    : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:border-indigo-300 dark:hover:border-indigo-500/30 hover:text-indigo-600 dark:hover:text-indigo-400"
                }`}
              >
                {pageItem}
              </Link>
            )
          )}

          {/* Next */}
          <Link
            href={buildPageUrl(safePage + 1)}
            aria-disabled={safePage >= totalPages}
            className={`flex items-center justify-center w-8 h-8 rounded-lg border text-xs font-bold transition-all ${
              safePage >= totalPages
                ? "pointer-events-none opacity-30 border-slate-100 dark:border-slate-800 text-slate-400"
                : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:border-indigo-300 dark:hover:border-indigo-500/30 hover:text-indigo-600 dark:hover:text-indigo-400"
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  )
}
