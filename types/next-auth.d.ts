import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      emailVerified: Date | null
      role: "USER" | "ADMIN"
    } & DefaultSession["user"]
  }

  interface User {
    emailVerified: Date | null
    role: "USER" | "ADMIN"
  }
} 