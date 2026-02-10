import apiClient from './client'
import type { Challenge } from '@/types'
import { getMondayOfWeek, formatDateISO } from '@/services/timeUtils'

export const challengesApi = {
  async getChallenges(): Promise<Challenge[]> {
    const response = await apiClient.get<Challenge[]>('/challenges')
    return response.data
  },

  async createChallenge(nombre: string): Promise<Challenge> {
    const weekStartDate = formatDateISO(getMondayOfWeek())
    const response = await apiClient.post<Challenge>('/challenges', { nombre, weekStartDate })
    return response.data
  },

  async deleteChallenge(id: string): Promise<void> {
    await apiClient.delete(`/challenges/${id}`)
  }
}
