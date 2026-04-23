import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        supplierCode: { label: "Supplier Code", type: "text" },
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
          include: { supplier: true },
        })

        if (!user || !user.password) return null

        // Check Supplier Code for non-admins
        if (user.role !== "SUPER_ADMIN") {
          if (!credentials.supplierCode || user.supplier?.code !== credentials.supplierCode) {
            return null
          }
        }

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!isValid) return null

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          supplierId: user.supplierId,
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          userRole: (user as any).role,
          supplierId: (user as any).supplierId
        }
      }
      return token
    },
    session({ session, token }) {
      if (session.user && token) {
        return {
          ...session,
          user: {
            ...session.user,
            role: (token as any).userRole,
            supplierId: (token as any).supplierId
          }
        }
      }
      return session
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard")
      
      if (isOnDashboard) {
        if (isLoggedIn) return true
        return false // Redirect to login
      } else if (isLoggedIn && nextUrl.pathname === "/login") {
        return Response.redirect(new URL("/dashboard", nextUrl))
      }
      return true
    },
  },
})
