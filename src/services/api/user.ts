import apiClient from './client'
import type { User, ChangePasswordRequest } from '@/types'

export const userApi = {
  async getProfile(): Promise<User> {
    const response = await apiClient.get<User>('/users/me')
    return response.data
  },

  async updateProfile(data: Partial<Pick<User, 'nombre' | 'apellidos' | 'fechaNacimiento'>>): Promise<User> {
    const response = await apiClient.put<User>('/users/me', data)
    return response.data
  },

  async uploadAvatar(file: Blob): Promise<User> {
    const formData = new FormData()
    formData.append('avatar', file)
    const response = await apiClient.post<User>('/users/me/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  async deleteAvatar(): Promise<User> {
    const response = await apiClient.delete<User>('/users/me/avatar')
    return response.data
  },

  async changePassword(data: ChangePasswordRequest): Promise<void> {
    await apiClient.patch('/users/me/password', data)
  }
}
