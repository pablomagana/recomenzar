<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAdminStore } from '@/stores/admin'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import DashboardUserCard from '@/components/admin/DashboardUserCard.vue'

const adminStore = useAdminStore()

const isLoading = computed(() => adminStore.isLoading)
const error = computed(() => adminStore.error)
const dashboard = computed(() => adminStore.dashboard)

const activeFilter = ref<'all' | 'alerts' | 'noReport'>('all')

const usersWithAlerts = computed(() => {
  return dashboard.value.filter(entry => entry.alerts.length > 0).length
})

const usersWithoutReport = computed(() => {
  return dashboard.value.filter(entry => entry.report === null).length
})

const filteredDashboard = computed(() => {
  if (activeFilter.value === 'alerts') {
    return dashboard.value.filter(entry => entry.alerts.length > 0)
  }
  if (activeFilter.value === 'noReport') {
    return dashboard.value.filter(entry => entry.report === null)
  }
  return dashboard.value
})

function toggleFilter(filter: 'all' | 'alerts' | 'noReport') {
  if (filter === 'all' || activeFilter.value === filter) {
    activeFilter.value = 'all'
  } else {
    activeFilter.value = filter
  }
}
</script>

<template>
  <div class="dashboard-view">
    <div class="dashboard-header">
      <h2 class="view-title">Reportes</h2>
      <p class="view-subtitle">Resumen de reportes de hoy</p>
    </div>

    <div v-if="isLoading && dashboard.length === 0" class="loading-container">
      <LoadingSpinner size="large" />
    </div>

    <div v-else-if="error" class="error-notice">
      {{ error }}
    </div>

    <template v-else>
      <div class="stats-row">
        <button
          class="stat-card"
          :class="{ active: activeFilter === 'all' }"
          @click="toggleFilter('all')"
        >
          <div class="stat-row">
            <span class="stat-number">{{ dashboard.length }}</span>
            <svg class="stat-icon" viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
              <path d="M7 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm7.5 1a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM1.615 16.428A5.5 5.5 0 0 1 7 11h.5a5.49 5.49 0 0 1 3.898 1.616 1 1 0 0 1-.282.395A5.5 5.5 0 0 0 7 17H3a1 1 0 0 1-.982-.822 1 1 0 0 1-.403.25zm14.023-.394A4.5 4.5 0 0 0 14.5 10h-.5a4.48 4.48 0 0 0-2.874 1.04 6.5 6.5 0 0 1 2.878 4.96H17a1 1 0 0 0 .965-.728z"/>
            </svg>
          </div>
          <span class="stat-label">Usuarios</span>
        </button>
        <button
          class="stat-card alerts"
          :class="{ active: activeFilter === 'alerts' }"
          @click="toggleFilter('alerts')"
        >
          <div class="stat-row">
            <span class="stat-number">{{ usersWithAlerts }}</span>
            <svg class="stat-icon" viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
              <path d="M10 2a6 6 0 0 0-6 6v3.586l-.707.707A1 1 0 0 0 4 14h12a1 1 0 0 0 .707-1.707L16 11.586V8a6 6 0 0 0-6-6zM10 18a3 3 0 0 1-2.83-2h5.66A3 3 0 0 1 10 18z"/>
            </svg>
          </div>
          <span class="stat-label">Con alertas</span>
        </button>
        <button
          class="stat-card warning"
          :class="{ active: activeFilter === 'noReport' }"
          @click="toggleFilter('noReport')"
        >
          <div class="stat-row">
            <span class="stat-number">{{ usersWithoutReport }}</span>
            <svg class="stat-icon" viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
              <path d="M10 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-7 9a7 7 0 1 1 14 0H3z"/>
              <path d="M16.5 3a.75.75 0 0 1 .75.75v2a.75.75 0 0 1-1.5 0v-2A.75.75 0 0 1 16.5 3zm0 5.5a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5z"/>
            </svg>
          </div>
          <span class="stat-label">Sin reporte</span>
        </button>
      </div>

      <div v-if="filteredDashboard.length === 0" class="empty-state">
        <p v-if="dashboard.length === 0">No hay usuarios registrados.</p>
        <p v-else>No hay usuarios con este filtro.</p>
      </div>

      <div v-else class="users-list">
        <DashboardUserCard
          v-for="entry in filteredDashboard"
          :key="entry.user.id"
          :entry="entry"
        />
      </div>
    </template>
  </div>
</template>

<style scoped>
.dashboard-view {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.dashboard-header {
  margin-bottom: 0.25rem;
}

.view-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #424242;
  margin: 0;
}

.view-subtitle {
  font-size: 0.8rem;
  color: #9CA3AF;
  margin: 0.25rem 0 0;
}

.loading-container {
  display: flex;
  justify-content: center;
  padding: 3rem 0;
}

.error-notice {
  background-color: #FEE2E2;
  color: #DC2626;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.stat-card {
  background: white;
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  border: 2px solid #E5E7EB;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.15rem;
  overflow: visible;
  cursor: pointer;
  transition: border-color 0.2s, background-color 0.2s;
  font-family: inherit;
  -webkit-tap-highlight-color: transparent;
}

.stat-card.active {
  border-color: #2E7D32;
  background-color: #E8F5E9;
}

.stat-card.alerts.active {
  border-color: #DC2626;
  background-color: #FEE2E2;
}

.stat-card.warning.active {
  border-color: #F59E0B;
  background-color: #FEF3C7;
}

.stat-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
}

.stat-number {
  display: block;
  font-size: 1.25rem;
  font-weight: 700;
  color: #2E7D32;
}

.stat-card.alerts .stat-number {
  color: #DC2626;
}

.stat-card.warning .stat-number {
  color: #F59E0B;
}

.stat-label {
  font-size: 0.7rem;
  font-weight: 500;
  color: #6B7280;
  text-align: center;
}

.stat-icon {
  color: #2E7D32;
  flex-shrink: 0;
}

.stat-card.alerts .stat-icon {
  color: #DC2626;
}

.stat-card.warning .stat-icon {
  color: #F59E0B;
}

.users-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #9CA3AF;
}
</style>
