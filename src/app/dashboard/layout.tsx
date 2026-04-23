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
      {/* Sidebar Client Component */}
      <SidebarClient user={session.user} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 font-inter">
        {/* Header */}
        <header className="h-20 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between sticky top-0 z-20">
          <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Control Center</h1>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-2" />
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block leading-none">
                  <p className="text-sm font-black text-slate-900 dark:text-white">{session.user?.name || "Admin"}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-1">{(session.user as any)?.role}</p>
                </div>
                <div className="w-10 h-10 bg-indigo-600 dark:bg-indigo-500 rounded-xl flex items-center justify-center overflow-hidden border border-indigo-700 dark:border-indigo-400 shadow-lg shadow-indigo-100 dark:shadow-none">
                  <span className="text-white font-black text-xs tracking-tighter">
                    {session.user?.name
                      ? session.user.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 3)
                      : "AD"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
