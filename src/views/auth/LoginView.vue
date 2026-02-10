<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import LoginForm from '@/components/auth/LoginForm.vue'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { login } = useAuth()
const formRef = ref<InstanceType<typeof LoginForm> | null>(null)

async function handleSubmit(data: { email: string; password: string }): Promise<void> {
  formRef.value?.setLoading(true)
  try {
    await login(data)
  } catch (error) {
    formRef.value?.setError('Email o contraseña incorrectos')
  } finally {
    formRef.value?.setLoading(false)
  }
}

function goToRegister(): void {
  router.push('/register')
}

function goToForgotPassword(): void {
  router.push('/forgot-password')
}

function goToPrivacyPolicy(): void {
  router.push('/politica-privacidad')
}
</script>

<template>
  <div class="login-view">
    <div class="login-header">
      <div class="logo">
        <svg viewBox="0 0 100 100" class="logo-icon">
          <circle cx="50" cy="50" r="45" fill="#E8F5E9" />
          <path d="M30 50 Q50 30 70 50 Q50 70 30 50" fill="#2E7D32" />
          <circle cx="50" cy="50" r="10" fill="#F9A825" />
        </svg>
      </div>
      <h1 class="app-title">reComenzar</h1>
      <p class="app-tagline">"Cuando el amor sana, la vida renace"</p>
    </div>

    <div class="login-content">
      <LoginForm ref="formRef" @submit="handleSubmit" />

      <p class="forgot-password-link">
        <button class="link-button" @click="goToForgotPassword">¿Olvidaste tu contraseña?</button>
      </p>

      <p class="register-link">
        ¿No tienes cuenta?
        <button class="link-button" @click="goToRegister">Regístrate</button>
      </p>

      <p class="privacy-link">
        <button class="link-button privacy-button" @click="goToPrivacyPolicy">Política de Privacidad</button>
      </p>
    </div>
  </div>
</template>

<style scoped>
.login-view {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #F5F5F5;
  padding: 2rem;
  padding-top: calc(2rem + env(safe-area-inset-top));
}

.login-header {
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

.app-tagline {
  color: #6B7280;
  font-style: italic;
  margin-top: 0.5rem;
}

.login-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.forgot-password-link {
  text-align: center;
  margin-top: 1rem;
  color: #6B7280;
}

.register-link {
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

.privacy-link {
  text-align: center;
  margin-top: 2rem;
}

.privacy-button {
  font-size: 0.85rem;
  color: #6B7280;
  font-weight: 400;
}
</style>
