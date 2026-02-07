<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAdminStore } from '@/stores/admin'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import DashboardUserCard from '@/components/admin/DashboardUserCard.vue'

const adminStore = useAdminStore()

const isLoading = computed(() => adminStore.isLoading)
const error = computed(() => adminStore.error)
const dashboard = computed(() => adminStore.dashboard)

const totalAlerts = computed(() => {
  return dashboard.value.reduce((acc, entry) => acc + entry.alerts.length, 0)
})

const usersWithAlerts = computed(() => {
  return dashboard.value.filter(entry => entry.alerts.length > 0).length
})

onMounted(() => {
  adminStore.fetchDashboard()
})
</script>

<template>
  <div class="dashboard-view">
    <div class="dashboard-header">
      <h2 class="view-title">Panel de Control</h2>
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
        <div class="stat-card">
          <span class="stat-number">{{ dashboard.length }}</span>
          <span class="stat-label">Usuarios</span>
        </div>
        <div class="stat-card alerts">
          <span class="stat-number">{{ totalAlerts }}</span>
          <span class="stat-label">Alertas</span>
        </div>
        <div class="stat-card warning">
          <span class="stat-number">{{ usersWithAlerts }}</span>
          <span class="stat-label">Con alertas</span>
        </div>
      </div>

      <div v-if="dashboard.length === 0" class="empty-state">
        <p>No hay usuarios registrados.</p>
      </div>

      <div v-else class="users-list">
        <DashboardUserCard
          v-for="entry in dashboard"
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
  padding: 0.75rem;
  text-align: center;
  border: 1px solid #E5E7EB;
}

.stat-number {
  display: block;
  font-size: 1.5rem;
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
  color: #6B7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
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
