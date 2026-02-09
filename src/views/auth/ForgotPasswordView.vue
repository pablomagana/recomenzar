<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authApi } from '@/services/api/auth'

const router = useRouter()

const email = ref('')
const isLoading = ref(false)
const sent = ref(false)
const networkError = ref('')

async function handleSubmit(): Promise<void> {
  networkError.value = ''

  if (!email.value.trim()) return

  isLoading.value = true
  try {
    await authApi.forgotPassword({ email: email.value.trim() })
  } catch {
    networkError.value = 'Error de conexión. Intenta de nuevo.'
    isLoading.value = false
    return
  }
  isLoading.value = false
  sent.value = true
}

function goToLogin(): void {
  router.push('/login')
}
</script>

<template>
  <div class="forgot-view">
    <div class="forgot-header">
      <div class="logo">
        <svg viewBox="0 0 100 100" class="logo-icon">
          <circle cx="50" cy="50" r="45" fill="#E8F5E9" />
          <path d="M30 50 Q50 30 70 50 Q50 70 30 50" fill="#2E7D32" />
          <circle cx="50" cy="50" r="10" fill="#F9A825" />
        </svg>
      </div>
      <h1 class="app-title">reComenzar</h1>
    </div>

    <div class="forgot-content">
      <h2 class="section-title">Recuperar contraseña</h2>

      <template v-if="!sent">
        <p class="section-desc">Introduce tu email y te enviaremos un enlace para restablecer tu contraseña.</p>

        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label class="input-label" for="email">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              class="input-field"
              placeholder="tu@email.com"
              required
            />
          </div>

          <p v-if="networkError" class="msg-error">{{ networkError }}</p>

          <button type="submit" class="btn-primary" :disabled="isLoading">
            {{ isLoading ? 'Enviando...' : 'Enviar enlace' }}
          </button>
        </form>
      </template>

      <template v-else>
        <div class="success-message">
          <svg viewBox="0 0 24 24" class="success-icon" fill="none" stroke="#2E7D32" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <p>Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.</p>
        </div>
      </template>

      <p class="back-link">
        <button class="link-button" @click="goToLogin">Volver a iniciar sesión</button>
      </p>
    </div>
  </div>
</template>

<style scoped>
.forgot-view {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #F5F5F5;
  padding: 2rem;
  padding-top: calc(2rem + env(safe-area-inset-top));
}

.forgot-header {
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

.forgot-content {
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
  margin-bottom: 0.5rem;
}

.section-desc {
  color: #6B7280;
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
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
