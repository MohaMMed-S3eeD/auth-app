"use server"
import { generateResetPasswordToken } from "@/utils/generateToken";
import { sendResetPasswordEmail } from "@/utils/mail";
import { prisma } from "@/utils/prisma";
import { forgotPasswordSchema, resetPasswordSchema } from "@/utils/validationSchmas";
import bcrypt from "bcryptjs";
import { z } from "zod";



export const forgotPasswordAction = async (data: z.infer<typeof forgotPasswordSchema>) => {
    try {
        const validation = forgotPasswordSchema.safeParse(data);
        if (!validation.success) {
            return {
                success: false,
                error: validation.error.message
            }
        }
        const user = await prisma.user.findUnique({
            where: {
                email: data.email
            }
        })
        if (!user) {
            return {
                success: false,
                error: "User not found"
            }
        }

        const token = await generateResetPasswordToken(data.email);
        sendResetPasswordEmail(data.email, token.token);
        return {
            success: true,
            message: "Reset password email sent successfully"
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            error: "Internal server error"
        }
    }
}

export const resetPasswordAction = async (data: z.infer<typeof resetPasswordSchema>, token: string) => {
    try {
        const validation = resetPasswordSchema.safeParse(data);
        if (!validation.success) {
            return {
                success: false,
                error: JSON.parse(validation.error.message)[0].message
            }
        }
        const { newPassword } = validation.data;
        const resetPasswordToken = await prisma.resetPasswordToken.findUnique({
            where: {
                token: token
            }
        })
        if (!resetPasswordToken) {
            return {
                success: false,
                error: "Invalid token"
            }
        }

        if (resetPasswordToken.expires < new Date()) {
            return {
                success: false,
                error: "Token expired"
            }
        }
        const user = await prisma.user.findUnique({
            where: {
                email: resetPasswordToken.email
            }
        })
        if (!user) {
            return {
                success: false,
                error: "User not found"
            }
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        await prisma.user.update({
            where: {
                email: resetPasswordToken.email
            },
            data: {
                password: hashedPassword
            }
        })
        await prisma.resetPasswordToken.delete({
            where: {
                id: resetPasswordToken.id
            }
        })
        return {
            success: true,
            message: "Password reset successfully"
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            error: "Internal server error"
        }
    }
}