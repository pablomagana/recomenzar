import apiClient from './client'
import type { User, AdminCreateUserRequest, AdminUpdateUserRequest, DashboardEntry } from '@/types'

export const adminApi = {
  async getUsers(): Promise<User[]> {
    const response = await apiClient.get<User[]>('/admin/users')
    return response.data
  },

  async getUser(id: string): Promise<User> {
    const response = await apiClient.get<User>(`/admin/users/${id}`)
    return response.data
  },

  async createUser(data: AdminCreateUserRequest): Promise<User> {
    const response = await apiClient.post<User>('/admin/users', data)
    return response.data
  },

  async updateUser(id: string, data: AdminUpdateUserRequest): Promise<User> {
    const response = await apiClient.put<User>(`/admin/users/${id}`, data)
    return response.data
  },

  async deleteUser(id: string): Promise<void> {
    await apiClient.delete(`/admin/users/${id}`)
  },

  async getDashboard(): Promise<DashboardEntry[]> {
    const response = await apiClient.get<DashboardEntry[]>('/admin/dashboard')
    return response.data
  }
}
