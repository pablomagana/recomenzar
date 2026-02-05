<script setup lang="ts">
import type { ScheduleEntry } from '@/types'
import TimeInput from '@/components/common/TimeInput.vue'

interface Props {
  entry: Omit<ScheduleEntry, 'id'> & { id?: string }
  index: number
  registered: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:hora', value: string): void
  (e: 'update:accion', value: string): void
  (e: 'update:horaCorreccion', value: string): void
  (e: 'update:accionCorreccion', value: string): void
  (e: 'remove'): void
}>()
</script>

<template>
  <tr class="schedule-row">
    <!-- Unregistered mode: editable hora and accion -->
    <template v-if="!registered">
      <td class="cell-time">
        <TimeInput
          :model-value="entry.hora"
          @update:model-value="emit('update:hora', $event)"
        />
      </td>
      <td class="cell-action">
        <input
          type="text"
          class="input-field"
          :value="entry.accion"
          placeholder="Actividad..."
          @input="emit('update:accion', ($event.target as HTMLInputElement).value)"
        />
      </td>
      <td class="cell-remove">
        <button class="remove-btn" @click="emit('remove')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </td>
    </template>

    <!-- Registered mode: readonly original + editable corrections -->
    <template v-else>
      <td class="cell-time readonly">{{ entry.hora }}</td>
      <td class="cell-action readonly">{{ entry.accion }}</td>
      <td class="cell-correction">
        <TimeInput
          :model-value="entry.horaCorreccion || ''"
          placeholder="--:--"
          @update:model-value="emit('update:horaCorreccion', $event)"
        />
      </td>
      <td class="cell-correction">
        <input
          type="text"
          class="input-field correction"
          :value="entry.accionCorreccion || ''"
          placeholder="--"
          @input="emit('update:accionCorreccion', ($event.target as HTMLInputElement).value)"
        />
      </td>
    </template>
  </tr>
</template>

<style scoped>
.schedule-row td {
  padding: 0.5rem 0.25rem;
  vertical-align: middle;
}

.cell-time {
  width: 100px;
}

.cell-action {
  flex: 1;
}

.cell-remove {
  width: 40px;
}

.cell-correction {
  width: 90px;
}

.readonly {
  font-size: 0.875rem;
  color: #6B7280;
  padding: 0.75rem 0.5rem;
  background-color: #F9FAFB;
}

.remove-btn {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: #DC2626;
  opacity: 0.6;
  transition: opacity 0.2s ease;
}

.remove-btn:hover {
  opacity: 1;
}

.remove-btn svg {
  width: 20px;
  height: 20px;
}

.input-field.correction {
  font-size: 0.875rem;
  padding: 0.5rem;
}
</style>
