import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { LoginRequest, RegisterRequest } from '@/types'

export function useAuth() {
  const router = useRouter()
  const authStore = useAuthStore()

  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const isLoading = computed(() => authStore.isLoading)
  const user = computed(() => authStore.user)

  async function login(credentials: LoginRequest): Promise<void> {
    await authStore.login(credentials)
    router.push('/tabs/profile')
  }

  async function register(data: RegisterRequest): Promise<void> {
    await authStore.register(data)
    router.push('/tabs/profile')
  }

  async function logout(): Promise<void> {
    await authStore.logout()
    router.push('/login')
  }

  return {
    isAuthenticated,
    isLoading,
    user,
    login,
    register,
    logout
  }
}
