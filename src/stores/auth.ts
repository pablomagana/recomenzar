import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginRequest, RegisterRequest } from '@/types'
import { authApi } from '@/services/api/auth'
import { storage } from '@/services/storage'
import { initializeNotifications, cancelNotificationsByCategory } from '@/services/notifications'

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    // Consider expired if less than 60 seconds remaining
    return payload.exp * 1000 < Date.now() + 60_000
  } catch {
    return true
  }
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const accessToken = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)
  const isLoading = ref(false)
  const isInitialized = ref(false)

  const isAuthenticated = computed(() => !!accessToken.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  async function initialize(): Promise<void> {
    if (isInitialized.value) return

    try {
      isLoading.value = true
      const [storedAccessToken, storedRefreshToken, storedUser] = await Promise.all([
        storage.getAccessToken(),
        storage.getRefreshToken(),
        storage.getUser<User>()
      ])

      if (storedAccessToken && storedRefreshToken && storedUser) {
        accessToken.value = storedAccessToken
        refreshToken.value = storedRefreshToken
        user.value = storedUser

        if (isTokenExpired(storedAccessToken)) {
          try {
            await refreshAccessToken()
          } catch {
            await clearAuthData()
            return
          }
        }

        await initializeNotifications()
      }
    } finally {
      isLoading.value = false
      isInitialized.value = true
    }
  }

  async function login(credentials: LoginRequest): Promise<void> {
    isLoading.value = true
    try {
      const response = await authApi.login(credentials)
      await setAuthData(response.accessToken, response.refreshToken, response.user)
      await initializeNotifications()
    } finally {
      isLoading.value = false
    }
  }

  async function register(data: RegisterRequest): Promise<void> {
    isLoading.value = true
    try {
      const response = await authApi.register(data)
      await setAuthData(response.accessToken, response.refreshToken, response.user)
      await initializeNotifications()
    } finally {
      isLoading.value = false
    }
  }

  async function refreshAccessToken(): Promise<string> {
    if (!refreshToken.value) {
      throw new Error('No refresh token available')
    }

    const response = await authApi.refresh(refreshToken.value)
    await setAuthData(response.accessToken, response.refreshToken, response.user)
    return response.accessToken
  }

  async function logout(): Promise<void> {
    try {
      await authApi.logout()
    } catch {
      // Ignore logout API errors
    } finally {
      await clearAuthData()
    }
  }

  async function setAuthData(newAccessToken: string, newRefreshToken: string, newUser: User): Promise<void> {
    accessToken.value = newAccessToken
    refreshToken.value = newRefreshToken
    user.value = newUser

    await Promise.all([
      storage.setAccessToken(newAccessToken),
      storage.setRefreshToken(newRefreshToken),
      storage.setUser(newUser)
    ])
  }

  async function clearAuthData(): Promise<void> {
    accessToken.value = null
    refreshToken.value = null
    user.value = null
    await storage.clearAuth()
    await cancelNotificationsByCategory('reminder')
    await cancelNotificationsByCategory('schedule')
  }

  function updateUser(updatedUser: User): void {
    user.value = updatedUser
    storage.setUser(updatedUser)
  }

  return {
    user,
    accessToken,
    refreshToken,
    isLoading,
    isInitialized,
    isAuthenticated,
    isAdmin,
    initialize,
    login,
    register,
    refreshAccessToken,
    logout,
    updateUser
  }
})
