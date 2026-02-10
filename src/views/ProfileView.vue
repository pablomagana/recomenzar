<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
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

const showPasswordForm = ref(false)
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const passwordError = ref('')
const passwordSuccess = ref('')
const isChangingPassword = ref(false)

function togglePasswordForm() {
  showPasswordForm.value = !showPasswordForm.value
  passwordError.value = ''
  passwordSuccess.value = ''
  currentPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
}

async function handleChangePassword(): Promise<void> {
  passwordError.value = ''
  passwordSuccess.value = ''

  if (newPassword.value.length < 6) {
    passwordError.value = 'La nueva contraseña debe tener al menos 6 caracteres'
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    passwordError.value = 'Las contraseñas no coinciden'
    return
  }

  isChangingPassword.value = true
  try {
    await userStore.changePassword({
      currentPassword: currentPassword.value,
      newPassword: newPassword.value
    })
    passwordSuccess.value = 'Contraseña actualizada correctamente'
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
  } catch {
    passwordError.value = 'La contraseña actual no es correcta'
  } finally {
    isChangingPassword.value = false
  }
}

function goToPrivacyPolicy(): void {
  router.push('/politica-privacidad')
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

        <div class="password-section card">
          <button class="password-toggle-btn" @click="togglePasswordForm">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="20" height="20">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            {{ showPasswordForm ? 'Cancelar' : 'Cambiar contraseña' }}
          </button>

          <form v-if="showPasswordForm" class="password-form" @submit.prevent="handleChangePassword">
            <div class="form-group">
              <label class="input-label">Contraseña actual</label>
              <input
                v-model="currentPassword"
                type="password"
                class="input-field"
                required
              />
            </div>
            <div class="form-group">
              <label class="input-label">Nueva contraseña</label>
              <input
                v-model="newPassword"
                type="password"
                class="input-field"
                minlength="6"
                required
              />
            </div>
            <div class="form-group">
              <label class="input-label">Confirmar nueva contraseña</label>
              <input
                v-model="confirmPassword"
                type="password"
                class="input-field"
                minlength="6"
                required
              />
            </div>

            <p v-if="passwordError" class="msg-error">{{ passwordError }}</p>
            <p v-if="passwordSuccess" class="msg-success">{{ passwordSuccess }}</p>

            <button type="submit" class="btn-primary" :disabled="isChangingPassword">
              {{ isChangingPassword ? 'Guardando...' : 'Guardar contraseña' }}
            </button>
          </form>
        </div>

        <button class="privacy-policy-btn" @click="goToPrivacyPolicy">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="18" height="18">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          Política de Privacidad
        </button>

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

.password-section {
  margin: 0 1rem 1rem;
}

.password-toggle-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #2E7D32;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0.25rem 0;
}

.password-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(46, 125, 50, 0.2);
}

.form-group {
  display: flex;
  flex-direction: column;
}

.msg-error {
  color: #DC2626;
  font-size: 0.85rem;
  margin: 0;
}

.msg-success {
  color: #2E7D32;
  font-size: 0.85rem;
  margin: 0;
}

.privacy-policy-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: calc(100% - 2rem);
  margin: 0 1rem;
  padding: 0.75rem;
  background: none;
  border: 1px solid #E5E7EB;
  border-radius: 0.5rem;
  color: #6B7280;
  font-size: 0.9rem;
  cursor: pointer;
}

.logout-btn {
  margin: 1rem;
  background-color: #FEE2E2;
  color: #DC2626;
}
</style>
