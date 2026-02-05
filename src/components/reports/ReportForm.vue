<script setup lang="ts">
import { ref } from 'vue'
import type { MoodLevel, Challenge, CreateReportRequest } from '@/types'
import MoodSelector from '@/components/common/MoodSelector.vue'
import ToggleButton from '@/components/common/ToggleButton.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

interface Props {
  challenges: Challenge[]
  isLoading?: boolean
  disabled?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'submit', data: CreateReportRequest): void
}>()

const estadoAnimo = ref<MoodLevel | undefined>()
const horarioCumplido = ref<boolean | undefined>()
const llamadasRealizadas = ref<boolean | undefined>()
const retosCumplidos = ref<Record<string, boolean>>({})
const reporteEscrito = ref('')

function toggleReto(challengeId: string): void {
  retosCumplidos.value[challengeId] = !retosCumplidos.value[challengeId]
}

function handleSubmit(): void {
  if (estadoAnimo.value === undefined) {
    return
  }

  const data: CreateReportRequest = {
    estadoAnimo: estadoAnimo.value,
    horarioCumplido: horarioCumplido.value ?? false,
    llamadasRealizadas: llamadasRealizadas.value ?? false,
    retosCumplidos: retosCumplidos.value,
    reporteEscrito: reporteEscrito.value
  }

  emit('submit', data)
}
</script>

<template>
  <form class="report-form" @submit.prevent="handleSubmit">
    <div class="form-section">
      <label class="section-label">¿Cómo te sientes hoy?</label>
      <MoodSelector v-model="estadoAnimo" />
    </div>

    <div class="form-section">
      <label class="section-label">¿Cumpliste el horario?</label>
      <ToggleButton v-model="horarioCumplido" />
    </div>

    <div class="form-section">
      <label class="section-label">¿Realizaste las llamadas?</label>
      <ToggleButton v-model="llamadasRealizadas" />
    </div>

    <div v-if="challenges.length > 0" class="form-section">
      <label class="section-label">Retos cumplidos:</label>
      <div class="challenges-checkboxes">
        <label
          v-for="challenge in challenges"
          :key="challenge.id"
          class="challenge-checkbox"
        >
          <input
            type="checkbox"
            :checked="retosCumplidos[challenge.id]"
            @change="toggleReto(challenge.id)"
          />
          <span class="checkbox-custom"></span>
          <span>{{ challenge.nombre }}</span>
        </label>
      </div>
    </div>

    <div class="form-section">
      <label class="section-label">Escribe tu reporte:</label>
      <textarea
        v-model="reporteEscrito"
        class="input-field textarea"
        placeholder="¿Cómo fue tu día? ¿Qué aprendiste?"
        rows="4"
        :disabled="disabled"
      ></textarea>
    </div>

    <button
      type="submit"
      class="btn-primary w-full"
      :disabled="!estadoAnimo || isLoading || disabled"
    >
      <LoadingSpinner v-if="isLoading" size="small" />
      <span v-else>ENVIAR REPORTE</span>
    </button>
  </form>
</template>

<style scoped>
.report-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.section-label {
  font-weight: 600;
  color: #424242;
}

.challenges-checkboxes {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.challenge-checkbox {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  color: #424242;
}

.challenge-checkbox input {
  display: none;
}

.checkbox-custom {
  width: 24px;
  height: 24px;
  border: 2px solid #D1D5DB;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.challenge-checkbox input:checked + .checkbox-custom {
  background-color: #2E7D32;
  border-color: #2E7D32;
}

.challenge-checkbox input:checked + .checkbox-custom::after {
  content: '✓';
  color: white;
  font-size: 14px;
  font-weight: bold;
}

.textarea {
  resize: vertical;
  min-height: 100px;
}
</style>
