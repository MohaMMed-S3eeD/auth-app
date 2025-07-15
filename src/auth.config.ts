import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { loginSchema } from "@/utils/validationSchmas"
import { prisma } from "@/utils/prisma"
import bcrypt from "bcryptjs"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"

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
        GitHub({
            clientId: process.env.GitHub_CLIENT_ID,
            clientSecret: process.env.GitHup_CLIENT_SECRET
        })
        ,Google({
            clientId: process.env.Google_CLIENT_ID,
            clientSecret: process.env.Google_CLIENT_SECRET
        })

    ],
} satisfies NextAuthConfig