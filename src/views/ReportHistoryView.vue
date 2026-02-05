<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AppHeader from '@/components/common/AppHeader.vue'
import ReportFilters from '@/components/reports/ReportFilters.vue'
import ReportListItem from '@/components/reports/ReportListItem.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { useReportsStore } from '@/stores/reports'
import type { ReportFilters as ReportFiltersType } from '@/types'

const reportsStore = useReportsStore()

const filters = ref<ReportFiltersType>({})
const showFilters = ref(true)

const reports = computed(() => reportsStore.reports)
const pagination = computed(() => reportsStore.pagination)
const isLoading = computed(() => reportsStore.isLoading)
const hasMore = computed(() => pagination.value.page < pagination.value.totalPages)

onMounted(async () => {
  await loadReports()
})

async function loadReports(): Promise<void> {
  reportsStore.clearReports()
  try {
    await reportsStore.fetchReports(filters.value, 1)
  } catch (error) {
    console.error('Error loading reports:', error)
  }
}

async function loadMore(): Promise<void> {
  if (isLoading.value || !hasMore.value) return

  try {
    await reportsStore.fetchReports(filters.value, pagination.value.page + 1)
  } catch (error) {
    console.error('Error loading more reports:', error)
  }
}

function applyFilters(): void {
  loadReports()
}

function toggleFilters(): void {
  showFilters.value = !showFilters.value
}
</script>

<template>
  <div class="report-history-view">
    <AppHeader
      title="HISTORIAL"
      :show-back="true"
      :right-action="{ label: showFilters ? 'Ocultar' : 'Filtros', emit: 'toggleFilters' }"
      @action="toggleFilters"
    />

    <div class="page-container">
      <Transition name="slide">
        <ReportFilters
          v-if="showFilters"
          v-model="filters"
          @apply="applyFilters"
        />
      </Transition>

      <div class="results-header">
        <span v-if="pagination.total > 0">
          Resultados: {{ pagination.total }} reportes
        </span>
      </div>

      <div v-if="isLoading && reports.length === 0" class="loading-container">
        <LoadingSpinner size="large" />
      </div>

      <div v-else-if="reports.length === 0" class="empty-state">
        <p>No se encontraron reportes con los filtros seleccionados.</p>
      </div>

      <div v-else class="reports-list">
        <ReportListItem
          v-for="report in reports"
          :key="report.id"
          :report="report"
        />

        <div v-if="hasMore" class="load-more">
          <button
            class="btn-secondary"
            :disabled="isLoading"
            @click="loadMore"
          >
            <LoadingSpinner v-if="isLoading" size="small" />
            <span v-else>Cargar más</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.report-history-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.results-header {
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: #6B7280;
  border-bottom: 1px solid #E5E7EB;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem;
}

.empty-state {
  text-align: center;
  padding: 3rem 2rem;
  color: #6B7280;
}

.reports-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
}

.load-more {
  display: flex;
  justify-content: center;
  padding: 1rem 0;
}

.load-more .btn-secondary {
  min-width: 150px;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
  max-height: 500px;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
