"use server"

import prisma from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { nanoid } from "nanoid"

export async function generateItemQR(formData: FormData) {
  const session = await auth()
  if (!session) throw new Error("Unauthorized")

  const productId = formData.get("productId") as string
  const inspector = formData.get("inspector") as string
  const customer = formData.get("customer") as string
  const qtyPerLabel = parseInt(formData.get("qty") as string)
  const totalQty = parseInt(formData.get("totalQty") as string)
  const noLotSpk = formData.get("noLotSpk") as string
  
  const userRole = (session.user as any).userRole || (session.user as any).role
  let supplierId = (session.user as any).supplierId

  if (userRole === "SUPER_ADMIN") {
    const inputSupplierId = formData.get("supplierId") as string
    if (inputSupplierId) supplierId = inputSupplierId
  }

  if (!supplierId) throw new Error("Supplier not linked. Admins must select a supplier.")

  const product = await prisma.product.findUnique({ where: { id: productId } })
  if (!product) throw new Error("Product not found")

  const dateCode = new Date().toISOString().slice(0, 10).replace(/-/g, "") // YYYYMMDD
  const labelsNeeded = Math.ceil(totalQty / qtyPerLabel)
  
  // Construct barcode as requested: PartNumber Qty NoLotSpk
  // We use the standard qtyPerLabel for the main barcode reference
  const barcode = `${product.partNumber} ${qtyPerLabel} ${noLotSpk}`
  
  const item = await prisma.item.create({
    data: {
      barcode,
      productId,
      supplierId,
      inspector,
      customer,
      qty: qtyPerLabel,
      totalQty,
      labelCount: labelsNeeded,
      noLotSpk,
      stock: totalQty,
    },
    include: {
      product: {
        include: { partSet: true }
      }
    }
  })

  // Enforce 20 record limit per supplier (Rotating Log)
  const currentTotal = await prisma.item.count({ where: { supplierId } })
  if (currentTotal > 20) {
    const itemsToDelete = await prisma.item.findMany({
      where: { supplierId },
      orderBy: { createdAt: 'asc' },
      take: currentTotal - 20,
      select: { id: true }
    })
    
    if (itemsToDelete.length > 0) {
      await prisma.item.deleteMany({
        where: { id: { in: itemsToDelete.map(it => it.id) } }
      })
    }
  }

  revalidatePath("/dashboard/history")
  return [item]
}

export async function deleteItem(id: string) {
  const session = await auth()
  if (!session) throw new Error("Unauthorized")

  const role = (session.user as any).role
  const supplierId = (session.user as any).supplierId

  // Verify ownership — supplier can only delete their own items
  const item = await prisma.item.findUnique({ where: { id } })
  if (!item) throw new Error("Item not found")

  if (role !== "SUPER_ADMIN" && item.supplierId !== supplierId) {
    throw new Error("Forbidden")
  }

  await prisma.item.delete({ where: { id } })
  revalidatePath("/dashboard/history")
  revalidatePath("/dashboard")
}
