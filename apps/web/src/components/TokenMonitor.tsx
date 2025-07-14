"use client"

import { useEffect } from 'react'
import { initializeTokenMonitoring, onTokenExpiration } from '../lib/auth'
import { useRouter } from 'next/navigation'

export default function TokenMonitor() {
  const router = useRouter()

  useEffect(() => {
    // Initialize token monitoring when the app starts
    initializeTokenMonitoring()

    // Set up callback for token expiration
    const unsubscribe = onTokenExpiration(() => {
      // Redirect to login page when token expires
      console.log('Token expired, redirecting to login...')
      router.push('/login')
    })

    // Cleanup on unmount
    return () => {
      unsubscribe()
    }
  }, [router])

  // This component doesn't render anything
  return null
}