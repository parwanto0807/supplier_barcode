import prisma from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import QRGenerator from "@/components/dashboard/QRGenerator"

export default async function GeneratePage() {
  const session = await auth()
  if (!session) redirect("/login")

  const role = (session.user as any).role
  const supplierId = (session.user as any).supplierId

  // Fetch only products belonging to this supplier (or all if admin)
  const filter = role === "SUPER_ADMIN" ? {} : { supplierId }
  
  const products = await prisma.product.findMany({
    where: filter,
    include: { partSet: true },
    orderBy: { partNumber: "asc" }
  })

  const [suppliers, supplier] = await Promise.all([
    role === "SUPER_ADMIN" ? prisma.supplier.findMany() : [],
    supplierId ? prisma.supplier.findUnique({ where: { id: supplierId } }) : null
  ])

  return (
    <div className="w-full space-y-3">
      <div className="flex flex-col gap-0.5">
        <h1 className="text-base font-bold text-slate-900 tracking-tight">Cetak Barcode</h1>
        <p className="text-slate-500 text-xs font-medium font-outfit hidden sm:block">Input detail produksi untuk menerbitkan label QR Code unik.</p>
      </div>

      <QRGenerator 
        products={products} 
        suppliers={suppliers}
        supplier={supplier || { name: "System Admin" }}
        userRole={role}
        defaultInspector={session.user?.name} 
      />
    </div>
  )
}
