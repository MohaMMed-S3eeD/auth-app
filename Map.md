# 🔐 خريطة طريق نظام المصادقة الشامل
### دليل خطوة بخطوة لبناء نظام مصادقة متكامل مع Next.js

---

## 📋 نظرة عامة على المشروع

هذا المشروع عبارة عن نظام مصادقة شامل مبني باستخدام:
- **Next.js 15** مع TypeScript
- **NextAuth.js v5** للمصادقة
- **Prisma ORM** لقاعدة البيانات
- **Tailwind CSS** للتصميم
- **Resend** لإرسال الإيميلات
- **Bcrypt** لتشفير كلمات المرور

---

## 🎯 الميزات المتوفرة

✅ تسجيل حساب جديد  
✅ تسجيل الدخول  
✅ تحقق من البريد الإلكتروني  
✅ مصادقة اجتماعية (GitHub, Google)  
✅ حماية الصفحات  
✅ إدارة الجلسات  
✅ صفحة الملف الشخصي  
✅ تسجيل الخروج  

---

## 🚀 البدء من الصفر

### 1. ⚡ إعداد المشروع الأساسي

```bash
# إنشاء مشروع Next.js جديد
npx create-next-app@latest auth-app --typescript --tailwind --eslint --app

# الانتقال لمجلد المشروع
cd auth-app
```

### 2. 📦 تثبيت الحزم المطلوبة

```bash
# حزم المصادقة الأساسية
npm install next-auth@beta @auth/prisma-adapter

# حزم قاعدة البيانات
npm install prisma @prisma/client

# حزم إضافية
npm install bcryptjs resend zod sonner
npm install @types/bcryptjs --save-dev

# حزم UI (اختيارية)
npm install lucide-react @tailwindcss/forms
```

### 3. 🗄️ إعداد قاعدة البيانات مع Prisma

```bash
# تهيئة Prisma
npx prisma init
```

#### إعداد `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"  // أو postgresql حسب احتياجك
  url      = env("DATABASE_URL")
}

model Account {
  id                String  @id @default(cuid())
  userId            String  @map("user_id")
  type              String
  provider          String
  providerAccountId String  @map("provider_account_id")
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique @map("session_token")
  userId       String   @map("user_id")
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model User {
  id            String     @id @default(cuid())
  name          String?
  email         String     @unique
  emailVerified DateTime?  @map("email_verified")
  image         String?
  password      String?
  role          Role       @default(USER)
  accounts      Account[]
  sessions      Session[]

  @@map("users")
}

model VerificationToken {
  id      String   @id @default(cuid())
  email   String
  token   String   @unique
  expires DateTime

  @@unique([email, token])
  @@map("verification_tokens")
}

enum Role {
  USER
  ADMIN
}
```

```bash
# تطبيق التغييرات على قاعدة البيانات
npx prisma migrate dev --name initial_migration
npx prisma generate
```

---

## 🔧 إعداد المصادقة

### 4. 🔐 إنشاء ملفات المصادقة

#### `src/auth.config.ts`:
```typescript
import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { loginSchema } from "@/utils/validationSchemas"
import { prisma } from "@/utils/prisma"
import bcrypt from "bcryptjs"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"

export default {
    providers: [
        Credentials({
            async authorize(credentials) {
                const validation = loginSchema.safeParse(credentials)
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
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET
        }),
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })
    ],
} satisfies NextAuthConfig
```

#### `src/auth.ts`:
```typescript
import NextAuth from "next-auth"
import { prisma } from "@/utils/prisma"
import { PrismaAdapter } from "@auth/prisma-adapter"
import authConfig from "./auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
    callbacks: {
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.sub as string
                const user = await prisma.user.findUnique({
                    where: { id: token.sub as string },
                    select: { emailVerified: true, role: true }
                })
                session.user.emailVerified = user?.emailVerified ?? null
                session.user.role = user?.role ?? "USER"
            }
            return session
        },
        async signIn({ user, account }) {
            if (account?.provider !== "credentials") return true
            const userDB = await prisma.user.findUnique({
                where: { id: user.id }
            })
            if (!userDB || !userDB.emailVerified) return false
            return true
        }
    },
    events: {
        async linkAccount({ user }) {
            await prisma.user.update({
                where: { id: user.id },
                data: { emailVerified: new Date() }
            })
        }
    },
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    ...authConfig,
})
```

### 5. 🔗 إعداد API Route

#### `src/app/api/auth/[...nextauth]/route.ts`:
```typescript
import { handlers } from "@/auth"
export const { GET, POST } = handlers
```

---

## 🛠️ الأدوات المساعدة

### 6. 📁 إنشاء ملفات الأدوات

#### `src/utils/prisma.ts`:
```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

#### `src/utils/validationSchemas.ts`:
```typescript
import { z } from "zod"

export const loginSchema = z.object({
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters")
})

export const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
})
```

#### `src/utils/generateToken.ts`:
```typescript
import { v4 as uuidv4 } from "uuid"
import { prisma } from "./prisma"

export const generateVerificationToken = async (email: string) => {
    const token = uuidv4()
    const expires = new Date(new Date().getTime() + 3600 * 1000) // ساعة واحدة

    const existingToken = await prisma.verificationToken.findFirst({
        where: { email }
    })

    if (existingToken) {
        await prisma.verificationToken.delete({
            where: { id: existingToken.id }
        })
    }

    const verificationToken = await prisma.verificationToken.create({
        data: { email, token, expires }
    })

    return verificationToken
}
```

#### `src/utils/mail.ts`:
```typescript
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendEmail = async (email: string, token: string) => {
    const confirmLink = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`
    
    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "تأكيد البريد الإلكتروني",
        html: `
            <h1>أهلاً وسهلاً!</h1>
            <p>اضغط على الرابط أدناه لتأكيد بريدك الإلكتروني:</p>
            <a href="${confirmLink}">تأكيد البريد الإلكتروني</a>
        `
    })
}
```

---

## 🎬 Actions و Server Functions

### 7. ⚙️ إنشاء Server Actions

#### `src/app/actions/auth.action.ts`:
```typescript
"use server"
import { prisma } from "@/utils/prisma"
import { loginSchema, registerSchema } from "@/utils/validationSchemas"
import { z } from "zod"
import * as bcrypt from "bcryptjs"
import { signIn, signOut } from "@/auth"
import { AuthError } from "next-auth"
import { generateVerificationToken } from "@/utils/generateToken"
import { sendEmail } from "@/utils/mail"

export const loginAction = async (data: z.infer<typeof loginSchema>) => {
    const validation = loginSchema.safeParse(data)
    if (!validation.success) {
        return { success: false, error: validation.error.issues[0].message }
    }

    const { email, password } = validation.data
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user || !user.email || !user.password) {
        return { success: false, error: "البريد الإلكتروني غير مسجل" }
    }

    if (!user.emailVerified) {
        const vToken = await generateVerificationToken(email)
        sendEmail(email, vToken.token)
        return { 
            success: false, 
            error: "البريد الإلكتروني غير مؤكد، تحقق من بريدك الإلكتروني" 
        }
    }

    try {
        await signIn("credentials", { email, password, redirectTo: "/profile" })
    } catch (error) {
        if (error instanceof Error && error.message === "NEXT_REDIRECT") {
            throw error
        }
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { success: false, error: "بيانات تسجيل الدخول غير صحيحة" }
                default:
                    return { success: false, error: `خطأ: ${error.message}` }
            }
        }
        return { success: false, error: `خطأ غير متوقع: ${error}` }
    }
    return { success: true, message: "تم تسجيل الدخول بنجاح" }
}

export const registerAction = async (data: z.infer<typeof registerSchema>) => {
    const validation = registerSchema.safeParse(data)
    if (!validation.success) {
        return { success: false, error: validation.error.issues[0].message }
    }

    const { name, email, password } = validation.data
    const userCheck = await prisma.user.findUnique({ where: { email } })
    
    if (userCheck) {
        return { success: false, error: "المستخدم موجود بالفعل" }
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    await prisma.user.create({
        data: { name, email, password: hashedPassword }
    })

    const vToken = await generateVerificationToken(email)
    sendEmail(email, vToken.token)

    return { 
        success: true, 
        message: "تم إنشاء الحساب، تحقق من بريدك الإلكتروني للتأكيد" 
    }
}

export const logoutAction = async () => {
    await signOut()
}
```

#### `src/app/actions/verification.action.ts`:
```typescript
"use server"
import { prisma } from "@/utils/prisma"

export const verifyEmailAction = async (token: string) => {
    try {
        const vToken = await prisma.verificationToken.findUnique({
            where: { token }
        })
        
        if (!vToken) {
            return { success: false, error: "رمز التحقق غير صالح" }
        }

        const isExpired = vToken.expires < new Date()
        if (isExpired) {
            return { success: false, error: "انتهت صلاحية رمز التحقق" }
        }

        const user = await prisma.user.findUnique({
            where: { email: vToken.email }
        })
        
        if (!user) {
            return { success: false, error: "المستخدم غير موجود" }
        }

        await prisma.user.update({
            where: { email: vToken.email },
            data: { emailVerified: new Date() }
        })

        await prisma.verificationToken.delete({
            where: { id: vToken.id }
        })

        return { success: true, message: "تم تأكيد البريد الإلكتروني بنجاح" }
    } catch (error) {
        console.log(error)
        return { success: false, error: "خطأ في الخادم" }
    }
}
```

---

## 🎨 إنشاء واجهة المستخدم

### 8. 🏠 الصفحة الرئيسية

#### `src/app/page.tsx`:
```typescript
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
            SecureAuth
          </h1>
          <p className="text-lg md:text-xl text-gray-600">
            نظام مصادقة آمن وبسيط
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/register"
            className="w-full sm:w-auto px-8 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200"
          >
            إنشاء حساب
          </Link>

          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 hover:border-gray-400 transition-colors duration-200"
          >
            تسجيل الدخول
          </Link>
        </div>
      </div>
    </div>
  )
}
```

### 9. 📝 صفحات المصادقة

#### `src/app/(auth)/login/page.tsx`:
```typescript
import React from "react"
import LoginForm from "./LoginForm"
import Link from "next/link"

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            أهلاً بعودتك
          </h1>
          <p className="text-gray-600">سجل دخولك لحسابك</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <LoginForm />
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              ليس لديك حساب؟{" "}
              <Link
                href="/register"
                className="text-gray-900 font-medium hover:underline"
              >
                إنشاء حساب
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
```

#### `src/app/(auth)/login/LoginForm.tsx`:
```typescript
"use client"
import Spinner from "@/app/_components/spinner"
import { loginAction } from "@/app/actions/auth.action"
import SocialProviders from "@/components/SocialProviders"
import React, { useState } from "react"
import { toast } from "sonner"

const LoginForm = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    loginAction({ email, password }).then((res) => {
      if (!res.success) {
        setIsLoading(false)
        toast.error(res.error)
      } else {
        setIsLoading(false)
        toast.success(res.message)
      }
    })
  }

  return (
    <div className="space-y-6">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            البريد الإلكتروني
          </label>
          <input
            type="email"
            id="email"
            placeholder="أدخل بريدك الإلكتروني"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            كلمة المرور
          </label>
          <input
            type="password"
            id="password"
            placeholder="أدخل كلمة المرور"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
        >
          {isLoading ? <Spinner /> : "تسجيل الدخول"}
        </button>
      </form>
      
      <SocialProviders />
    </div>
  )
}

export default LoginForm
```

### 10. 🔗 Social Providers Component

#### `src/components/SocialProviders.tsx`:
```typescript
"use client"
import { signIn } from "next-auth/react"
import React from "react"

const SocialProviders = () => {
  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">أو</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => signIn("github", { callbackUrl: "/profile" })}
          className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
          </svg>
          <span className="ml-2">GitHub</span>
        </button>

        <button
          onClick={() => signIn("google", { callbackUrl: "/profile" })}
          className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span className="ml-2">Google</span>
        </button>
      </div>
    </div>
  )
}

export default SocialProviders
```

---

## 🛡️ حماية الصفحات

### 11. 🔒 إعداد Middleware

#### `src/middleware.ts`:
```typescript
import { NextResponse } from "next/server"
import NextAuth from "next-auth"
import authConfig from "./auth.config"

const authRoutes = ["/login", "/register"]
const protectedRoutes = ["/profile"]

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
    matcher: ["/login", "/register", "/profile"],
}
```

---

## ⚙️ متغيرات البيئة

### 12. 🔐 إعداد ملف `.env.local`

```env
# قاعدة البيانات
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# GitHub OAuth
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Resend (لإرسال الإيميلات)
RESEND_API_KEY="your-resend-api-key"
```

---

## 🚀 تشغيل المشروع

### 13. ▶️ الأوامر النهائية

```bash
# تطبيق قاعدة البيانات
npx prisma migrate dev
npx prisma generate

# تشغيل المشروع
npm run dev
```

---

## 📚 مصادر مفيدة

### 🔗 روابط مهمة

- [NextAuth.js Documentation](https://authjs.dev/)
- [Prisma Documentation](https://prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/)
- [Resend Documentation](https://resend.com/docs)

### 🎯 نصائح للتطوير

1. **اختبر كل ميزة**: تأكد من عمل كل جزء قبل الانتقال للتالي
2. **احم API Keys**: لا تنشر مفاتيح API في الكود
3. **استخدم TypeScript**: يساعد في تجنب الأخطاء
4. **اتبع best practices**: للأمان والأداء

---

## 🎉 تهانينا!

لقد أكملت بناء نظام مصادقة شامل! 🚀

الآن يمكنك:
- ✅ تسجيل المستخدمين الجدد
- ✅ تسجيل الدخول والخروج
- ✅ التحقق من البريد الإلكتروني
- ✅ استخدام المصادقة الاجتماعية
- ✅ حماية الصفحات الحساسة

---

*تم إنشاء هذا الدليل بواسطة نظام المصادقة المتكامل 💙*
