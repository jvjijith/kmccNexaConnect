"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import LoginPageUI from "@repo/ui/login"
import { signInWithEmailAndPassword, getAuth } from "firebase/auth"
import { auth } from "../../src/lib/firebase"
import { login } from "../../src/data/loader"

// Constants for localStorage keys
const STORAGE_KEYS = {
  USER: "user",
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  IS_LOGGED_IN: "isLoggedIn"
}

interface AuthResponse {
  accessToken: string
  refreshToken: string
  id: string
}

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Step 1: Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      const firebaseToken = await user.getIdToken()

      // Step 2: Get backend tokens using the loader's login function
      const loginData = {
        emailId: email
      }

      const customHeaders = {
        "Authorization": `Bearer ${firebaseToken}`
      }

      const tokenResponse = await login(loginData, customHeaders) as AuthResponse

      // Step 3: Store authentication data in localStorage
      const authObj = {
        accessToken: tokenResponse.accessToken,
        refreshToken: tokenResponse.refreshToken,
        email: user.email,
        uid: user.uid,
        id: tokenResponse.id
      }

      // Store in localStorage
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(authObj))
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokenResponse.accessToken)
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokenResponse.refreshToken)
      localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, "true")

      // Step 4: Navigate to home page
      router.push("/")
      
    } catch (error: any) {
      console.error("Login error:", error)
      
      // Handle specific Firebase errors
      if (error.code) {
        const errorMessages: Record<string, string> = {
          'auth/user-not-found': 'No user found with this email',
          'auth/wrong-password': 'Invalid password',
          'auth/invalid-email': 'Invalid email format',
          'auth/user-disabled': 'This account has been disabled'
        }
        setError(errorMessages[error.code] || 'Login failed. Please check your credentials.')
      } else {
        setError('Login failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const toggleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  // Helper function to get stored auth data
  const getStoredAuthData = () => {
    try {
      const userString = localStorage.getItem(STORAGE_KEYS.USER)
      return userString ? JSON.parse(userString) : null
    } catch (error) {
      console.error("Error parsing stored auth data:", error)
      return null
    }
  }

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
    return accessToken ? {
      "Authorization": `Bearer ${accessToken}`
    } : {}
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