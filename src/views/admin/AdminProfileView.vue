<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import UserAvatar from '@/components/profile/UserAvatar.vue'
import ProfileInfo from '@/components/profile/ProfileInfo.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const authStore = useAuthStore()
const userStore = useUserStore()

const user = computed(() => authStore.user)
const fullName = computed(() => userStore.fullName)
const isLoading = computed(() => userStore.isLoading)

const showPasswordForm = ref(false)
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const passwordError = ref('')
const passwordSuccess = ref('')
const isChangingPassword = ref(false)

onMounted(async () => {
  try {
    await userStore.fetchProfile()
  } catch (error) {
    console.error('Error loading profile:', error)
  }
})

async function handleAvatarChange(file: Blob): Promise<void> {
  try {
    await userStore.uploadAvatar(file)
  } catch (error) {
    console.error('Error uploading avatar:', error)
  }
}

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

async function handleLogout(): Promise<void> {
  await authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="admin-profile">
    <div class="profile-top">
      <button class="back-btn" @click="router.back()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Volver
      </button>
      <h1 class="page-title">Mi Perfil</h1>
    </div>

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

      <div class="profile-card">
        <ProfileInfo :user="user" />
      </div>

      <div class="profile-card">
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

      <button class="logout-btn" @click="handleLogout">
        Cerrar sesión
      </button>
    </template>
  </div>
</template>

<style scoped>
.admin-profile {
  max-width: 600px;
  margin: 0 auto;
}

.profile-top {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: none;
  border: none;
  color: #2E7D32;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0.25rem;
}

.page-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #424242;
  margin: 0;
}

.loading-container {
  display: flex;
  justify-content: center;
  padding: 4rem;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1rem 0;
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

.profile-card {
  background-color: #E8F5E9;
  border-radius: 0.75rem;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
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

.logout-btn {
  width: 100%;
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: none;
  background-color: #FEE2E2;
  color: #DC2626;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  margin-top: 0.5rem;
}
</style>
