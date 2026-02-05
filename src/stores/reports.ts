import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { DailyReport, CreateReportRequest, ReportFilters, PaginatedReports } from '@/types'
import { reportsApi } from '@/services/api/reports'
import { isSameDay } from '@/services/timeUtils'
import { cancelTodayReminders } from '@/services/notifications'

export const useReportsStore = defineStore('reports', () => {
  const todayReport = ref<DailyReport | null>(null)
  const latestReport = ref<DailyReport | null>(null)
  const reports = ref<DailyReport[]>([])
  const pagination = ref({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0
  })
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const hasTodayReport = computed(() => {
    if (!todayReport.value) return false
    return isSameDay(todayReport.value.fecha, new Date())
  })

  async function fetchTodayReport(): Promise<DailyReport | null> {
    isLoading.value = true
    error.value = null
    try {
      todayReport.value = await reportsApi.getTodayReport()
      return todayReport.value
    } catch (e) {
      error.value = 'Error al cargar el reporte de hoy'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function fetchLatestReport(): Promise<DailyReport | null> {
    isLoading.value = true
    error.value = null
    try {
      latestReport.value = await reportsApi.getLatestReport()
      return latestReport.value
    } catch (e) {
      error.value = 'Error al cargar el último reporte'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function createReport(data: CreateReportRequest): Promise<DailyReport> {
    isLoading.value = true
    error.value = null
    try {
      const report = await reportsApi.createReport(data)
      todayReport.value = report
      latestReport.value = report

      // Cancel today's reminders since report was submitted
      await cancelTodayReminders()

      return report
    } catch (e) {
      error.value = 'Error al crear el reporte'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function fetchReports(filters: ReportFilters = {}, page = 1): Promise<PaginatedReports> {
    isLoading.value = true
    error.value = null
    try {
      const result = await reportsApi.getReports(filters, page, pagination.value.limit)

      if (page === 1) {
        reports.value = result.data
      } else {
        reports.value = [...reports.value, ...result.data]
      }

      pagination.value = {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages
      }

      return result
    } catch (e) {
      error.value = 'Error al cargar los reportes'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  function clearReports(): void {
    reports.value = []
    pagination.value = {
      total: 0,
      page: 1,
      limit: 20,
      totalPages: 0
    }
  }

  return {
    todayReport,
    latestReport,
    reports,
    pagination,
    isLoading,
    error,
    hasTodayReport,
    fetchTodayReport,
    fetchLatestReport,
    createReport,
    fetchReports,
    clearReports
  }
})
