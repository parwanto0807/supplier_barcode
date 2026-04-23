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
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Dashboard Overview</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Selamat datang kembali. Berikut ringkasan sistem Anda hari ini.</p>
        </div>
        
        {/* Live Status Indicator */}
        <div className="flex items-center gap-4 px-5 py-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-800">
          <div className="relative">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping absolute" />
            <div className="w-3 h-3 bg-emerald-500 rounded-full relative" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1">Database Status</p>
            <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">Live Connected</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Produk", value: totalProducts, icon: Package, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-500/10" },
          { label: "Total Cetak QR", value: totalItems, icon: Activity, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
          { label: "Total Part Set", value: totalSets, icon: Layers, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10" },
          { label: "Total User", value: totalUsers, icon: Users, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10" },
        ].map((stat: any, i: number) => (
          <div key={i} className="group bg-white dark:bg-slate-900 p-7 rounded-[32px] shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-800 hover:shadow-xl dark:hover:border-indigo-500/50 hover:-translate-y-1 transition-all duration-300">
            <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <stat.icon className="w-7 h-7" />
            </div>
            <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{stat.label}</p>
            <p className="text-4xl font-black text-slate-900 dark:text-white mt-2">{stat.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Recent Activity */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/30 dark:bg-slate-800/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-600 rounded-xl text-white">
                  <Activity className="w-5 h-5" />
                </div>
                <h3 className="font-black text-xl text-slate-900 dark:text-white uppercase tracking-tight">Transaksi Terakhir</h3>
              </div>
              <Link href="/dashboard/history" className="text-indigo-600 dark:text-indigo-400 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
                Semua Riwayat <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="p-8">
              <div className="space-y-7">
                {recentAdds.length > 0 ? recentAdds.map((item: any, i: number) => (
                   <div key={item.id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/20 group-hover:text-indigo-500 transition-colors">
                        <QrCode className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white text-lg leading-none mb-1">{item.noLotSpk}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{item.product.partName} • {item.qty} {item.product.unit}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-bold text-sm justify-end">
                        <Clock className="w-4 h-4" />
                        {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-1">Cetak Berhasil</p>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-10 text-slate-400 dark:text-slate-500 italic">Belum ada transaksi</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Shortcuts & Info */}
        <div className="space-y-8">
          {/* Quick Menu */}
          <div className="grid grid-cols-2 gap-4">
            {shortcuts.map((menu: any, i: number) => (
              <Link 
                key={i} 
                href={menu.href}
                className={`${menu.color} p-6 rounded-[32px] text-white ${menu.shadow} dark:shadow-none shadow-lg hover:scale-105 active:scale-95 transition-all flex flex-col items-center justify-center gap-3 text-center group`}
              >
                <menu.icon className="w-8 h-8 group-hover:rotate-12 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-tighter">{menu.title}</span>
              </Link>
            ))}
          </div>

          {/* Integration Info Card */}
          <div className="bg-[#0f172a] dark:bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl border dark:border-slate-800 animate-in slide-in-from-bottom-4 duration-500 delay-150">
            <div className="relative z-10 space-y-4">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-4">
                <Database className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-2xl font-black leading-tight uppercase tracking-tighter">Database Pusat Sync.</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Sistem Anda terhubung secara real-time dengan database pusat untuk pembaruan produk instan.
              </p>
              <div className="pt-2">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
                  System Robust
                </div>
              </div>
            </div>
            {/* Shapes */}
            <div className="absolute top-[-20%] right-[-20%] w-48 h-48 rounded-full bg-indigo-500/10 blur-3xl" />
            <div className="absolute bottom-[-20%] left-[-20%] w-48 h-48 rounded-full bg-blue-500/10 blur-3xl" />
          </div>
        </div>

      </div>
    </div>
  )
}
