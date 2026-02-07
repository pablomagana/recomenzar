import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User, AdminCreateUserRequest, AdminUpdateUserRequest, DashboardEntry } from '@/types'
import { adminApi } from '@/services/api/admin'

export const useAdminStore = defineStore('admin', () => {
  const users = ref<User[]>([])
  const dashboard = ref<DashboardEntry[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchUsers(): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      users.value = await adminApi.getUsers()
    } catch {
      error.value = 'Error al cargar usuarios'
    } finally {
      isLoading.value = false
    }
  }

  async function createUser(data: AdminCreateUserRequest): Promise<User> {
    isLoading.value = true
    error.value = null
    try {
      const user = await adminApi.createUser(data)
      users.value.unshift(user)
      return user
    } catch {
      error.value = 'Error al crear usuario'
      throw new Error('Error al crear usuario')
    } finally {
      isLoading.value = false
    }
  }

  async function updateUser(id: string, data: AdminUpdateUserRequest): Promise<User> {
    isLoading.value = true
    error.value = null
    try {
      const updated = await adminApi.updateUser(id, data)
      const idx = users.value.findIndex(u => u.id === id)
      if (idx !== -1) users.value[idx] = updated
      return updated
    } catch {
      error.value = 'Error al actualizar usuario'
      throw new Error('Error al actualizar usuario')
    } finally {
      isLoading.value = false
    }
  }

  async function deleteUser(id: string): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      await adminApi.deleteUser(id)
      users.value = users.value.filter(u => u.id !== id)
    } catch {
      error.value = 'Error al eliminar usuario'
      throw new Error('Error al eliminar usuario')
    } finally {
      isLoading.value = false
    }
  }

  async function fetchDashboard(): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      dashboard.value = await adminApi.getDashboard()
    } catch {
      error.value = 'Error al cargar panel de control'
    } finally {
      isLoading.value = false
    }
  }

  return {
    users,
    dashboard,
    isLoading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    fetchDashboard
  }
})
