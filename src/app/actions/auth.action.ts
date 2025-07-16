"use server";
import { prisma } from "@/utils/prisma";
import { loginSchema } from "@/utils/validationSchmas";
import { registerSchema } from "@/utils/validationSchmas";
import { z } from "zod";
import * as bcrypt from "bcryptjs";
import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { generateVerificationToken } from "@/utils/generateToken";
import { sendEmail } from "@/utils/mail";



export const loginAction = async (data: z.infer<typeof loginSchema>) => {
    // validate the data
    const validation = loginSchema.safeParse(data);
    if (!validation.success) {
        return {
            success: false,
            error: validation.error.issues[0].message
        }
    }
    const { email, password } = validation.data;
    // check if the Email is verified
    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    })
    if (!user || !user.email || !user.password) {
        return {
            success: false,
            error: "Email is not by credentials"
        }
    }
    if (!user.emailVerified) {
        // generate the verification token
        const vToken = await generateVerificationToken(email);
        console.log(vToken)
        // send the verification email
        sendEmail(email, vToken.token)


        return {
            success: false,
            error: "Email is not verified, please check your email for verification"
        }
    }

    try {
        // sign in the user
        await signIn("credentials", { email, password, redirectTo: "/profile" })
    } catch (error) {
        // if the error is NEXT_REDIRECT, it means the login was successful and the user will be redirected
        if (error instanceof Error && error.message === "NEXT_REDIRECT") {
            throw error; // throw the error to allow the redirect
        }
        // if the error is an AuthError, it means the login was not successful
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

export const logoutAction = async () => {
    await signOut()
}

export const registerAction = async (data: z.infer<typeof registerSchema>) => {
    // validate the data
    const validation = registerSchema.safeParse(data);

    if (!validation.success) {
        return {
            success: false,
            error: validation.error.issues[0].message
        }
    }
    const { name, email, password } = validation.data;
    // check if the user already exists
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
    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // create the user
    await prisma.user.create({
        data: {
            name: name,
            email: email,
            password: hashedPassword
        }
    })
    // generate the verification token
    const vToken = await generateVerificationToken(email);
    console.log(vToken)
    // send the verification email

    //Todo : Send Email
    sendEmail(email, vToken.token)

    // return the success message
    return {
        success: true,
        message: "Please check your email for verification"
    }
};