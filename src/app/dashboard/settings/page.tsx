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
    isAdmin ? prisma.user.findMany({ include: { supplier: true }, orderBy: { createdAt: "desc" } }) : [],
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
    <div className="space-y-6">
      <div className="flex flex-col gap-0.5">
        <h1 className="text-lg font-bold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-slate-500 text-xs font-medium">Manage system configuration and external connections.</p>
      </div>

      {/* Dynamic Database Connection Manager */}
      <DbConnectionManager config={dbConfig} />

      {/* User Management restricted to Admin */}
      {isAdmin && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-amber-100 rounded-lg text-amber-600">
              <Shield className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-slate-900">User Management (Super Admin Only)</h2>
          </div>
          <UserList initialUsers={users} suppliers={suppliers} />
        </div>
      )}
    </div>
  )
}
