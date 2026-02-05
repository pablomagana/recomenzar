<script setup lang="ts">
import { ref } from 'vue'
import RegisterForm from '@/components/auth/RegisterForm.vue'
import AppHeader from '@/components/common/AppHeader.vue'
import { useAuth } from '@/composables/useAuth'
import type { RegisterRequest } from '@/types'

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
</script>

<template>
  <div class="register-view">
    <AppHeader title="REGISTRO" :show-back="true" />

    <div class="register-content">
      <RegisterForm ref="formRef" @submit="handleSubmit" />
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
</style>
