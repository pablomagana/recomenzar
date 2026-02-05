<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AppHeader from '@/components/common/AppHeader.vue'
import ScheduleTable from '@/components/schedule/ScheduleTable.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { useScheduleStore } from '@/stores/schedule'
import { useReportsStore } from '@/stores/reports'
import { useTimeRestrictions } from '@/composables/useTimeRestrictions'
import { formatDate } from '@/services/timeUtils'
import type { ScheduleCorrection } from '@/types'

const scheduleStore = useScheduleStore()
const reportsStore = useReportsStore()
const { canRegisterSchedule, scheduleLimitWarning, scheduleLimit } = useTimeRestrictions()

const schedule = computed(() => scheduleStore.schedule)
const draftEntries = computed(() => scheduleStore.draftEntries)
const isRegistered = computed(() => scheduleStore.isRegistered)
const isLoading = computed(() => scheduleStore.isLoading)
const hasTodayReport = computed(() => reportsStore.hasTodayReport)

const canRegister = computed(() => {
  return canRegisterSchedule.value && hasTodayReport.value && !isRegistered.value
})

const error = ref<string | null>(null)

const displayDate = computed(() => {
  if (schedule.value) {
    return formatDate(schedule.value.fecha)
  }
  return formatDate(scheduleStore.tomorrowDateString)
})

onMounted(async () => {
  try {
    await Promise.all([
      scheduleStore.fetchTomorrowSchedule(),
      reportsStore.fetchTodayReport()
    ])
  } catch (e) {
    console.error('Error loading schedule:', e)
  }
})

function handleUpdateEntry(index: number, field: string, value: string): void {
  if (!isRegistered.value) {
    scheduleStore.updateDraftEntry(index, field as 'hora' | 'accion', value)
  }
}

function handleRemoveEntry(index: number): void {
  scheduleStore.removeDraftEntry(index)
}

function handleAddEntry(): void {
  scheduleStore.addDraftEntry()
}

async function handleRegister(): Promise<void> {
  if (!canRegister.value) return

  error.value = null
  try {
    await scheduleStore.createSchedule()
  } catch (e) {
    error.value = 'Error al registrar el horario'
    console.error('Error registering schedule:', e)
  }
}

async function handleSaveCorrections(): Promise<void> {
  if (!schedule.value) return

  const corrections: ScheduleCorrection[] = schedule.value.entries
    .filter(entry => entry.horaCorreccion || entry.accionCorreccion)
    .map(entry => ({
      entryId: entry.id,
      horaCorreccion: entry.horaCorreccion || null,
      accionCorreccion: entry.accionCorreccion || null
    }))

  if (corrections.length === 0) return

  error.value = null
  try {
    await scheduleStore.updateCorrections(corrections)
  } catch (e) {
    error.value = 'Error al guardar las correcciones'
    console.error('Error saving corrections:', e)
  }
}

function handleCorrectionUpdate(index: number, field: string, value: string): void {
  if (schedule.value && schedule.value.entries[index]) {
    if (field === 'horaCorreccion') {
      schedule.value.entries[index].horaCorreccion = value || undefined
    } else if (field === 'accionCorreccion') {
      schedule.value.entries[index].accionCorreccion = value || undefined
    }
  }
}
</script>

<template>
  <div class="schedule-view">
    <AppHeader title="HORARIO" />

    <div class="page-container">
      <div class="schedule-header">
        <span class="schedule-date">📅 Horario para: {{ displayDate }}</span>
      </div>

      <div v-if="!hasTodayReport && !isRegistered" class="requirement-notice">
        <p>Debes registrar tu reporte diario antes de poder crear el horario de mañana.</p>
      </div>

      <div v-if="scheduleLimitWarning && !isRegistered" class="time-warning">
        ⚠️ {{ scheduleLimitWarning }}
      </div>

      <div v-if="error" class="error-notice">
        {{ error }}
      </div>

      <div v-if="isLoading && !schedule && draftEntries.length === 0" class="loading-container">
        <LoadingSpinner size="large" />
      </div>

      <div v-else class="schedule-content card">
        <!-- Unregistered mode: editable draft -->
        <template v-if="!isRegistered">
          <ScheduleTable
            :entries="draftEntries"
            :registered="false"
            @update:entry="handleUpdateEntry"
            @remove="handleRemoveEntry"
            @add="handleAddEntry"
          />

          <button
            class="btn-primary w-full mt-4"
            :disabled="!canRegister || isLoading"
            @click="handleRegister"
          >
            <LoadingSpinner v-if="isLoading" size="small" />
            <span v-else>Registrar Horario</span>
          </button>
        </template>

        <!-- Registered mode: readonly original + editable corrections -->
        <template v-else-if="schedule">
          <ScheduleTable
            :entries="schedule.entries"
            :registered="true"
            @update:entry="handleCorrectionUpdate"
          />

          <button
            class="btn-primary w-full mt-4"
            :disabled="isLoading"
            @click="handleSaveCorrections"
          >
            <LoadingSpinner v-if="isLoading" size="small" />
            <span v-else>Registrar Corrección</span>
          </button>
        </template>
      </div>

      <div class="limit-notice">
        <span>Límite de registro: {{ scheduleLimit }} h</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.schedule-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.schedule-header {
  padding: 1rem;
}

.schedule-date {
  font-size: 0.875rem;
  color: #6B7280;
}

.requirement-notice {
  margin: 0 1rem 1rem;
  padding: 1rem;
  background-color: #FEF3C7;
  border-radius: 0.5rem;
}

.requirement-notice p {
  margin: 0;
  color: #92400E;
  font-size: 0.875rem;
}

.time-warning {
  margin: 0 1rem 1rem;
  padding: 0.75rem;
  background-color: #FEF3C7;
  border-radius: 0.5rem;
  color: #92400E;
  font-size: 0.875rem;
  text-align: center;
}

.error-notice {
  margin: 0 1rem 1rem;
  padding: 0.75rem;
  background-color: #FEE2E2;
  border-radius: 0.5rem;
  color: #DC2626;
  font-size: 0.875rem;
  text-align: center;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem;
}

.schedule-content {
  margin: 0 1rem;
}

.mt-4 {
  margin-top: 1rem;
}

.limit-notice {
  text-align: center;
  padding: 1rem;
  color: #6B7280;
  font-size: 0.875rem;
}
</style>
