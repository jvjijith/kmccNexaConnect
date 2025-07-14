"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { startTokenMonitoring, stopTokenMonitoring, onTokenExpiration, isUserLoggedIn } from '../lib/auth'

/**
 * Hook to handle automatic logout on token expiration
 * This should be used in the main app component or layout
 */
export function useAutoLogout() {
  const router = useRouter()

  useEffect(() => {
    let unsubscribe: (() => void) | null = null

    const initializeAuth = async () => {
      // Check if user is logged in
      const loggedIn = await isUserLoggedIn()
      
      if (loggedIn) {
        // Start monitoring token expiration
        startTokenMonitoring()

        // Set up callback for token expiration
        unsubscribe = onTokenExpiration(() => {
          console.log('Token expired, redirecting to login...')
          // Show a notification or toast here if needed
          router.push('/login')
        })
      }
    }

    initializeAuth()

    // Cleanup on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
      stopTokenMonitoring()
    }
  }, [router])
}

/**
 * Hook to check if user is authenticated and handle token expiration
 * This can be used in protected components
 */
export function useAuthCheck() {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const loggedIn = await isUserLoggedIn()
      if (!loggedIn) {
        router.push('/login')
      }
    }

    checkAuth()
  }, [router])
}