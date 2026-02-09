<script setup lang="ts">
import { computed } from 'vue'
import { useAdminStore } from '@/stores/admin'
import AlertBadge from '@/components/admin/AlertBadge.vue'

const adminStore = useAdminStore()

const usersWithAlerts = computed(() => {
  return adminStore.dashboard
    .filter(entry => entry.alerts.length > 0)
    .sort((a, b) => {
      const aRead = adminStore.isAlertReadForUser(a.user.id) ? 1 : 0
      const bRead = adminStore.isAlertReadForUser(b.user.id) ? 1 : 0
      if (aRead !== bRead) return aRead - bRead
      return b.alerts.length - a.alerts.length
    })
})

const unreadCount = computed(() => {
  return usersWithAlerts.value.filter(e => !adminStore.isAlertReadForUser(e.user.id)).length
})

const totalWithAlerts = computed(() => usersWithAlerts.value.length)

function toggleRead(userId: string) {
  adminStore.toggleAlertRead(userId)
}
</script>

<template>
  <div class="alertas-view">
    <div class="alertas-header">
      <h2 class="view-title">Alertas</h2>
      <p class="view-subtitle">{{ unreadCount }} sin revisar de {{ totalWithAlerts }} con alertas</p>
    </div>

    <div v-if="usersWithAlerts.length === 0" class="empty-state">
      <p>No hay alertas hoy.</p>
    </div>

    <div v-else class="alerts-list">
      <div
        v-for="entry in usersWithAlerts"
        :key="entry.user.id"
        class="alert-item"
        :class="{ read: adminStore.isAlertReadForUser(entry.user.id) }"
      >
        <div class="alert-item-left">
          <div class="avatar">
            <img v-if="entry.user.avatarUrl" :src="entry.user.avatarUrl" :alt="entry.user.nombre" />
            <span v-else class="initials">{{ entry.user.nombre[0] }}{{ entry.user.apellidos[0] }}</span>
          </div>
          <div class="alert-item-info">
            <h3 class="alert-user-name">{{ entry.user.nombre }} {{ entry.user.apellidos }}</h3>
            <div class="alert-badges">
              <AlertBadge v-for="alert in entry.alerts" :key="alert" :type="alert" />
            </div>
          </div>
        </div>
        <button class="check-btn" :class="{ checked: adminStore.isAlertReadForUser(entry.user.id) }" @click="toggleRead(entry.user.id)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16">
            <path d="M5 13l4 4L19 7" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.alertas-view {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.alertas-header {
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

.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.alert-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  border-radius: 0.5rem;
  border: 1px solid #E5E7EB;
  border-left: 3px solid #DC2626;
  padding: 0.75rem 1rem;
  transition: opacity 0.2s ease;
}

.alert-item.read {
  opacity: 0.55;
  border-left-color: #9CA3AF;
}

.alert-item-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
  flex: 1;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #E8F5E9;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.initials {
  color: #2E7D32;
  font-weight: 600;
  font-size: 0.8rem;
}

.alert-item-info {
  min-width: 0;
  flex: 1;
}

.alert-user-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: #424242;
  margin: 0 0 0.35rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.alert-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.check-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid #D1D5DB;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  margin-left: 0.5rem;
  color: #D1D5DB;
  transition: all 0.2s ease;
}

.check-btn.checked {
  background-color: #2E7D32;
  border-color: #2E7D32;
  color: white;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #9CA3AF;
}
</style>
