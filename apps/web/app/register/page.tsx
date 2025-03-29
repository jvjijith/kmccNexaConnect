"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import RegisterPageUI from "@repo/ui/register"
import { registerUser } from "../../src/lib/auth"

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await registerUser(firstName, lastName, email, password, phone)
      router.push("/home") // Redirect to home on success
    } catch (err) {
      setError("Registration failed. Please try again.")
      console.error("Registration error:", err)
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