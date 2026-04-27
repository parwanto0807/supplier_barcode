"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
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
  ChevronRight,
  Menu,
  X
} from "lucide-react"

export function SidebarClient({ user }: { user: any }) {
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()
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

  // Persist desktop sidebar state
  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed")
    if (saved) setIsCollapsed(saved === "true")
  }, [])

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  const toggleSidebar = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    localStorage.setItem("sidebar-collapsed", String(newState))
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" })
  }

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard"
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* ─── DESKTOP SIDEBAR ─── */}
      <aside 
        className={`hidden md:flex relative h-screen bg-white dark:bg-[#0f172a] border-r border-slate-200 dark:border-slate-800 transition-all duration-500 ease-in-out flex-col z-40
          ${isCollapsed ? "w-14" : "w-56"}`}
      >
        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-2.5 top-16 w-5 h-5 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all z-40"
        >
          {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>

        {/* Brand */}
        <div className="py-3 px-3 mb-1">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <div className="w-7 h-7 flex-shrink-0 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Package className="w-4 h-4 text-white" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col leading-none animate-in fade-in slide-in-from-left-2 duration-500">
                <span className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">Supplier Portal</span>
                <span className="text-[10px] font-black tracking-tight text-slate-900 dark:text-white uppercase leading-tight">
                  PT. Grafindo Mitrasemesta
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav className={`flex-1 px-2 space-y-0.5 scrollbar-hide ${isCollapsed ? "overflow-visible" : "overflow-y-auto"}`}>
          {menuItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all font-semibold text-xs group relative
                ${isCollapsed ? "justify-center" : "justify-start"}
                ${isActive(item.href)
                  ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                }`}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {!isCollapsed && (
                <span className="animate-in fade-in slide-in-from-left-2 duration-300 whitespace-nowrap">{item.label}</span>
              )}
              {isCollapsed && (
                <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all translate-x-[-8px] group-hover:translate-x-0 z-50 whitespace-nowrap shadow-xl">
                  {item.label}
                </div>
              )}
            </a>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-2 mt-auto border-t border-slate-100 dark:border-slate-800">
          <button 
            onClick={handleSignOut}
            className={`flex items-center gap-2.5 px-2.5 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all font-semibold text-xs w-full relative group
              ${isCollapsed ? "justify-center" : "justify-start"}`}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!isCollapsed && <span className="animate-in fade-in duration-300">Log Out</span>}
            {isCollapsed && (
              <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all translate-x-[-8px] group-hover:translate-x-0 z-50 whitespace-nowrap">
                Log Out
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* ─── MOBILE: TOP BAR HAMBURGER ─── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 h-12 bg-white dark:bg-[#0f172a] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center">
            <Package className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Grafindo Portal</span>
        </div>
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Menu className="w-5 h-5 text-slate-600 dark:text-slate-300" />
        </button>
      </div>

      {/* ─── MOBILE: DRAWER OVERLAY ─── */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-[60] flex">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />
          {/* Drawer */}
          <div className="relative w-72 max-w-[85vw] h-full bg-white dark:bg-[#0f172a] shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <Package className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Supplier Portal</p>
                  <p className="text-xs font-black text-slate-900 dark:text-white uppercase leading-tight">PT. Grafindo Mitrasemesta</p>
                </div>
              </div>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            {/* User Info */}
            <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-black text-xs">
                    {(user as any)?.name?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) || "AD"}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{(user as any)?.name || "Admin"}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{(user as any)?.role}</p>
                </div>
              </div>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
              {menuItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all font-semibold text-sm
                    ${isActive(item.href)
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Logout */}
            <div className="p-3 border-t border-slate-100 dark:border-slate-800">
              <button 
                onClick={handleSignOut}
                className="flex items-center gap-3 px-3 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all font-semibold text-sm w-full"
              >
                <LogOut className="w-5 h-5" />
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MOBILE: BOTTOM NAV BAR ─── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#0f172a] border-t border-slate-200 dark:border-slate-800 safe-area-pb">
        <div className="flex items-center justify-around px-2 py-1">
          {menuItems.slice(0, 5).map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all min-w-0 flex-1
                ${isActive(item.href)
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-slate-400 dark:text-slate-500"
                }`}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive(item.href) ? "scale-110" : ""} transition-transform`} />
              <span className="text-[8px] font-bold truncate w-full text-center leading-none">
                {item.label.split(" ")[0]}
              </span>
            </a>
          ))}
        </div>
      </nav>
    </>
  )
}
