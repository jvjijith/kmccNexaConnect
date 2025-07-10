"use client"

// Force dynamic rendering to prevent build timeouts
export const dynamic = 'force-dynamic'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { signIn, useSession, SessionProvider } from "next-auth/react"
import LoginPageUI from "@repo/ui/login"

// Constants for localStorage keys - matching auth.ts
const STORAGE_KEYS = {
  IS_LOGGED_IN: "isLoggedIn",
  USER_DATA: "userData",
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  USER_ID: "userId",
  LAST_LOGIN: "lastLogin"
} as const

function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { data: session, status } = useSession()

  // Clear localStorage on component mount to ensure fresh login
  useEffect(() => {
    // Clear all auth-related localStorage items on login page load
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key)
    })
  }, [])

  // Handle session changes after successful authentication
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      // Store session data in localStorage
      const authObj = {
        accessToken: session.accessToken || '',
        refreshToken: session.refreshToken || '',
        email: session.user.email || '',
        uid: session.user.id || '',
        id: session.user.id || '',
        name: session.user.name || '',
        lastLogin: new Date().toISOString()
      }

      // Store in localStorage
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(authObj))
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, session.accessToken || '')
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, session.refreshToken || '')
      localStorage.setItem(STORAGE_KEYS.USER_ID, session.user.id || '')
      localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, "true")
      localStorage.setItem(STORAGE_KEYS.LAST_LOGIN, new Date().toISOString())

      console.log("Login successful, tokens stored in localStorage")

      // Trigger auth state change event for NavBar
      window.dispatchEvent(new Event('authStateChanged'))

      // Navigate to home page
      router.push("/home")
    }
  }, [session, status, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Clear localStorage before new login attempt
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key)
      })

      // Sign in using NextAuth
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false
      })

      if (result?.error) {
        throw new Error(result.error)
      }

      if (!result?.ok) {
        throw new Error("Login failed")
      }

      // Session handling is done in useEffect above
      console.log("SignIn successful, waiting for session...")

    } catch (error: any) {
      console.error("Login error:", error)
      setError('Login failed. Please check your credentials.')
      setLoading(false)
    }
    // Don't set loading to false here - let the useEffect handle it when session is ready
  }

  const toggleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  return (
    <LoginPageUI
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      showPassword={showPassword}
      toggleShowPassword={toggleShowPassword}
      loading={loading}
      error={error}
      handleSubmit={handleSubmit}
    />
  )
}

export default function LoginPage() {
  return (
    <SessionProvider>
      <LoginForm />
    </SessionProvider>
  )
}