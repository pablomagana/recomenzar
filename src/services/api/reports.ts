import apiClient from './client'
import type { DailyReport, CreateReportRequest, ReportFilters, PaginatedReports } from '@/types'

export const reportsApi = {
  async getTodayReport(): Promise<DailyReport | null> {
    try {
      const response = await apiClient.get<DailyReport>('/reports/today')
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

  async getLatestReport(): Promise<DailyReport | null> {
    try {
      const response = await apiClient.get<DailyReport>('/reports/latest')
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

  async createReport(data: CreateReportRequest): Promise<DailyReport> {
    const payload = {
      ...data,
      fecha: new Date().toISOString().split('T')[0]
    }
    const response = await apiClient.post<DailyReport>('/reports', payload)
    return response.data
  },

  async getReports(filters: ReportFilters = {}, page = 1, limit = 20): Promise<PaginatedReports> {
    const params = new URLSearchParams()

    if (filters.fechaDesde) params.append('fechaDesde', filters.fechaDesde)
    if (filters.fechaHasta) params.append('fechaHasta', filters.fechaHasta)
    if (filters.estadoAnimo?.length) params.append('estadoAnimo', filters.estadoAnimo.join(','))
    if (filters.horarioCumplido !== undefined) params.append('horarioCumplido', String(filters.horarioCumplido))
    if (filters.llamadasRealizadas !== undefined) params.append('llamadasRealizadas', String(filters.llamadasRealizadas))
    if (filters.retosCumplidos !== undefined) params.append('retosCumplidos', String(filters.retosCumplidos))
    if (filters.presentado !== undefined) params.append('presentado', String(filters.presentado))

    params.append('page', String(page))
    params.append('limit', String(limit))

    const response = await apiClient.get<PaginatedReports>(`/reports?${params.toString()}`)
    return response.data
  }
}
