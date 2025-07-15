import NextAuth from "next-auth"
import { prisma } from "@/utils/prisma"
import { PrismaAdapter } from "@auth/prisma-adapter"
import authConfig from "./auth.config"
// import GitHub from "next-auth/providers/github"
// import Google from "next-auth/providers/google"
import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      emailVerified: Date | null
      role: "USER" | "ADMIN"
    } & DefaultSession["user"]
  }

  interface User {
    emailVerified: Date | null
    role: "USER" | "ADMIN"
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    callbacks: {
        async jwt({ token, user }) {
            console.log("jwt", token, "user", user)
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.sub as string
                
                // Fetch emailVerified and role from database
                const user = await prisma.user.findUnique({
                    where: { id: token.sub as string },
                    select: { emailVerified: true, role: true }
                })
                session.user.emailVerified = user?.emailVerified ?? null
                session.user.role = user?.role ?? "USER"
            }
            return session
        }
    },
    events: {
        async linkAccount({ user }) {
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    emailVerified: new Date()
                }
            })
        }
    }
    ,
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    ...authConfig,
})