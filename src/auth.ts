import { loginSchema } from '@/utils/validationSchmas';
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/utils/prisma"
import { PrismaAdapter } from "@auth/prisma-adapter"
import bcrypt from 'bcryptjs';

// import GitHub from "next-auth/providers/github"
// import Google from "next-auth/providers/google"

export const { handlers, auth, signIn , signOut} = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    providers: [
        Credentials({
            async authorize(date) {
                const validation = loginSchema.safeParse(date)
                if (validation.success) {
                    const { email, password } = validation.data;
                    const user = await prisma.user.findUnique({ where: { email } })
                    if (!user || !user.password) return null
                    const isPasswordValid = await bcrypt.compare(password, user.password)
                    if (isPasswordValid) return user
                    return null
                }
                return null
            }
        }),

    ],
})