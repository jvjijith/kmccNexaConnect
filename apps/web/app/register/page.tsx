"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import RegisterPageUI from "@repo/ui/register"
import { registerUser } from "../../src/lib/auth"

// Constants for localStorage keys - matching auth.ts
const STORAGE_KEYS = {
  IS_LOGGED_IN: "isLoggedIn",
  USER_DATA: "userData", 
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  USER_ID: "userId",
  LAST_LOGIN: "lastLogin"
} as const

export default function Page() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [phone, setPhone] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Clear localStorage on component mount to ensure fresh registration
  useEffect(() => {
    // Clear all auth-related localStorage items on register page load
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key)
    })
  }, [])

  const validateForm = () => {
    if (!firstName.trim()) {
      setError("First name is required")
      return false
    }
    if (!lastName.trim()) {
      setError("Last name is required")
      return false
    }
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
    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      return false
    }
    if (!phone.trim()) {
      setError("Phone number is required")
      return false
    }
    if (!/^\+?[\d\s\-\(\)]{10,}$/.test(phone.replace(/\s/g, ''))) {
      setError("Please enter a valid phone number")
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
      // Clear localStorage before registration attempt
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key)
      })

      console.log('Starting registration process...')
      await registerUser(firstName, lastName, email, password, phone)
      console.log('Registration successful, tokens should be stored in localStorage')
      
      // Redirect to home on success
      router.push("/home")
    } catch (err: any) {
      console.error("Registration error in component:", err)
      setError(err.message || "Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const toggleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  return (
    <RegisterPageUI
      firstName={firstName}
      setFirstName={setFirstName}
      lastName={lastName}
      setLastName={setLastName}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      phone={phone}
      setPhone={setPhone}
      showPassword={showPassword}
      toggleShowPassword={toggleShowPassword}
      loading={loading}
      error={error}
      handleSubmit={handleSubmit}
    />
  )
}