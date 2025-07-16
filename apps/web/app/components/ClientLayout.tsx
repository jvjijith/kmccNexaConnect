"use client"

import { useAutoLogout } from '../../src/hooks/useAuth'
import { useEffect, useState } from 'react'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  // Initialize automatic logout on token expiration
  useAutoLogout()
  
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Set loaded state after component mounts to prevent layout shift
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100) // Small delay to ensure DOM is ready

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={`layout-container ${isLoaded ? 'fade-in' : ''}`}>
      {children}
    </div>
  )
}