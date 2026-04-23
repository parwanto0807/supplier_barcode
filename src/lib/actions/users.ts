"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs"
import { Role } from "@prisma/client"

export async function createUser(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const role = formData.get("role") as Role
  const supplierId = formData.get("supplierId") as string

  const hashedPassword = await bcrypt.hash(password, 10)

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
      supplierId: role === "SUPPLIER" ? (supplierId || null) : null,
    },
  })

  revalidatePath("/dashboard/settings")
}

export async function updateUser(id: string, formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const role = formData.get("role") as Role
  const supplierId = formData.get("supplierId") as string
  const password = formData.get("password") as string

  const data: any = { 
    name, 
    email, 
    role,
    supplierId: role === "SUPPLIER" ? (supplierId || null) : null
  }
  
  if (password && password.length > 0) {
    data.password = await bcrypt.hash(password, 10)
  }

  await prisma.user.update({
    where: { id },
    data,
  })

  revalidatePath("/dashboard/settings")
}

export async function deleteUser(id: string) {
  await prisma.user.delete({
    where: { id },
  })

  revalidatePath("/dashboard/settings")
}
