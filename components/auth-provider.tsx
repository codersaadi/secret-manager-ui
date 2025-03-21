"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"

interface AuthContextType {
  token: string | null
  expiry: Date | null
  isAuthenticated: boolean
  login: (token: string, expiry: Date) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  expiry: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
})
// WARNING NOTE:  HERE WE ARE USING LOCAL STORAGE BUT IN A REAL WORLD USECASE , you should use real authentication/authorization
export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [expiry, setExpiry] = useState<Date | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check for token in localStorage on initial load
    // WARNING NOTE:  HERE WE ARE USING LOCAL STORAGE BUT IN A REAL WORLD USECASE , you should use real authentication/authorization
    const storedToken = localStorage.getItem("auth_token")
    const storedExpiry = localStorage.getItem("auth_expiry")

    if (storedToken && storedExpiry) {
      const expiryDate = new Date(storedExpiry)

      // Check if token is expired
      if (expiryDate > new Date()) {
        setToken(storedToken)
        setExpiry(expiryDate)
        setIsAuthenticated(true)
      } else {
        // Clear expired token
        localStorage.removeItem("auth_token")
        localStorage.removeItem("auth_expiry")
      }
    }
  }, [])

  // Redirect based on auth state
  useEffect(() => {
    // If on dashboard pages and not authenticated, redirect to login
    if (pathname?.startsWith("/dashboard") && !isAuthenticated) {
      router.push("/")
    }

    // If on login page and authenticated, redirect to dashboard
    if (pathname === "/" && isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, pathname, router])

  const login = (newToken: string, expiryDate: Date) => {
    setToken(newToken)
    setExpiry(expiryDate)
    setIsAuthenticated(true)

    // Store in localStorage
    localStorage.setItem("auth_token", newToken)
    localStorage.setItem("auth_expiry", expiryDate.toISOString())
  }

  const logout = () => {
    setToken(null)
    setExpiry(null)
    setIsAuthenticated(false)

    // Clear from localStorage
    localStorage.removeItem("auth_token")
    localStorage.removeItem("auth_expiry")

    router.push("/")
  }

  return (
    <AuthContext.Provider value={{ token, expiry, isAuthenticated, login, logout }}>{children}</AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

