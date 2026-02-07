<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from '@/stores/admin'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const router = useRouter()
const adminStore = useAdminStore()

const isLoading = computed(() => adminStore.isLoading)
const error = computed(() => adminStore.error)
const users = computed(() => adminStore.users)

const deleteConfirmId = ref<string | null>(null)

onMounted(() => {
  adminStore.fetchUsers()
})

function editUser(id: string): void {
  router.push(`/admin/users/${id}/edit`)
}

function confirmDelete(id: string): void {
  deleteConfirmId.value = id
}

function cancelDelete(): void {
  deleteConfirmId.value = null
}

async function executeDelete(): Promise<void> {
  if (!deleteConfirmId.value) return
  try {
    await adminStore.deleteUser(deleteConfirmId.value)
  } catch {
    // error is handled by store
  }
  deleteConfirmId.value = null
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}
</script>

<template>
  <div class="users-view">
    <div class="view-header">
      <div>
        <h2 class="view-title">Usuarios</h2>
        <p class="view-subtitle">{{ users.length }} usuarios registrados</p>
      </div>
      <button class="btn-primary" @click="router.push('/admin/users/new')">
        + Nuevo
      </button>
    </div>

    <div v-if="isLoading && users.length === 0" class="loading-container">
      <LoadingSpinner size="large" />
    </div>

    <div v-else-if="error" class="error-notice">
      {{ error }}
    </div>

    <div v-else-if="users.length === 0" class="empty-state">
      <p>No hay usuarios registrados.</p>
    </div>

    <div v-else class="users-list">
      <div v-for="user in users" :key="user.id" class="user-row">
        <div class="user-info">
          <div class="avatar">
            <img v-if="user.avatarUrl" :src="user.avatarUrl" :alt="user.nombre" />
            <span v-else class="initials">{{ user.nombre[0] }}{{ user.apellidos[0] }}</span>
          </div>
          <div class="user-details">
            <h3 class="user-name">{{ user.nombre }} {{ user.apellidos }}</h3>
            <p class="user-meta">{{ user.email }}</p>
            <p class="user-meta">
              <span class="role-badge" :class="user.role">{{ user.role }}</span>
              &middot; {{ formatDate(user.createdAt) }}
            </p>
          </div>
        </div>
        <div class="user-actions">
          <button class="action-btn edit" @click="editUser(user.id)">Editar</button>
          <button class="action-btn delete" @click="confirmDelete(user.id)">Eliminar</button>
        </div>
      </div>
    </div>

    <!-- Delete confirmation modal -->
    <div v-if="deleteConfirmId" class="modal-overlay" @click.self="cancelDelete">
      <div class="modal-content">
        <h3 class="modal-title">Confirmar eliminacion</h3>
        <p class="modal-text">Esta seguro de que desea eliminar este usuario? Esta accion no se puede deshacer.</p>
        <div class="modal-actions">
          <button class="modal-btn cancel" @click="cancelDelete">Cancelar</button>
          <button class="modal-btn confirm" @click="executeDelete">Eliminar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.users-view {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.view-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #424242;
  margin: 0;
}

.view-subtitle {
  font-size: 0.8rem;
  color: #9CA3AF;
  margin: 0.25rem 0 0;
}

.btn-primary {
  background-color: #2E7D32;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
}

.btn-primary:active {
  opacity: 0.9;
}

.loading-container {
  display: flex;
  justify-content: center;
  padding: 3rem 0;
}

.error-notice {
  background-color: #FEE2E2;
  color: #DC2626;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #9CA3AF;
}

.users-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.user-row {
  background: white;
  border-radius: 0.5rem;
  border: 1px solid #E5E7EB;
  padding: 0.75rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
  flex: 1;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #E8F5E9;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.initials {
  color: #2E7D32;
  font-weight: 600;
  font-size: 0.8rem;
}

.user-details {
  min-width: 0;
}

.user-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: #424242;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-meta {
  font-size: 0.75rem;
  color: #9CA3AF;
  margin: 0.1rem 0 0;
}

.role-badge {
  display: inline-block;
  padding: 0.1rem 0.4rem;
  border-radius: 0.25rem;
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
}

.role-badge.admin {
  background-color: #FEF3C7;
  color: #92400E;
}

.role-badge.user {
  background-color: #E8F5E9;
  color: #2E7D32;
}

.user-actions {
  display: flex;
  gap: 0.35rem;
  flex-shrink: 0;
}

.action-btn {
  border: none;
  padding: 0.35rem 0.6rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
}

.action-btn.edit {
  background-color: #E8F5E9;
  color: #2E7D32;
}

.action-btn.delete {
  background-color: #FEE2E2;
  color: #DC2626;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  max-width: 340px;
  width: 100%;
}

.modal-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #424242;
  margin: 0 0 0.5rem;
}

.modal-text {
  font-size: 0.85rem;
  color: #6B7280;
  margin: 0 0 1.25rem;
  line-height: 1.4;
}

.modal-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.modal-btn {
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
}

.modal-btn.cancel {
  background-color: #F3F4F6;
  color: #6B7280;
}

.modal-btn.confirm {
  background-color: #DC2626;
  color: white;
}
</style>
