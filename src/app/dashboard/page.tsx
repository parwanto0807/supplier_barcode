import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import Link from "next/link"
import { 
  Package, 
  Users, 
  Zap, 
  Activity, 
  PlusCircle, 
  Database,
  QrCode,
  Layers,
  ChevronRight,
  TrendingUp,
  Clock
} from "lucide-react"

export default async function DashboardPage() {
  const session = await auth()
  const role = (session?.user as any)?.role
  const supplierId = (session?.user as any)?.supplierId

  // Filters
  const filter = role === "SUPER_ADMIN" ? {} : { supplierId: supplierId }

  // Stats
  const [totalProducts, totalItems, totalUsers, totalSets] = await Promise.all([
    prisma.product.count({ where: filter }),
    prisma.item.count({ where: filter }),
    prisma.user.count({ where: role === "SUPER_ADMIN" ? {} : { supplierId: supplierId } }),
    prisma.partSet.count({ where: filter }),
  ])

  // Recent Transactions (5 Latest)
  const recentAdds = await prisma.item.findMany({
    where: filter,
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { product: true }
  })

  // Colorful Shortcuts
  const shortcuts = [
    { title: "Generate QR", href: "/dashboard/generate", icon: QrCode, color: "bg-indigo-500", shadow: "shadow-indigo-100" },
    { title: "Master Produk", href: "/dashboard/products", icon: Package, color: "bg-emerald-500", shadow: "shadow-emerald-100" },
    { title: "Part Set", href: "/dashboard/part-sets", icon: Layers, color: "bg-amber-500", shadow: "shadow-amber-100" },
  ]

  if (role === "SUPER_ADMIN") {
    shortcuts.push({ title: "Database Sync", href: "/dashboard/products", icon: Database, color: "bg-blue-500", shadow: "shadow-blue-100" })
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight uppercase">Dashboard</h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mt-0.5 hidden sm:block">Selamat datang kembali. Berikut ringkasan sistem Anda hari ini.</p>
        </div>
        
        {/* Live Status Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-900 rounded-xl shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-800">
          <div className="relative">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping absolute" />
            <div className="w-2 h-2 bg-emerald-500 rounded-full relative" />
          </div>
          <p className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest leading-none">Live</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {[
          { label: "Total Produk", value: totalProducts, icon: Package, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-500/10" },
          { label: "Total Cetak QR", value: totalItems, icon: Activity, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
          { label: "Total Part Set", value: totalSets, icon: Layers, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10" },
          { label: "Total User", value: totalUsers, icon: Users, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10" },
        ].map((stat: any, i: number) => (
          <div key={i} className="group bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-800 hover:shadow-md dark:hover:border-indigo-500/50 transition-all duration-300">
            <div className={`w-8 h-8 ${stat.bg} ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
              <stat.icon className="w-4 h-4" />
            </div>
            <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{stat.label}</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{stat.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        
        {/* Left Column: Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/30 dark:bg-slate-800/30">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-indigo-600 rounded-lg text-white">
                  <Activity className="w-3.5 h-3.5" />
                </div>
                <h3 className="font-black text-xs text-slate-900 dark:text-white uppercase tracking-tight">Transaksi Terakhir</h3>
              </div>
              <Link href="/dashboard/history" className="text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center gap-1">
                Semua <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {recentAdds.length > 0 ? recentAdds.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between px-4 py-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg flex items-center justify-center text-indigo-500 flex-shrink-0">
                      <QrCode className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 dark:text-white text-xs leading-none mb-0.5 truncate">{item.noLotSpk}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{item.product.partName} • {item.qty} {item.product.unit}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <div className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-bold text-[10px] justify-end">
                      <Clock className="w-3 h-3" />
                      {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-slate-400 dark:text-slate-500 italic text-xs">Belum ada transaksi</div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Shortcuts */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2.5">
            {shortcuts.map((menu: any, i: number) => (
              <Link 
                key={i} 
                href={menu.href}
                className={`${menu.color} p-4 rounded-xl text-white shadow-sm hover:scale-105 active:scale-95 transition-all flex flex-col items-center justify-center gap-2 text-center group`}
              >
                <menu.icon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span className="text-[9px] font-black uppercase tracking-tighter">{menu.title}</span>
              </Link>
            ))}
          </div>

          {/* Integration Info Card */}
          <div className="bg-[#0f172a] dark:bg-slate-900 rounded-2xl p-4 text-white relative overflow-hidden border dark:border-slate-800">
            <div className="relative z-10 space-y-2">
              <div className="w-7 h-7 bg-white/10 rounded-lg flex items-center justify-center">
                <Database className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <h3 className="text-xs font-black leading-tight uppercase tracking-tighter">Database Pusat Sync.</h3>
              <p className="text-slate-400 text-[10px] leading-relaxed">
                Terhubung real-time dengan database pusat untuk pembaruan produk instan.
              </p>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-[8px] font-bold uppercase tracking-widest">
                System Robust
              </div>
            </div>
            <div className="absolute top-[-20%] right-[-20%] w-32 h-32 rounded-full bg-indigo-500/10 blur-3xl" />
            <div className="absolute bottom-[-20%] left-[-20%] w-32 h-32 rounded-full bg-blue-500/10 blur-3xl" />
          </div>
        </div>

      </div>
    </div>
  )
}
