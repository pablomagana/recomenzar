<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAdminStore } from '@/stores/admin'
import { adminApi } from '@/services/api/admin'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const router = useRouter()
const route = useRoute()
const adminStore = useAdminStore()

const userId = computed(() => route.params.id as string | undefined)
const isEditMode = computed(() => !!userId.value)

const nombre = ref('')
const apellidos = ref('')
const email = ref('')
const password = ref('')
const role = ref('user')
const fechaNacimiento = ref('')

const isLoadingData = ref(false)
const isSaving = ref(false)
const error = ref<string | null>(null)

onMounted(async () => {
  if (isEditMode.value && userId.value) {
    isLoadingData.value = true
    try {
      const user = await adminApi.getUser(userId.value)
      nombre.value = user.nombre
      apellidos.value = user.apellidos
      email.value = user.email
      role.value = user.role
      fechaNacimiento.value = user.fechaNacimiento || ''
    } catch {
      error.value = 'Error al cargar datos del usuario'
    } finally {
      isLoadingData.value = false
    }
  }
})

const canSubmit = computed(() => {
  if (!nombre.value.trim() || !apellidos.value.trim() || !email.value.trim()) return false
  if (!isEditMode.value && password.value.length < 6) return false
  return true
})

async function handleSubmit(): Promise<void> {
  if (!canSubmit.value) return
  isSaving.value = true
  error.value = null

  try {
    if (isEditMode.value && userId.value) {
      await adminStore.updateUser(userId.value, {
        nombre: nombre.value,
        apellidos: apellidos.value,
        email: email.value,
        role: role.value,
        fechaNacimiento: fechaNacimiento.value || undefined
      })
    } else {
      await adminStore.createUser({
        nombre: nombre.value,
        apellidos: apellidos.value,
        email: email.value,
        password: password.value,
        role: role.value,
        fechaNacimiento: fechaNacimiento.value || undefined
      })
    }
    router.push('/admin/users')
  } catch {
    error.value = isEditMode.value ? 'Error al actualizar usuario' : 'Error al crear usuario'
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="form-view">
    <div class="form-header">
      <button class="back-link" @click="router.push('/admin/users')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Usuarios
      </button>
      <h2 class="view-title">{{ isEditMode ? 'Editar usuario' : 'Nuevo usuario' }}</h2>
    </div>

    <div v-if="isLoadingData" class="loading-container">
      <LoadingSpinner size="large" />
    </div>

    <form v-else class="user-form" @submit.prevent="handleSubmit">
      <div v-if="error" class="error-notice">
        {{ error }}
      </div>

      <div class="form-group">
        <label class="form-label" for="nombre">Nombre</label>
        <input
          id="nombre"
          v-model="nombre"
          type="text"
          class="form-input"
          placeholder="Nombre"
          required
        />
      </div>

      <div class="form-group">
        <label class="form-label" for="apellidos">Apellidos</label>
        <input
          id="apellidos"
          v-model="apellidos"
          type="text"
          class="form-input"
          placeholder="Apellidos"
          required
        />
      </div>

      <div class="form-group">
        <label class="form-label" for="email">Email</label>
        <input
          id="email"
          v-model="email"
          type="email"
          class="form-input"
          placeholder="correo@ejemplo.com"
          required
        />
      </div>

      <div v-if="!isEditMode" class="form-group">
        <label class="form-label" for="password">Contrasena</label>
        <input
          id="password"
          v-model="password"
          type="password"
          class="form-input"
          placeholder="Minimo 6 caracteres"
          minlength="6"
          required
        />
      </div>

      <div class="form-group">
        <label class="form-label" for="role">Rol</label>
        <select id="role" v-model="role" class="form-input">
          <option value="user">Usuario</option>
          <option value="admin">Administrador</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label" for="fechaNacimiento">Fecha de nacimiento</label>
        <input
          id="fechaNacimiento"
          v-model="fechaNacimiento"
          type="date"
          class="form-input"
        />
      </div>

      <button type="submit" class="btn-submit" :disabled="!canSubmit || isSaving">
        <LoadingSpinner v-if="isSaving" size="small" />
        <span v-else>{{ isEditMode ? 'Guardar cambios' : 'Crear usuario' }}</span>
      </button>
    </form>
  </div>
</template>

<style scoped>
.form-view {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.back-link {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: none;
  border: none;
  color: #2E7D32;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  align-self: flex-start;
}

.view-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #424242;
  margin: 0;
}

.loading-container {
  display: flex;
  justify-content: center;
  padding: 3rem 0;
}

.user-form {
  background: white;
  border-radius: 0.5rem;
  border: 1px solid #E5E7EB;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.error-notice {
  background-color: #FEE2E2;
  color: #DC2626;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.form-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #6B7280;
}

.form-input {
  border: 1px solid #D1D5DB;
  border-radius: 0.375rem;
  padding: 0.6rem 0.75rem;
  font-size: 0.9rem;
  color: #424242;
  background-color: white;
  outline: none;
  transition: border-color 0.2s ease;
}

.form-input:focus {
  border-color: #2E7D32;
  box-shadow: 0 0 0 2px rgba(46, 125, 50, 0.15);
}

select.form-input {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  padding-right: 2rem;
}

.btn-submit {
  background-color: #2E7D32;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.5rem;
}

.btn-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
