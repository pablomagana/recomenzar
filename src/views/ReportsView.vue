<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '@/components/common/AppHeader.vue'
import ReportCard from '@/components/reports/ReportCard.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { useReportsStore } from '@/stores/reports'
import { useChallengesStore } from '@/stores/challenges'
import { useTimeRestrictions } from '@/composables/useTimeRestrictions'

const router = useRouter()
const reportsStore = useReportsStore()
const challengesStore = useChallengesStore()
const { canSubmitReport, reportLimitWarning } = useTimeRestrictions()

const latestReport = computed(() => reportsStore.latestReport)
const challenges = computed(() => challengesStore.challenges)
const isLoading = computed(() => reportsStore.isLoading)
const hasTodayReport = computed(() => reportsStore.hasTodayReport)

onMounted(async () => {
  try {
    await Promise.all([
      reportsStore.fetchLatestReport(),
      reportsStore.fetchTodayReport(),
      challengesStore.fetchChallenges()
    ])
  } catch (error) {
    console.error('Error loading reports:', error)
  }
})

function goToNewReport(): void {
  router.push('/new-report')
}

function goToHistory(): void {
  router.push('/report-history')
}
</script>

<template>
  <div class="reports-view">
    <AppHeader title="REGISTROS" />

    <div class="page-container">
      <div class="reports-actions">
        <button class="action-btn" @click="goToHistory">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          Historial
        </button>
        <button
          class="action-btn primary"
          :disabled="hasTodayReport || !canSubmitReport"
          @click="goToNewReport"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Nuevo
        </button>
      </div>

      <div v-if="reportLimitWarning && !hasTodayReport" class="time-warning">
        ⚠️ {{ reportLimitWarning }}
      </div>

      <div v-if="isLoading && !latestReport" class="loading-container">
        <LoadingSpinner size="large" />
      </div>

      <div v-else-if="latestReport" class="report-content">
        <p class="last-report-label">Último reporte:</p>
        <ReportCard :report="latestReport" :challenges="challenges" />
      </div>

      <div v-else class="empty-state">
        <div class="empty-icon">📝</div>
        <h3>Sin reportes aún</h3>
        <p>Aún no has registrado ningún reporte. ¡Empieza hoy!</p>
        <button
          class="btn-primary"
          :disabled="!canSubmitReport"
          @click="goToNewReport"
        >
          Crear mi primer reporte
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.reports-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.reports-actions {
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: white;
  border: 1px solid #E5E7EB;
  color: #424242;
}

.action-btn:hover:not(:disabled) {
  background-color: #F5F5F5;
}

.action-btn.primary {
  background-color: #2E7D32;
  border-color: #2E7D32;
  color: white;
}

.action-btn.primary:hover:not(:disabled) {
  background-color: #256b29;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-btn svg {
  width: 18px;
  height: 18px;
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

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem;
}

.report-content {
  padding: 0 1rem;
}

.last-report-label {
  font-size: 0.875rem;
  color: #6B7280;
  margin-bottom: 0.5rem;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  text-align: center;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  margin: 0;
  color: #424242;
}

.empty-state p {
  color: #6B7280;
  margin: 0.5rem 0 1.5rem;
}
</style>
