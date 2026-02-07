<script setup lang="ts">
import type { AlertType } from '@/types'

interface Props {
  type: AlertType
}

defineProps<Props>()

const alertConfig: Record<AlertType, { label: string; color: 'red' | 'orange' | 'gray' }> = {
  sin_reporte: { label: 'Sin reporte', color: 'gray' },
  animo_bajo: { label: 'Animo bajo', color: 'red' },
  horario_incumplido: { label: 'Horario incumplido', color: 'orange' },
  llamadas_realizadas: { label: 'Hizo llamadas', color: 'red' },
  retos_incumplidos: { label: 'Retos incumplidos', color: 'orange' }
}
</script>

<template>
  <span class="alert-badge" :class="alertConfig[type].color">
    {{ alertConfig[type].label }}
  </span>
</template>

<style scoped>
.alert-badge {
  display: inline-block;
  padding: 0.2rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.7rem;
  font-weight: 600;
  white-space: nowrap;
}

.red {
  background-color: #FEE2E2;
  color: #DC2626;
}

.orange {
  background-color: #FEF3C7;
  color: #92400E;
}

.gray {
  background-color: #F3F4F6;
  color: #6B7280;
}
</style>
