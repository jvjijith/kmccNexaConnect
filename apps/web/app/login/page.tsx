"use client"

// Force dynamic rendering to prevent build timeouts
export const dynamic = 'force-dynamic'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import LoginPageUI from "@repo/ui/login"
import { loginUser, sendPasswordReset } from "../../src/lib/auth" // Import sendPasswordReset function

// Constants for localStorage keys - matching auth.ts
const STORAGE_KEYS = {
  IS_LOGGED_IN: "isLoggedIn",
  USER_DATA: "userData",
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  USER_ID: "userId",
  LAST_LOGIN: "lastLogin"
} as const

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Clear localStorage on component mount to ensure fresh login
  useEffect(() => {
    // Clear all auth-related localStorage items on login page load
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key)
    })
  }, [])

  const validateForm = () => {
    if (!email.trim()) {
      setError("Email is required")
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address")
      return false
    }
    if (!password) {
      setError("Password is required")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Clear localStorage before login attempt
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key)
      })

      console.log('Starting login process...')
      await loginUser(email, password) // Use your custom loginUser function
      console.log('Login successful, tokens should be stored in localStorage')

      // Trigger auth state change event for NavBar
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('authStateChanged'))
      }

      // Redirect to home on success
      router.push("/home")
    } catch (err: any) {
      console.error("Login error in component:", err)
      setError(err.message || "Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const toggleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleForgotPassword = async (email: string) => {
    try {
      await sendPasswordReset(email)
    } catch (error) {
      throw error // Re-throw to let the UI component handle the error display
    }
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
      onForgotPassword={handleForgotPassword}
    />
  )
}