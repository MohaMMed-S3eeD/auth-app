"use server";
import { prisma } from "@/utils/prisma";
import { loginSchema } from "@/utils/validationSchmas";
import { registerSchema } from "@/utils/validationSchmas";
import { z } from "zod";
import * as bcrypt from "bcryptjs";



export const loginAction = async (data: z.infer<typeof loginSchema>) => {
    const validation = loginSchema.safeParse(data);

    if (!validation.success) {
        return {
            success: false,
            error: validation.error.issues[0].message
        }
    }
    return {
        success: true,
        message: "Login successful"
    }
};
export const registerAction = async (data: z.infer<typeof registerSchema>) => {
    const validation = registerSchema.safeParse(data);

    if (!validation.success) {
        return {
            success: false,
            error: validation.error.issues[0].message
        }
    }
    const { name, email, password } = validation.data;
    const userCheck = await prisma.user.findUnique({
        where: {
            email: email
        }
    })
    if (userCheck) {
        return {
            success: false,
            error: "User already exists"
        }
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await prisma.user.create({
        data: {
            name: name,
            email: email,
            password: hashedPassword
        }
    })
    console.log(user)
    return {    
        success: true,
        message: "create account successful"
    }
};