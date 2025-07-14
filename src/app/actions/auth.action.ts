"use server";
import { prisma } from "@/utils/prisma";
import { loginSchema } from "@/utils/validationSchmas";
import { registerSchema } from "@/utils/validationSchmas";
import { z } from "zod";
import * as bcrypt from "bcryptjs";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";



export const loginAction = async (data: z.infer<typeof loginSchema>) => {
    const validation = loginSchema.safeParse(data);

    if (!validation.success) {
        return {
            success: false,
            error: validation.error.issues[0].message
        }
    }
    const { email, password } = validation.data;
    try {
        await signIn("credentials", { email, password, redirectTo: "/profile" })
    } catch (error) {
        // إذا كان الخطأ NEXT_REDIRECT، فهذا يعني نجح تسجيل الدخول وسيتم التوجيه
        if (error instanceof Error && error.message === "NEXT_REDIRECT") {
            throw error; // إعادة رمي الخطأ للسماح بالتوجيه
        }

        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return {
                        success: false,
                        error: "Invalid email or password"
                    }
                default:
                    return {
                        success: false,
                        error: `An error occurred ${error.message}`
                    }
            }
        }
        return {
            success: false,
            error: `An error occurred ${error}`
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