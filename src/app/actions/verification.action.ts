"use server"
import { prisma } from "@/utils/prisma"

export const verifyEmailAction = async (token: string) => {
    try {
        const vToken = await prisma.verificationToken.findUnique({
            where: {
                token
            }
        })
        if (!vToken) return {
            success: false,
            error: "Invalid token"
        }
        const isExpired = vToken.expires < new Date()
        if (isExpired) return {
            success: false,
            error: "Token expired"
        }
        const user = await prisma.user.findUnique({
            where: {
                email: vToken.email
            }
        })
        if (!user) return {
            success: false,
            error: "User not found"
        }
        await prisma.user.update({
            where: {
                email: vToken.email
            },
            data: {
                emailVerified: new Date()
            }
        })
        await prisma.verificationToken.delete({
            where: {
                id: vToken.id
            }
        })
        return {
            success: true,
            message: "Email verified successfully"
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            error: "Internal server error"
        }
    }

}