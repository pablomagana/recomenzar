<script setup lang="ts">
import type { User } from '@/types'
import { formatDate } from '@/services/timeUtils'

interface Props {
  user: User
}

defineProps<Props>()
</script>

<template>
  <div class="profile-info">
    <div class="info-item">
      <span class="info-label">Nombre</span>
      <span class="info-value">{{ user.nombre }}</span>
    </div>

    <div class="info-item">
      <span class="info-label">Apellidos</span>
      <span class="info-value">{{ user.apellidos }}</span>
    </div>

    <div class="info-item">
      <span class="info-label">Fecha de nacimiento</span>
      <span class="info-value">{{ formatDate(user.fechaNacimiento) }}</span>
    </div>

    <div class="info-item">
      <span class="info-label">Email</span>
      <span class="info-value">{{ user.email }}</span>
    </div>
  </div>
</template>

<style scoped>
.profile-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.info-label {
  font-size: 0.75rem;
  color: #6B7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.info-value {
  font-size: 1rem;
  color: #424242;
  font-weight: 500;
}
</style>
