"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createSupplier(formData: FormData) {
  const name = formData.get("name") as string
  const code = formData.get("code") as string
  const address = formData.get("address") as string
  const phone = formData.get("phone") as string

  await prisma.supplier.create({
    data: {
      name,
      code,
      address,
      phone,
    },
  })

  revalidatePath("/dashboard/suppliers")
}

export async function updateSupplier(id: string, formData: FormData) {
  const name = formData.get("name") as string
  const code = formData.get("code") as string
  const address = formData.get("address") as string
  const phone = formData.get("phone") as string

  await prisma.supplier.update({
    where: { id },
    data: {
      name,
      code,
      address,
      phone,
    },
  })

  revalidatePath("/dashboard/suppliers")
}

export async function deleteSupplier(id: string) {
  await prisma.supplier.delete({
    where: { id },
  })

  revalidatePath("/dashboard/suppliers")
}
