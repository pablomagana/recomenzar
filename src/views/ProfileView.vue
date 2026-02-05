<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '@/components/common/AppHeader.vue'
import UserAvatar from '@/components/profile/UserAvatar.vue'
import ProfileInfo from '@/components/profile/ProfileInfo.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'
import { useReportsStore } from '@/stores/reports'

const router = useRouter()
const authStore = useAuthStore()
const userStore = useUserStore()
const reportsStore = useReportsStore()

const user = computed(() => authStore.user)
const fullName = computed(() => userStore.fullName)
const isLoading = computed(() => userStore.isLoading)

onMounted(async () => {
  try {
    await userStore.fetchProfile()
    await reportsStore.fetchReports({}, 1)
  } catch (error) {
    console.error('Error loading profile data:', error)
  }
})

async function handleAvatarChange(file: Blob): Promise<void> {
  try {
    await userStore.uploadAvatar(file)
  } catch (error) {
    console.error('Error uploading avatar:', error)
  }
}

async function handleLogout(): Promise<void> {
  await authStore.logout()
  router.push('/login')
}

const stats = computed(() => {
  const reports = reportsStore.reports
  const totalReports = reports.length
  const presentedReports = reports.filter(r => r.presentado).length

  return {
    totalReports,
    presentedReports,
    streak: calculateStreak(reports)
  }
})

function calculateStreak(reports: typeof reportsStore.reports): number {
  if (reports.length === 0) return 0

  const sortedReports = [...reports]
    .filter(r => r.presentado)
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())

  let streak = 0
  let currentDate = new Date()
  currentDate.setHours(0, 0, 0, 0)

  for (const report of sortedReports) {
    const reportDate = new Date(report.fecha)
    reportDate.setHours(0, 0, 0, 0)

    const diffDays = Math.floor((currentDate.getTime() - reportDate.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === streak || diffDays === streak + 1) {
      streak++
      currentDate = reportDate
    } else {
      break
    }
  }

  return streak
}
</script>

<template>
  <div class="profile-view">
    <AppHeader title="PERFIL" />

    <div class="page-container">
      <div v-if="isLoading && !user" class="loading-container">
        <LoadingSpinner size="large" />
      </div>

      <template v-else-if="user">
        <div class="profile-header">
          <UserAvatar
            :avatar-url="user.avatarUrl"
            :name="fullName"
            :editable="true"
            @change="handleAvatarChange"
          />
          <div class="profile-name">
            <h2>{{ user.nombre }}</h2>
            <p>{{ user.apellidos }}</p>
          </div>
        </div>

        <div class="profile-stats card">
          <div class="stat-item">
            <span class="stat-value">{{ stats.streak }}</span>
            <span class="stat-label">Días de racha</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-value">{{ stats.presentedReports }}</span>
            <span class="stat-label">Reportes presentados</span>
          </div>
        </div>

        <div class="profile-details card">
          <ProfileInfo :user="user" />
        </div>

        <button class="btn-secondary logout-btn" @click="handleLogout">
          Cerrar sesión
        </button>
      </template>
    </div>
  </div>
</template>

<style scoped>
.profile-view {
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

.profile-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
}

.profile-name h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #424242;
}

.profile-name p {
  margin: 0.25rem 0 0;
  color: #6B7280;
}

.profile-stats {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 0 1rem 1rem;
  padding: 1.25rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #2E7D32;
}

.stat-label {
  font-size: 0.75rem;
  color: #6B7280;
  text-transform: uppercase;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background-color: #E5E7EB;
}

.profile-details {
  margin: 0 1rem 1rem;
}

.logout-btn {
  margin: 1rem;
  background-color: #FEE2E2;
  color: #DC2626;
}
</style>
