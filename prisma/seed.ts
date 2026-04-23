import prisma from "../src/lib/prisma"
import bcrypt from "bcryptjs"

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10)
  
  const user = await prisma.user.create({
    data: {
      email: "admin@example.com",
      name: "Admin User",
      password: hashedPassword,
    },
  })

  console.log({ user })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
