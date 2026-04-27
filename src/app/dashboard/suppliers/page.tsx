import prisma from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import SupplierList from "@/components/dashboard/SupplierList"
import { Shield } from "lucide-react"

export default async function SuppliersPage() {
  const session = await auth()

  // Only allow SUPER_ADMIN to see this page
  if ((session?.user as any)?.role !== "SUPER_ADMIN") {
    redirect("/dashboard")
  }

  const suppliers = await prisma.supplier.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-5">
      <SupplierList initialSuppliers={suppliers} />

      <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex items-start gap-3">
        <div className="p-1.5 bg-indigo-100 rounded-lg text-indigo-600">
          <Shield className="w-4 h-4" />
        </div>
        <div>
          <h4 className="font-bold text-indigo-900 text-sm">Admin Control</h4>
          <p className="text-xs text-indigo-700 mt-0.5 leading-relaxed">
            As a Super Admin, you can manage the list of all suppliers. 
            Each supplier must have a unique code which they will use during login.
          </p>
        </div>
      </div>
    </div>
  )
}
