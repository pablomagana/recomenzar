<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import RegisterForm from '@/components/auth/RegisterForm.vue'
import AppHeader from '@/components/common/AppHeader.vue'
import { useAuth } from '@/composables/useAuth'
import type { RegisterRequest } from '@/types'

const router = useRouter()
const { register } = useAuth()
const formRef = ref<InstanceType<typeof RegisterForm> | null>(null)

async function handleSubmit(data: RegisterRequest): Promise<void> {
  formRef.value?.setLoading(true)
  try {
    await register(data)
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status: number } }
      if (axiosError.response?.status === 409) {
        formRef.value?.setError('Este email ya está registrado')
        return
      }
    }
    formRef.value?.setError('Error al crear la cuenta. Intenta de nuevo.')
  } finally {
    formRef.value?.setLoading(false)
  }
}

function goToPrivacyPolicy(): void {
  router.push('/politica-privacidad')
}
</script>

<template>
  <div class="register-view">
    <AppHeader title="REGISTRO" :show-back="true" />

    <div class="register-content">
      <RegisterForm ref="formRef" @submit="handleSubmit" />

      <p class="privacy-notice">
        Al crear una cuenta, aceptas nuestra
        <button class="link-button" @click="goToPrivacyPolicy">Política de Privacidad</button>
      </p>
    </div>
  </div>
</template>

<style scoped>
.register-view {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #F5F5F5;
}

.register-content {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
}

.privacy-notice {
  text-align: center;
  color: #6B7280;
  font-size: 0.8rem;
  margin-top: 1.25rem;
}

.link-button {
  background: none;
  border: none;
  color: #2E7D32;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
  font-size: 0.8rem;
  padding: 0;
}
</style>
