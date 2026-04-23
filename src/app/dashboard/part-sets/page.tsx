import prisma from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { LayoutGrid, PlusCircle, Building2, Edit, Trash2 } from "lucide-react"
import { deletePartSet } from "@/lib/actions/master"
import PartSetListClient from "@/components/dashboard/PartSetListClient"

export default async function PartSetsPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const role = (session.user as any).role
  const supplierId = (session.user as any).supplierId

  // Fetch PartSets - filter by supplier if not admin
  const filter = role === "SUPER_ADMIN" ? {} : { supplierId }
  const partSets = await prisma.partSet.findMany({
    where: filter,
    include: { supplier: true, _count: { select: { products: true } } },
    orderBy: { createdAt: "desc" }
  })

  const suppliers = role === "SUPER_ADMIN" ? await prisma.supplier.findMany() : []

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PartSetListClient 
        initialPartSets={partSets} 
        suppliers={suppliers} 
        userRole={role} 
      />
    </div>
  )
}
