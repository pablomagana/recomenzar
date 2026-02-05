<script setup lang="ts">
import { ref, watch } from 'vue'
import type { ReportFilters } from '@/types'
import DatePicker from '@/components/common/DatePicker.vue'

interface Props {
  modelValue: ReportFilters
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: ReportFilters): void
  (e: 'apply'): void
}>()

const localFilters = ref<ReportFilters>({ ...props.modelValue })

const selectedMoods = ref<Set<number>>(new Set(props.modelValue.estadoAnimo || []))

watch(() => props.modelValue, (newValue) => {
  localFilters.value = { ...newValue }
  selectedMoods.value = new Set(newValue.estadoAnimo || [])
}, { deep: true })

const moodOptions = [
  { level: 1, emoji: '😢' },
  { level: 2, emoji: '😕' },
  { level: 3, emoji: '😐' },
  { level: 4, emoji: '🙂' },
  { level: 5, emoji: '😊' }
]

function toggleMood(level: number): void {
  if (selectedMoods.value.has(level)) {
    selectedMoods.value.delete(level)
  } else {
    selectedMoods.value.add(level)
  }
  updateFilters()
}

function selectAllMoods(): void {
  selectedMoods.value.clear()
  updateFilters()
}

function updateFilters(): void {
  const filters: ReportFilters = {
    ...localFilters.value,
    estadoAnimo: selectedMoods.value.size > 0 ? Array.from(selectedMoods.value) : undefined
  }
  emit('update:modelValue', filters)
}

function applyFilters(): void {
  emit('apply')
}

function toggleCheckbox(field: 'horarioCumplido' | 'llamadasRealizadas' | 'presentado'): void {
  const currentValue = localFilters.value[field]
  if (currentValue === undefined) {
    localFilters.value[field] = true
  } else if (currentValue === true) {
    localFilters.value[field] = false
  } else {
    localFilters.value[field] = undefined
  }
  updateFilters()
}
</script>

<template>
  <div class="report-filters card">
    <h3 class="filters-title">FILTROS</h3>

    <div class="filter-section">
      <div class="date-range">
        <div class="date-field">
          <label>📅 Desde:</label>
          <DatePicker
            v-model="localFilters.fechaDesde"
            @update:model-value="updateFilters"
          />
        </div>
        <div class="date-field">
          <label>📅 Hasta:</label>
          <DatePicker
            v-model="localFilters.fechaHasta"
            @update:model-value="updateFilters"
          />
        </div>
      </div>
    </div>

    <div class="filter-section">
      <label class="filter-label">Estado de ánimo:</label>
      <div class="mood-filters">
        <button
          v-for="mood in moodOptions"
          :key="mood.level"
          class="mood-filter-btn"
          :class="{ active: selectedMoods.has(mood.level) }"
          @click="toggleMood(mood.level)"
        >
          {{ mood.emoji }}
        </button>
        <button
          class="mood-filter-btn all"
          :class="{ active: selectedMoods.size === 0 }"
          @click="selectAllMoods"
        >
          Todos
        </button>
      </div>
    </div>

    <div class="filter-section">
      <label class="filter-label">Cumplimiento:</label>
      <div class="checkbox-filters">
        <label class="checkbox-label">
          <input
            type="checkbox"
            :checked="localFilters.horarioCumplido === true"
            :indeterminate="localFilters.horarioCumplido === undefined"
            @click="toggleCheckbox('horarioCumplido')"
          />
          <span>Horario</span>
        </label>
        <label class="checkbox-label">
          <input
            type="checkbox"
            :checked="localFilters.llamadasRealizadas === true"
            :indeterminate="localFilters.llamadasRealizadas === undefined"
            @click="toggleCheckbox('llamadasRealizadas')"
          />
          <span>Llamadas</span>
        </label>
        <label class="checkbox-label">
          <input
            type="checkbox"
            :checked="localFilters.presentado === false"
            @click="toggleCheckbox('presentado')"
          />
          <span>No presentado</span>
        </label>
      </div>
    </div>

    <button class="btn-primary w-full" @click="applyFilters">
      APLICAR FILTROS
    </button>
  </div>
</template>

<style scoped>
.report-filters {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.filters-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #424242;
  margin: 0;
}

.filter-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-label {
  font-size: 0.875rem;
  color: #6B7280;
}

.date-range {
  display: flex;
  gap: 0.75rem;
}

.date-field {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.date-field label {
  font-size: 0.75rem;
  color: #6B7280;
}

.mood-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.mood-filter-btn {
  width: 40px;
  height: 40px;
  border: 2px solid #E5E7EB;
  border-radius: 0.5rem;
  background: white;
  font-size: 1.25rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mood-filter-btn.all {
  width: auto;
  padding: 0 0.75rem;
  font-size: 0.875rem;
  color: #6B7280;
}

.mood-filter-btn.active {
  border-color: #2E7D32;
  background-color: #E8F5E9;
}

.checkbox-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: #424242;
  font-size: 0.875rem;
}

.checkbox-label input {
  width: 18px;
  height: 18px;
  accent-color: #2E7D32;
}
</style>
