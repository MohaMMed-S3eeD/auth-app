import NextAuth from "next-auth"
import { prisma } from "@/utils/prisma"
import { PrismaAdapter } from "@auth/prisma-adapter"
import authConfig from "./auth.config"
// import GitHub from "next-auth/providers/github"
// import Google from "next-auth/providers/google"

export const { handlers, auth, signIn, signOut } = NextAuth({
    callbacks: {
        async jwt({ token, user }) {
            console.log("jwt", token, "user", user)
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.sub as string
            }
            return session
        }
    },
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    ...authConfig,
})