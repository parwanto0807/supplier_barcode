import prisma from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import ProductListClient from "@/components/dashboard/ProductListClient"

export default async function ProductsPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const role = (session.user as any).role
  const supplierId = (session.user as any).supplierId

  const filter = role === "SUPER_ADMIN" ? {} : { supplierId }
  
  const products = await prisma.product.findMany({
    where: filter,
    include: { partSet: true, supplier: true },
    orderBy: { createdAt: "desc" }
  })

  const [partSets, suppliers] = await Promise.all([
    prisma.partSet.findMany({ where: filter }),
    role === "SUPER_ADMIN" ? prisma.supplier.findMany() : []
  ])

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <ProductListClient 
        initialProducts={products} 
        partSets={partSets} 
        suppliers={suppliers} 
        userRole={role} 
        supplierId={supplierId}
      />
    </div>
  )
}
