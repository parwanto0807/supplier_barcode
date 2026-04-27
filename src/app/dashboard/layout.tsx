import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { ThemeToggle } from "@/components/dashboard/ThemeToggle"
import { SidebarClient } from "@/components/dashboard/SidebarClient"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex transition-colors duration-300">
      {/* Sidebar (desktop only, mobile handled inside SidebarClient) */}
      <SidebarClient user={session.user} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 font-inter">
        {/* Desktop Header */}
        <header className="hidden md:flex h-12 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-6 items-center justify-between sticky top-0 z-20">
          <h1 className="text-xs font-black text-slate-900 dark:text-white tracking-widest uppercase">Control Center</h1>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="h-5 w-px bg-slate-200 dark:bg-slate-800" />
            <div className="flex items-center gap-2.5">
              <div className="text-right hidden sm:block leading-none">
                <p className="text-xs font-bold text-slate-900 dark:text-white">{session.user?.name || "Admin"}</p>
                <p className="text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-0.5">{(session.user as any)?.role}</p>
              </div>
              <div className="w-7 h-7 bg-indigo-600 dark:bg-indigo-500 rounded-lg flex items-center justify-center overflow-hidden border border-indigo-700 dark:border-indigo-400">
                <span className="text-white font-black text-[9px] tracking-tighter">
                  {session.user?.name
                    ? session.user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 3)
                    : "AD"}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Header spacer (top bar is fixed) */}
        <div className="md:hidden h-12 flex-shrink-0" />

        {/* Content Area */}
        {/* pb-20 on mobile = space for bottom nav bar */}
        <div className="p-4 md:p-5 pb-24 md:pb-5 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
