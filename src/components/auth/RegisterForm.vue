<script setup lang="ts">
import { ref } from 'vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import type { RegisterRequest } from '@/types'

const emit = defineEmits<{
  (e: 'submit', data: RegisterRequest): void
}>()

const nombre = ref('')
const apellidos = ref('')
const fechaNacimiento = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const isSubmitting = ref(false)
const error = ref<string | null>(null)

async function handleSubmit(): Promise<void> {
  if (!nombre.value || !apellidos.value || !fechaNacimiento.value || !email.value || !password.value) {
    error.value = 'Por favor completa todos los campos'
    return
  }

  if (password.value !== confirmPassword.value) {
    error.value = 'Las contraseñas no coinciden'
    return
  }

  if (password.value.length < 8) {
    error.value = 'La contraseña debe tener al menos 8 caracteres'
    return
  }

  error.value = null
  isSubmitting.value = true

  try {
    emit('submit', {
      nombre: nombre.value,
      apellidos: apellidos.value,
      fechaNacimiento: fechaNacimiento.value,
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
  <form class="register-form" @submit.prevent="handleSubmit">
    <div class="form-group">
      <label class="input-label" for="nombre">Nombre</label>
      <input
        id="nombre"
        v-model="nombre"
        type="text"
        class="input-field"
        placeholder="Tu nombre"
        :disabled="isSubmitting"
      />
    </div>

    <div class="form-group">
      <label class="input-label" for="apellidos">Apellidos</label>
      <input
        id="apellidos"
        v-model="apellidos"
        type="text"
        class="input-field"
        placeholder="Tus apellidos"
        :disabled="isSubmitting"
      />
    </div>

    <div class="form-group">
      <label class="input-label" for="fechaNacimiento">Fecha de nacimiento</label>
      <input
        id="fechaNacimiento"
        v-model="fechaNacimiento"
        type="date"
        class="input-field"
        :disabled="isSubmitting"
      />
    </div>

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
        placeholder="Mínimo 8 caracteres"
        autocomplete="new-password"
        :disabled="isSubmitting"
      />
    </div>

    <div class="form-group">
      <label class="input-label" for="confirmPassword">
        <span class="label-icon">🔒</span> Confirmar contraseña
      </label>
      <input
        id="confirmPassword"
        v-model="confirmPassword"
        type="password"
        class="input-field"
        placeholder="Repite tu contraseña"
        autocomplete="new-password"
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
      <span v-else>CREAR CUENTA</span>
    </button>
  </form>
</template>

<style scoped>
.register-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
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
