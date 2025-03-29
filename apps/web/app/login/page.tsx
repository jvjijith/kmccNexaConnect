"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import LoginPageUI from "@repo/ui/login"
import { loginUser } from "../../src/lib/auth"


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
      await loginUser(email, password)
      router.push("/")
    } catch (err) {
      setError("Login failed. Please check your credentials.")
      console.error("Login error:", err)
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

