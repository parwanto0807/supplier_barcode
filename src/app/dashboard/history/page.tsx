import prisma from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { History as HistoryIcon, Tag, User, Calendar, Search, Filter, Printer } from "lucide-react"
import Link from "next/link"
import HistoryActions from "@/components/dashboard/HistoryActions"
import SearchBar from "@/components/dashboard/SearchBar"

export default async function HistoryPage({ searchParams }: { searchParams: any }) {
  const params = await searchParams
  const query = params.q || ""
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
          { noLotSpk: { contains: query, mode: "insensitive" as any } },
        ]
      } : {}
    ]
  }

  const items = await prisma.item.findMany({
    where: filter,
    include: {
      product: true,
      supplier: true,
    },
    take: 20,
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="space-y-8 animate-in fade-in duration-700 font-inter">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Riwayat Cetak</h1>
        <p className="text-slate-500 dark:text-slate-400 font-semibold tracking-tight">Log aktivitas pencetakan barcode dan pelacakan unit produksi.</p>
      </div>

      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-5 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm dark:shadow-none">
        <SearchBar />
        <div className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-4">
          {items.length} Records found
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Waktu / Barcode</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Product Detail</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Customer</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center">Qty</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Produksi</th>
                {role === "SUPER_ADMIN" && <th className="px-6 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Supplier</th>}
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50 font-inter">
              {items.map((item: any) => (
                <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 font-mono tracking-tighter uppercase">
                        {new Date(item.createdAt).toLocaleString("id-ID", { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="text-sm font-black text-indigo-600 dark:text-indigo-400 font-mono flex items-center gap-1 mt-1 group-hover:translate-x-1 transition-transform">
                        <Tag className="w-3.5 h-3.5" />
                        {item.barcode}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="font-black text-slate-900 dark:text-white tracking-tight">{item.product.partName}</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-black tracking-widest font-mono uppercase mt-0.5">{item.product.partNumber}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      item.customer === "Yamaha" 
                        ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20" 
                        : "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-500/20"
                    }`}>
                      {item.customer}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-black text-slate-900 dark:text-white">
                        {item.totalQty || item.qty} <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase">{item.product.unit}</span>
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-tighter">
                        {item.labelCount || 1} LBL • {item.qty}/BOX
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col text-xs">
                      <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                        <div className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                          <User className="w-3 h-3 text-slate-500" />
                        </div>
                        <span className="font-black tracking-tight">{item.inspector}</span>
                      </div>
                      <div className="mt-1.5 text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                        LOT: <span className="font-black text-indigo-600 dark:text-indigo-400">{item.noLotSpk}</span>
                      </div>
                    </div>
                  </td>
                  {role === "SUPER_ADMIN" && (
                    <td className="px-6 py-5">
                      <span className="text-[10px] font-black bg-slate-900 dark:bg-slate-800 text-white px-2 py-1 rounded-lg border border-slate-700 uppercase tracking-widest">
                        {item.supplier.code}
                      </span>
                    </td>
                  )}
                  <td className="px-8 py-5 text-right">
                    <HistoryActions item={item} />
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={role === "SUPER_ADMIN" ? 7 : 6} className="px-8 py-32 text-center text-slate-400 dark:text-slate-500 italic">
                    <HistoryIcon className="w-12 h-12 mx-auto mb-4 opacity-10" />
                    Belum ada riwayat pencetakan barcode.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
