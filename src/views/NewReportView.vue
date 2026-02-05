<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '@/components/common/AppHeader.vue'
import ReportForm from '@/components/reports/ReportForm.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { useReportsStore } from '@/stores/reports'
import { useChallengesStore } from '@/stores/challenges'
import { useTimeRestrictions } from '@/composables/useTimeRestrictions'
import type { CreateReportRequest } from '@/types'

const router = useRouter()
const reportsStore = useReportsStore()
const challengesStore = useChallengesStore()
const { canSubmitReport, reportLimitWarning, reportLimit } = useTimeRestrictions()

const challenges = computed(() => challengesStore.challenges)
const isLoading = computed(() => reportsStore.isLoading)
const isDisabled = computed(() => !canSubmitReport.value || reportsStore.hasTodayReport)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    await Promise.all([
      challengesStore.fetchChallenges(),
      reportsStore.fetchTodayReport()
    ])

    if (reportsStore.hasTodayReport) {
      router.replace('/tabs/reports')
    }
  } catch (e) {
    console.error('Error loading data:', e)
  }
})

async function handleSubmit(data: CreateReportRequest): Promise<void> {
  if (!canSubmitReport.value) {
    error.value = 'Se ha pasado la hora límite para enviar el reporte'
    return
  }

  error.value = null

  try {
    await reportsStore.createReport(data)
    router.replace('/tabs/reports')
  } catch (e) {
    error.value = 'Error al enviar el reporte. Intenta de nuevo.'
    console.error('Error creating report:', e)
  }
}
</script>

<template>
  <div class="new-report-view">
    <AppHeader title="NUEVO REPORTE" :show-back="true" />

    <div class="page-container">
      <div v-if="isLoading && challenges.length === 0" class="loading-container">
        <LoadingSpinner size="large" />
      </div>

      <div v-else class="report-content">
        <div v-if="reportLimitWarning" class="time-warning">
          ⚠️ {{ reportLimitWarning }}
        </div>

        <div v-if="isDisabled && !reportsStore.hasTodayReport" class="blocked-notice">
          <p>No puedes enviar el reporte porque se ha pasado la hora límite ({{ reportLimit }}).</p>
        </div>

        <div v-if="error" class="error-notice">
          {{ error }}
        </div>

        <ReportForm
          :challenges="challenges"
          :is-loading="isLoading"
          :disabled="isDisabled"
          @submit="handleSubmit"
        />

        <div class="limit-notice">
          ⚠️ Límite: {{ reportLimit }} h
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.new-report-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem;
}

.report-content {
  padding: 1rem;
}

.time-warning {
  padding: 0.75rem;
  background-color: #FEF3C7;
  border-radius: 0.5rem;
  color: #92400E;
  font-size: 0.875rem;
  text-align: center;
  margin-bottom: 1rem;
}

.blocked-notice {
  padding: 1rem;
  background-color: #FEE2E2;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.blocked-notice p {
  margin: 0;
  color: #DC2626;
  text-align: center;
}

.error-notice {
  padding: 0.75rem;
  background-color: #FEE2E2;
  border-radius: 0.5rem;
  color: #DC2626;
  font-size: 0.875rem;
  text-align: center;
  margin-bottom: 1rem;
}

.limit-notice {
  text-align: center;
  padding: 1rem;
  color: #6B7280;
  font-size: 0.875rem;
}
</style>
