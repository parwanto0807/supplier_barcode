"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { fetchProductsFromExternal, fetchSetNameById } from "@/lib/mysql"

async function getSupplierId(inputSupplierId?: string) {
  const session = await auth()
  const role = (session?.user as any)?.role
  const userSupplierId = (session?.user as any)?.supplierId

  if (role === "SUPER_ADMIN") {
    return inputSupplierId // Admin can specify supplier
  }
  return userSupplierId // Supplier uses their own ID
}

// PART SET ACTIONS
export async function createPartSet(formData: FormData) {
  const nameSet = formData.get("nameSet") as string
  const inputSupplierId = formData.get("supplierId") as string
  const supplierId = await getSupplierId(inputSupplierId)

  if (!supplierId) throw new Error("Supplier ID required")

  await prisma.partSet.create({
    data: { nameSet, supplierId }
  })
  revalidatePath("/dashboard/part-sets")
}

export async function updatePartSet(id: string, formData: FormData) {
  const nameSet = formData.get("nameSet") as string
  await prisma.partSet.update({
    where: { id },
    data: { nameSet }
  })
  revalidatePath("/dashboard/part-sets")
}

export async function deletePartSet(id: string) {
  await prisma.partSet.delete({ where: { id } })
  revalidatePath("/dashboard/part-sets")
}

// PRODUCT ACTIONS
export async function createProduct(formData: FormData) {
  const partNumber = formData.get("partNumber") as string
  const partName = formData.get("partName") as string
  const unit = formData.get("unit") as string
  const partSetId = formData.get("partSetId") as string
  const inputSupplierId = formData.get("supplierId") as string
  const supplierId = await getSupplierId(inputSupplierId)

  if (!supplierId) throw new Error("Supplier ID required")

  await prisma.product.create({
    data: {
      partNumber,
      partName,
      unit,
      partSetId: partSetId || null,
      supplierId,
    }
  })
  revalidatePath("/dashboard/products")
}

export async function updateProduct(id: string, formData: FormData) {
  const partNumber = formData.get("partNumber") as string
  const partName = formData.get("partName") as string
  const unit = formData.get("unit") as string
  const partSetId = formData.get("partSetId") as string

  await prisma.product.update({
    where: { id },
    data: {
      partNumber,
      partName,
      unit,
      partSetId: partSetId || null,
    }
  })
  revalidatePath("/dashboard/products")
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } })
  revalidatePath("/dashboard/products")
}

export async function syncExternalProducts(supplierId: string) {
  if (!supplierId) throw new Error("Supplier ID required")
  
  const externalData = await fetchProductsFromExternal() as any[]
  
  if (!externalData || externalData.length === 0) {
    return { success: false, message: "No data found or connection error" }
  }

  let count = 0
  for (const row of externalData) {
    // Mapping assume: part_number, part_name, unit
    // Use partNumber + supplierId as unique identifier for upsert
    await prisma.product.upsert({
      where: {
        partNumber_supplierId: {
          partNumber: row.part_number || row.PartNumber || row.partNumber,
          supplierId: supplierId
        }
      },
      update: {
        partName: row.part_name || row.PartName || row.partName,
        unit: row.unit || row.Unit || row.unit || "pcs",
      },
      create: {
        partNumber: row.part_number || row.PartNumber || row.partNumber,
        partName: row.part_name || row.PartName || row.partName,
        unit: row.unit || row.Unit || row.unit || "pcs",
        supplierId: supplierId
      }
    })
    count++
  }

  revalidatePath("/dashboard/products")
  return { success: true, message: `Berhasil sinkronisasi ${count} item` }
}

export async function searchExternalProducts(q: string) {
  const data = await fetchProductsFromExternal(q) as any[]
  return data.map(row => ({
    partNumber: row.part || row.part_number || row.PartNumber || row.partNumber,
    partName: row.nama_barang || row.part_name || row.PartName || row.partName,
    unit: row.satuan || row.unit || row.Unit || "pcs",
    setId: row.namaset || null
  }))
}

export async function importSingleProduct(item: any, supplierId: string) {
  if (!supplierId) throw new Error("Supplier ID required")
  
  let partSetId = null

  // Handle PartSet synchronization - Fetch real name from tabel_set first
  if (item.setId) {
    const realSetName = await fetchSetNameById(item.setId)
    
    if (realSetName) {
      const partSet = await prisma.partSet.upsert({
        where: {
          nameSet_supplierId: {
            nameSet: realSetName,
            supplierId: supplierId
          }
        },
        update: {}, 
        create: {
          nameSet: realSetName,
          supplierId: supplierId
        }
      })
      partSetId = partSet.id
    }
  }

  await prisma.product.upsert({
    where: {
      partNumber_supplierId: {
        partNumber: item.partNumber,
        supplierId: supplierId
      }
    },
    update: {
      partName: item.partName,
      unit: item.unit,
      partSetId: partSetId
    },
    create: {
      partNumber: item.partNumber,
      partName: item.partName,
      unit: item.unit,
      supplierId: supplierId,
      partSetId: partSetId
    }
  })
  
  revalidatePath("/dashboard/products")
  return { success: true, message: `Barang ${item.partNumber} berhasil ditambahkan` }
}
