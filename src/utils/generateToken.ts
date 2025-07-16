import { prisma } from "./prisma";
import { randomUUID } from "node:crypto";

export const generateVerificationToken = async (email: string) => {
    const vToken = await prisma.verificationToken.findFirst({ where: { email } });
    if (vToken) {
        await prisma.verificationToken.delete({ where: { id: vToken.id } });
    }
    const newVToken = await prisma.verificationToken.create({
        data: {
            token: randomUUID(),
            email,
            expires: new Date(new Date().getTime() + 3600 * 24 * 2),
        }
    });
    return newVToken;
};

export const generateResetPasswordToken = async (email: string) => {
    const resetToken = await prisma.resetPasswordToken.findFirst({ where: { email } });
    if (resetToken) {
        await prisma.resetPasswordToken.delete({ where: { id: resetToken.id } });
    }
    const newResetToken = await prisma.resetPasswordToken.create({
        data: {
            token: randomUUID(),
            email,
            expires: new Date(new Date().getTime() + 3600 * 24 * 2),
        }
    });
    return newResetToken;
};