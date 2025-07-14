"use client"

import { useAutoLogout } from '../../src/hooks/useAuth'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  // Initialize automatic logout on token expiration
  useAutoLogout()

  return <>{children}</>
}