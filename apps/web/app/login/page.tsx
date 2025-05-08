"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn, useSession, SessionProvider } from "next-auth/react"
import LoginPageUI from "@repo/ui/login"

// Constants for localStorage keys
const STORAGE_KEYS = {
  USER: "user",
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  IS_LOGGED_IN: "isLoggedIn"
}

function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { data: session } = useSession()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Sign in using NextAuth
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false
      })

      if (result?.error) {
        throw new Error(result.error)
      }

      if (result?.ok && session?.user) {
        // Store session data in localStorage
        const authObj = {
          accessToken: session.accessToken || '',
          refreshToken: session.refreshToken || '',
          email: session.user.email || '',
          uid: session.user.id,
          id: session.user.id
        }

        // Store in localStorage
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(authObj))
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, session.accessToken || '')
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, session.refreshToken || '')
        localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, "true")

        // Navigate to home page
        router.push("/home")
      }
    } catch (error: any) {
      console.error("Login error:", error)
      setError('Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
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