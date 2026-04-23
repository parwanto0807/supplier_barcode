"use client"

import { useState, useEffect } from "react"
import { signOut } from "next-auth/react"
import { 
  LayoutDashboard, 
  Package, 
  History, 
  Settings, 
  LogOut,
  Building2,
  LayoutGrid,
  Tag,
  QrCode,
  ChevronLeft,
  ChevronRight
} from "lucide-react"

export function SidebarClient({ user }: { user: any }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const isAdmin = (user as any)?.role === "SUPER_ADMIN"

  const menuItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
    { icon: QrCode, label: "Cetak Barcode", href: "/dashboard/generate" },
    { icon: History, label: "History", href: "/dashboard/history" },
    { icon: Tag, label: "Master Product", href: "/dashboard/products" },
    { icon: LayoutGrid, label: "Part Sets", href: "/dashboard/part-sets" },
  ]

  if (isAdmin) {
    menuItems.push({ icon: Building2, label: "Suppliers", href: "/dashboard/suppliers" })
    menuItems.push({ icon: Settings, label: "Settings", href: "/dashboard/settings" })
  }

  // Persist state
  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed")
    if (saved) setIsCollapsed(saved === "true")
  }, [])

  const toggleSidebar = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    localStorage.setItem("sidebar-collapsed", String(newState))
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" })
  }

  return (
    <aside 
      className={`relative h-screen bg-white dark:bg-[#0f172a] border-r border-slate-200 dark:border-slate-800 transition-all duration-500 ease-in-out flex flex-col z-30
        ${isCollapsed ? "w-20" : "w-72"}`}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-24 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all z-40"
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* Brand Section */}
      <div className={`p-6 mb-4 transition-all duration-300 ${isCollapsed ? "px-4" : "px-8"}`}>
        <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400">
          <div className="w-10 h-10 flex-shrink-0 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none">
            <Package className="w-6 h-6 text-white" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col leading-none animate-in fade-in slide-in-from-left-2 duration-500">
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">Supplier Portal</span>
              <span className="text-sm font-black tracking-tight text-slate-900 dark:text-white uppercase leading-tight">
                PT. Grafindo <br /> Mitrasemesta
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-2 overflow-y-auto scrollbar-hide">
        {menuItems.map((item: any) => (
          <a
            key={item.label}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold text-sm group relative
              ${isCollapsed ? "justify-center" : "justify-start"}
              text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white`}
          >
            <item.icon className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110`} />
            {!isCollapsed && (
              <span className="animate-in fade-in slide-in-from-left-2 duration-300 whitespace-nowrap">{item.label}</span>
            )}
            
            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div className="absolute left-full ml-4 px-3 py-2 bg-slate-900 text-white text-xs font-black rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all translate-x-[-10px] group-hover:translate-x-0 z-50 whitespace-nowrap shadow-xl">
                {item.label}
              </div>
            )}
          </a>
        ))}
      </nav>

      {/* Bottom Section: User Info (Optional hidden) & Logout */}
      <div className="p-4 mt-auto border-t border-slate-100 dark:border-slate-800">
        <button 
          onClick={handleSignOut}
          className={`flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl transition-all font-black uppercase text-xs tracking-widest w-full relative group
            ${isCollapsed ? "justify-center" : "justify-start"}`}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="animate-in fade-in duration-300">Log Out</span>}
          
          {isCollapsed && (
            <div className="absolute left-full ml-4 px-3 py-2 bg-red-600 text-white text-xs font-black rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all translate-x-[-10px] group-hover:translate-x-0 z-50 whitespace-nowrap">
              Log Out
            </div>
          )}
        </button>
      </div>
    </aside>
  )
}
