
import { NextResponse } from "next/server"
import NextAuth from "next-auth"
import authConfig from "./auth.config"
const authRoutes = ["/login", "/register"]
const protectedRoutes = ["/profile", "/"]

export const { auth: middleware } = NextAuth(authConfig)


export default middleware((req) => {

    const { nextUrl } = req
    const path = nextUrl.pathname
    const isLoggedIn: boolean = Boolean(req.auth)
    if (authRoutes.includes(path) && isLoggedIn) {
        return NextResponse.redirect(new URL("/profile", req.url))
    }
    if (protectedRoutes.includes(path) && !isLoggedIn) {
        return NextResponse.redirect(new URL("/login", req.url))
    }
})

export const config = {
    matcher: ["/login", "/register", "/profile", "/"],
}