<script setup lang="ts">
import type { ScheduleEntry } from '@/types'
import ScheduleRow from './ScheduleRow.vue'

interface Props {
  entries: (Omit<ScheduleEntry, 'id'> & { id?: string })[]
  registered: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:entry', index: number, field: string, value: string): void
  (e: 'remove', index: number): void
  (e: 'add'): void
}>()

function handleUpdateField(index: number, field: string, value: string): void {
  emit('update:entry', index, field, value)
}

function handleRemove(index: number): void {
  emit('remove', index)
}
</script>

<template>
  <div class="schedule-table-container">
    <table class="schedule-table">
      <thead>
        <tr>
          <template v-if="!registered">
            <th>Hora</th>
            <th>Acción</th>
            <th></th>
          </template>
          <template v-else>
            <th>Hora Orig.</th>
            <th>Acción Orig.</th>
            <th>Hora Corr.</th>
            <th>Acción Corr.</th>
          </template>
        </tr>
      </thead>
      <tbody>
        <ScheduleRow
          v-for="(entry, index) in entries"
          :key="index"
          :entry="entry"
          :index="index"
          :registered="registered"
          @update:hora="handleUpdateField(index, 'hora', $event)"
          @update:accion="handleUpdateField(index, 'accion', $event)"
          @update:hora-correccion="handleUpdateField(index, 'horaCorreccion', $event)"
          @update:accion-correccion="handleUpdateField(index, 'accionCorreccion', $event)"
          @remove="handleRemove(index)"
        />
      </tbody>
    </table>

    <button v-if="!registered" class="add-row-btn" @click="emit('add')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 5v14M5 12h14" />
      </svg>
      Añadir actividad
    </button>
  </div>
</template>

<style scoped>
.schedule-table-container {
  overflow-x: auto;
}

.schedule-table {
  width: 100%;
  border-collapse: collapse;
}

.schedule-table th {
  text-align: left;
  padding: 0.75rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6B7280;
  text-transform: uppercase;
  border-bottom: 1px solid #E5E7EB;
}

.add-row-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem;
  margin-top: 0.5rem;
  background: none;
  border: 2px dashed #D1D5DB;
  border-radius: 0.5rem;
  color: #6B7280;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-row-btn:hover {
  border-color: #2E7D32;
  color: #2E7D32;
}

.add-row-btn svg {
  width: 18px;
  height: 18px;
}
</style>
