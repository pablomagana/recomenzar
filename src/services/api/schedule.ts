import apiClient from './client'
import type { DailySchedule, CreateScheduleRequest, ScheduleCorrection } from '@/types'

export const scheduleApi = {
  async getTomorrowSchedule(): Promise<DailySchedule | null> {
    try {
      const response = await apiClient.get<DailySchedule>('/schedules/tomorrow')
      return response.data
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status: number } }
        if (axiosError.response?.status === 404) {
          return null
        }
      }
      throw error
    }
  },

  async createSchedule(data: CreateScheduleRequest): Promise<DailySchedule> {
    const payload = {
      registradoPara: data.fecha,
      entries: data.entries
    }
    const response = await apiClient.post<DailySchedule>('/schedules', payload)
    return response.data
  },

  async updateCorrections(scheduleId: string, corrections: ScheduleCorrection[]): Promise<DailySchedule> {
    const response = await apiClient.put<DailySchedule>(
      `/schedules/${scheduleId}/corrections`,
      { corrections }
    )
    return response.data
  }
}
