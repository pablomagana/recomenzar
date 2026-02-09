<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { authApi } from '@/services/api/auth'

const route = useRoute()
const router = useRouter()

const token = computed(() => (route.query.token as string) || '')

const newPassword = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)
const error = ref('')
const success = ref(false)
const tokenError = ref(false)

async function handleSubmit(): Promise<void> {
  error.value = ''

  if (newPassword.value.length < 6) {
    error.value = 'La contraseña debe tener al menos 6 caracteres'
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    error.value = 'Las contraseñas no coinciden'
    return
  }

  isLoading.value = true
  try {
    await authApi.resetPassword({ token: token.value, newPassword: newPassword.value })
    success.value = true
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'response' in err) {
      const axiosError = err as { response?: { status: number } }
      if (axiosError.response?.status === 400 || axiosError.response?.status === 410) {
        tokenError.value = true
        error.value = 'El enlace ha expirado o no es válido.'
        isLoading.value = false
        return
      }
    }
    error.value = 'Error de conexión. Intenta de nuevo.'
  } finally {
    isLoading.value = false
  }
}

function goToLogin(): void {
  router.push('/login')
}

function goToForgotPassword(): void {
  router.push('/forgot-password')
}
</script>

<template>
  <div class="reset-view">
    <div class="reset-header">
      <div class="logo">
        <svg viewBox="0 0 100 100" class="logo-icon">
          <circle cx="50" cy="50" r="45" fill="#E8F5E9" />
          <path d="M30 50 Q50 30 70 50 Q50 70 30 50" fill="#2E7D32" />
          <circle cx="50" cy="50" r="10" fill="#F9A825" />
        </svg>
      </div>
      <h1 class="app-title">reComenzar</h1>
    </div>

    <div class="reset-content">
      <h2 class="section-title">Nueva contraseña</h2>

      <template v-if="success">
        <div class="success-message">
          <svg viewBox="0 0 24 24" class="success-icon" fill="none" stroke="#2E7D32" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <p>Tu contraseña ha sido restablecida correctamente.</p>
        </div>
        <button class="btn-primary" @click="goToLogin">Ir a iniciar sesión</button>
      </template>

      <template v-else-if="tokenError">
        <div class="error-message">
          <svg viewBox="0 0 24 24" class="error-icon" fill="none" stroke="#DC2626" stroke-width="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          <p>{{ error }}</p>
        </div>
        <p class="back-link">
          <button class="link-button" @click="goToForgotPassword">Solicitar nuevo enlace</button>
        </p>
      </template>

      <template v-else>
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label class="input-label" for="newPassword">Nueva contraseña</label>
            <input
              id="newPassword"
              v-model="newPassword"
              type="password"
              class="input-field"
              minlength="6"
              required
            />
          </div>

          <div class="form-group">
            <label class="input-label" for="confirmPassword">Confirmar contraseña</label>
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              class="input-field"
              minlength="6"
              required
            />
          </div>

          <p v-if="error" class="msg-error">{{ error }}</p>

          <button type="submit" class="btn-primary" :disabled="isLoading">
            {{ isLoading ? 'Guardando...' : 'Restablecer contraseña' }}
          </button>
        </form>
      </template>

      <p v-if="!tokenError" class="back-link">
        <button class="link-button" @click="goToLogin">Volver a iniciar sesión</button>
      </p>
    </div>
  </div>
</template>

<style scoped>
.reset-view {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #F5F5F5;
  padding: 2rem;
  padding-top: calc(2rem + env(safe-area-inset-top));
}

.reset-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo {
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
}

.logo-icon {
  width: 100px;
  height: 100px;
}

.app-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2E7D32;
  margin: 0;
}

.reset-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #424242;
  text-align: center;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.input-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #424242;
  margin-bottom: 0.375rem;
}

.input-field {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #D1D5DB;
  border-radius: 0.5rem;
  font-size: 1rem;
  background: white;
  box-sizing: border-box;
}

.input-field:focus {
  outline: none;
  border-color: #2E7D32;
  box-shadow: 0 0 0 2px rgba(46, 125, 50, 0.15);
}

.msg-error {
  color: #DC2626;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  text-align: center;
}

.btn-primary {
  width: 100%;
  padding: 0.75rem;
  background-color: #2E7D32;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.success-message {
  text-align: center;
  padding: 1.5rem;
  background: #E8F5E9;
  border-radius: 0.75rem;
  margin-bottom: 1rem;
}

.success-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 0.75rem;
}

.success-message p {
  color: #424242;
  font-size: 0.95rem;
  line-height: 1.5;
}

.error-message {
  text-align: center;
  padding: 1.5rem;
  background: #FEF2F2;
  border-radius: 0.75rem;
  margin-bottom: 1rem;
}

.error-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 0.75rem;
}

.error-message p {
  color: #424242;
  font-size: 0.95rem;
  line-height: 1.5;
}

.back-link {
  text-align: center;
  margin-top: 1.5rem;
  color: #6B7280;
}

.link-button {
  background: none;
  border: none;
  color: #2E7D32;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
}
</style>
