<script setup lang="ts">
import { ref } from 'vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const emit = defineEmits<{
  (e: 'submit', data: { email: string; password: string }): void
}>()

const email = ref('')
const password = ref('')
const isSubmitting = ref(false)
const error = ref<string | null>(null)

async function handleSubmit(): Promise<void> {
  if (!email.value || !password.value) {
    error.value = 'Por favor completa todos los campos'
    return
  }

  error.value = null
  isSubmitting.value = true

  try {
    emit('submit', {
      email: email.value,
      password: password.value
    })
  } finally {
    isSubmitting.value = false
  }
}

defineExpose({
  setError: (msg: string) => { error.value = msg },
  setLoading: (loading: boolean) => { isSubmitting.value = loading }
})
</script>

<template>
  <form class="login-form" @submit.prevent="handleSubmit">
    <div class="form-group">
      <label class="input-label" for="email">
        <span class="label-icon">📧</span> Email
      </label>
      <input
        id="email"
        v-model="email"
        type="email"
        class="input-field"
        placeholder="tu@email.com"
        autocomplete="email"
        :disabled="isSubmitting"
      />
    </div>

    <div class="form-group">
      <label class="input-label" for="password">
        <span class="label-icon">🔒</span> Contraseña
      </label>
      <input
        id="password"
        v-model="password"
        type="password"
        class="input-field"
        placeholder="••••••••"
        autocomplete="current-password"
        :disabled="isSubmitting"
      />
    </div>

    <p v-if="error" class="error-message">{{ error }}</p>

    <button
      type="submit"
      class="btn-primary w-full"
      :disabled="isSubmitting"
    >
      <LoadingSpinner v-if="isSubmitting" size="small" />
      <span v-else>INICIAR SESIÓN</span>
    </button>
  </form>
</template>

<style scoped>
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.label-icon {
  margin-right: 0.5rem;
}

.error-message {
  color: #DC2626;
  font-size: 0.875rem;
  text-align: center;
  margin: 0;
}
</style>
