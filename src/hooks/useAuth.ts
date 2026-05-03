import { useCallback, useState } from 'react'
import {
  AuthUser,
  getCurrentUser,
  loginUser,
  logoutUser,
} from '../auth'

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(() => getCurrentUser())
  const [error, setError] = useState<string | null>(null)

  const login = useCallback((loginValue: string, passwordValue: string) => {
    const nextUser = loginUser(loginValue, passwordValue)

    if (!nextUser) {
      setError('Неверный логин или пароль')
      return false
    }

    setUser(nextUser)
    setError(null)

    return true
  }, [])

  const logout = useCallback(() => {
    logoutUser()
    setUser(null)
    setError(null)
  }, [])

  return {
    user,
    error,
    login,
    logout,
  }
}