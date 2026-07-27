import { createContext, useContext, useEffect, useState } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadCurrentUser = async () => {
    const token = window.localStorage.getItem('trendlens-access-token')
    if (!token) {
      setLoading(false)
      return
    }
    try {
      const { data } = await api.get('/auth/me')
      setUser(data)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCurrentUser()
  }, [])

  const storeTokens = ({ access_token, refresh_token }) => {
    window.localStorage.setItem('trendlens-access-token', access_token)
    window.localStorage.setItem('trendlens-refresh-token', refresh_token)
  }

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    storeTokens(data)
    await loadCurrentUser()
  }

  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password })
    storeTokens(data)
    await loadCurrentUser()
  }

  const logout = () => {
    window.localStorage.removeItem('trendlens-access-token')
    window.localStorage.removeItem('trendlens-refresh-token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
