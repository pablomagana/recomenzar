import { ref, computed, onMounted, onUnmounted } from 'vue'
import { isBeforeLimit, getTimeUntilLimit } from '@/services/timeUtils'

export function useTimeRestrictions() {
  const reportLimit = import.meta.env.VITE_HORA_LIMITE_REPORTE || '23:00'
  const scheduleLimit = import.meta.env.VITE_HORA_LIMITE_HORARIO || '23:59'
  const challengeResetTime = import.meta.env.VITE_HORA_REINICIO_RETOS || '08:00'

  const currentTime = ref(new Date())
  let intervalId: ReturnType<typeof setInterval> | null = null

  const canSubmitReport = computed(() => isBeforeLimit(reportLimit))
  const canRegisterSchedule = computed(() => isBeforeLimit(scheduleLimit))

  const timeUntilReportLimit = computed(() => getTimeUntilLimit(reportLimit))
  const timeUntilScheduleLimit = computed(() => getTimeUntilLimit(scheduleLimit))

  const reportLimitWarning = computed(() => {
    const time = timeUntilReportLimit.value
    if (!time) return null
    if (time.hours === 0 && time.minutes <= 60) {
      return `Quedan ${time.minutes} minutos para el límite`
    }
    if (time.hours <= 2) {
      return `Quedan ${time.hours}h ${time.minutes}min para el límite`
    }
    return null
  })

  const scheduleLimitWarning = computed(() => {
    const time = timeUntilScheduleLimit.value
    if (!time) return null
    if (time.hours === 0 && time.minutes <= 30) {
      return `Quedan ${time.minutes} minutos para registrar`
    }
    return null
  })

  function startTimer(): void {
    intervalId = setInterval(() => {
      currentTime.value = new Date()
    }, 60000) // Update every minute
  }

  function stopTimer(): void {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  function formatLimitTime(limit: string): string {
    return limit
  }

  onMounted(() => {
    startTimer()
  })

  onUnmounted(() => {
    stopTimer()
  })

  return {
    reportLimit,
    scheduleLimit,
    challengeResetTime,
    currentTime,
    canSubmitReport,
    canRegisterSchedule,
    timeUntilReportLimit,
    timeUntilScheduleLimit,
    reportLimitWarning,
    scheduleLimitWarning,
    formatLimitTime
  }
}
