import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'
import { userApi } from '@/services/api/user'
import { useAuthStore } from './auth'

export const useUserStore = defineStore('user', () => {
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const authStore = useAuthStore()

  const currentUser = computed(() => authStore.user)

  const fullName = computed(() => {
    if (!currentUser.value) return ''
    return `${currentUser.value.nombre} ${currentUser.value.apellidos}`
  })

  async function fetchProfile(): Promise<User> {
    isLoading.value = true
    error.value = null
    try {
      const user = await userApi.getProfile()
      authStore.updateUser(user)
      return user
    } catch (e) {
      error.value = 'Error al obtener el perfil'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function updateProfile(data: Partial<Pick<User, 'nombre' | 'apellidos' | 'fechaNacimiento'>>): Promise<User> {
    isLoading.value = true
    error.value = null
    try {
      const user = await userApi.updateProfile(data)
      authStore.updateUser(user)
      return user
    } catch (e) {
      error.value = 'Error al actualizar el perfil'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function uploadAvatar(file: Blob): Promise<User> {
    isLoading.value = true
    error.value = null
    try {
      const user = await userApi.uploadAvatar(file)
      authStore.updateUser(user)
      return user
    } catch (e) {
      error.value = 'Error al subir la imagen'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function deleteAvatar(): Promise<User> {
    isLoading.value = true
    error.value = null
    try {
      const user = await userApi.deleteAvatar()
      authStore.updateUser(user)
      return user
    } catch (e) {
      error.value = 'Error al eliminar la imagen'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    error,
    currentUser,
    fullName,
    fetchProfile,
    updateProfile,
    uploadAvatar,
    deleteAvatar
  }
})
