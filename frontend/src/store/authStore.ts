import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { api } from '@/services/api'

interface User {
  id: string
  name: string
  email: string
  role: 'buyer' | 'seller' | 'admin'
  avatarUrl?: string
  store?: { id: string; name: string; slug: string; status: string }
}

interface AuthState {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  setUser: (user: User) => void
}

interface RegisterData {
  name: string
  email: string
  password: string
  phone?: string
  role?: 'buyer' | 'seller'
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      login: async (email, password) => {
        const { data } = await api.post('/api/auth/login', { email, password })
        localStorage.setItem('access_token', data.accessToken)
        localStorage.setItem('refresh_token', data.refreshToken)
        set({ user: data.user, accessToken: data.accessToken, isAuthenticated: true })
      },

      register: async (registerData) => {
        const { data } = await api.post('/api/auth/register', registerData)
        localStorage.setItem('access_token', data.accessToken)
        localStorage.setItem('refresh_token', data.refreshToken)
        set({ user: data.user, accessToken: data.accessToken, isAuthenticated: true })
      },

      logout: () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        set({ user: null, accessToken: null, isAuthenticated: false })
      },

      setUser: (user) => set({ user }),
    }),
    { name: 'parque-auth', partialize: (s) => ({ user: s.user, accessToken: s.accessToken, isAuthenticated: s.isAuthenticated }) }
  )
)
