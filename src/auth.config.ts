import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { loginSchema } from "@/utils/validationSchmas"
import { prisma } from "@/utils/prisma"
import bcrypt from "bcryptjs"

// Notice this is only an object, not a full Auth.js instance
export default {
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
} satisfies NextAuthConfig