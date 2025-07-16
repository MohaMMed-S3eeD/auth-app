"use server"
import { generateResetPasswordToken } from "@/utils/generateToken";
import { sendResetPasswordEmail } from "@/utils/mail";
import { prisma } from "@/utils/prisma";
import { resetPasswordSchema } from "@/utils/validationSchmas";
import { z } from "zod";



export const resetPasswordAction = async (data: z.infer<typeof resetPasswordSchema>) => {
    try {
        const validation = resetPasswordSchema.safeParse(data);
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