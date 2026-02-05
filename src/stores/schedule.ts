import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { DailySchedule, CreateScheduleRequest, ScheduleCorrection, ScheduleEntry } from '@/types'
import { scheduleApi } from '@/services/api/schedule'
import { scheduleActivityNotifications } from '@/services/notifications'
import { formatDateISO, getTomorrowDate } from '@/services/timeUtils'

export const useScheduleStore = defineStore('schedule', () => {
  const schedule = ref<DailySchedule | null>(null)
  const draftEntries = ref<Omit<ScheduleEntry, 'id'>[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isRegistered = computed(() => schedule.value?.registrado ?? false)

  const tomorrowDateString = computed(() => formatDateISO(getTomorrowDate()))

  function initializeDraftEntries(): void {
    if (draftEntries.value.length === 0) {
      draftEntries.value = [
        { hora: '07:00', accion: '' },
        { hora: '08:00', accion: '' },
        { hora: '09:00', accion: '' },
        { hora: '12:00', accion: '' },
        { hora: '14:00', accion: '' },
        { hora: '18:00', accion: '' },
        { hora: '20:00', accion: '' },
        { hora: '22:00', accion: '' }
      ]
    }
  }

  async function fetchTomorrowSchedule(): Promise<DailySchedule | null> {
    isLoading.value = true
    error.value = null
    try {
      schedule.value = await scheduleApi.getTomorrowSchedule()
      if (!schedule.value) {
        initializeDraftEntries()
      }
      return schedule.value
    } catch (e) {
      error.value = 'Error al cargar el horario'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function createSchedule(): Promise<DailySchedule> {
    const validEntries = draftEntries.value.filter(e => e.hora && e.accion.trim())

    if (validEntries.length === 0) {
      throw new Error('Debes agregar al menos una actividad')
    }

    const data: CreateScheduleRequest = {
      fecha: tomorrowDateString.value,
      entries: validEntries.map(e => ({ hora: e.hora, accion: e.accion.trim() }))
    }

    isLoading.value = true
    error.value = null
    try {
      schedule.value = await scheduleApi.createSchedule(data)

      // Schedule notifications for activities
      await scheduleActivityNotifications(schedule.value)

      draftEntries.value = []
      return schedule.value
    } catch (e) {
      error.value = 'Error al registrar el horario'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function updateCorrections(corrections: ScheduleCorrection[]): Promise<DailySchedule> {
    if (!schedule.value) {
      throw new Error('No hay horario para corregir')
    }

    isLoading.value = true
    error.value = null
    try {
      schedule.value = await scheduleApi.updateCorrections(schedule.value.id, corrections)
      return schedule.value
    } catch (e) {
      error.value = 'Error al guardar las correcciones'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  function addDraftEntry(): void {
    draftEntries.value.push({ hora: '', accion: '' })
  }

  function removeDraftEntry(index: number): void {
    draftEntries.value.splice(index, 1)
  }

  function updateDraftEntry(index: number, field: 'hora' | 'accion', value: string): void {
    if (draftEntries.value[index]) {
      draftEntries.value[index][field] = value
    }
  }

  function clearSchedule(): void {
    schedule.value = null
    draftEntries.value = []
  }

  return {
    schedule,
    draftEntries,
    isLoading,
    error,
    isRegistered,
    tomorrowDateString,
    initializeDraftEntries,
    fetchTomorrowSchedule,
    createSchedule,
    updateCorrections,
    addDraftEntry,
    removeDraftEntry,
    updateDraftEntry,
    clearSchedule
  }
})
