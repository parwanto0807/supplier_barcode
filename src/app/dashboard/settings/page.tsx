import prisma from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import UserList from "@/components/auth/UserList"
import { Shield, Database, CheckCircle2, XCircle } from "lucide-react"
import DbConnectionManager from "@/components/dashboard/DbConnectionManager"

export default async function SettingsPage() {
  const session = await auth()
  const user = session?.user as any
  const isAdmin = user?.role === "SUPER_ADMIN"

  const [users, suppliers] = await Promise.all([
    isAdmin ? prisma.user.findMany({ orderBy: { createdAt: "desc" } }) : [],
    prisma.supplier.findMany({ orderBy: { name: "asc" } }),
  ])

  // Get env status
  const dbConfig = {
    host: process.env.IP_PUBLIC_MYSQL,
    user: process.env.USER_MYSQL,
    db: process.env.DB_MYSQL,
    hasPassword: !!process.env.PASSWORD_MYSQL
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-slate-500 font-medium">Manage system configuration and external connections.</p>
      </div>

      {/* Dynamic Database Connection Manager */}
      <DbConnectionManager config={dbConfig} />

      {/* User Management restricted to Admin */}
      {isAdmin && (
        <div className="space-y-8 pt-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
              <Shield className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">User Management (Super Admin Only)</h2>
          </div>
          <UserList initialUsers={users} suppliers={suppliers} />
        </div>
      )}
    </div>
  )
}
