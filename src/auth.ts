export type UserLogin = 'root' | 'user'

export interface AuthUser {
  login: UserLogin
  displayName: string
}

interface DemoUser {
  login: UserLogin
  password: string
  displayName: string
}

const AUTH_KEY = 'current_user_v1'

const USERS: DemoUser[] = [
  {
    login: 'root',
    password: 'root',
    displayName: 'Root',
  },
  {
    login: 'user',
    password: 'user123',
    displayName: 'User',
  },
]

export function loginUser(login: string, password: string): AuthUser | null {
  const normalizedLogin = login.trim().toLowerCase()

  const found = USERS.find(user =>
    user.login === normalizedLogin &&
    user.password === password,
  )

  if (!found) return null

  const authUser: AuthUser = {
    login: found.login,
    displayName: found.displayName,
  }

  localStorage.setItem(AUTH_KEY, JSON.stringify(authUser))

  return authUser
}

export function getCurrentUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw) as AuthUser

    if (parsed.login !== 'root' && parsed.login !== 'user') {
      localStorage.removeItem(AUTH_KEY)
      return null
    }

    return parsed
  } catch {
    localStorage.removeItem(AUTH_KEY)
    return null
  }
}

export function logoutUser() {
  localStorage.removeItem(AUTH_KEY)
}