<script setup lang="ts">
import type { MoodLevel } from '@/types'

interface Props {
  modelValue?: MoodLevel
}

defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: MoodLevel): void
}>()

const moods: { level: MoodLevel; label: string; color: string }[] = [
  { level: 1, label: 'Muy mal', color: '#EF4444' },
  { level: 2, label: 'Mal', color: '#F97316' },
  { level: 3, label: 'Regular', color: '#EAB308' },
  { level: 4, label: 'Bien', color: '#84CC16' },
  { level: 5, label: 'Muy bien', color: '#22C55E' }
]

function selectMood(level: MoodLevel): void {
  emit('update:modelValue', level)
}
</script>

<template>
  <div class="mood-selector">
    <button
      v-for="mood in moods"
      :key="mood.level"
      type="button"
      class="mood-button"
      :class="{ active: modelValue === mood.level }"
      :style="{ '--mood-color': mood.color }"
      @click="selectMood(mood.level)"
      :title="mood.label"
    >
      <svg viewBox="0 0 48 48" class="mood-icon">
        <!-- Face circle -->
        <circle cx="24" cy="24" r="22" fill="currentColor" />

        <!-- Eyes -->
        <circle cx="16" cy="20" r="3" fill="white" />
        <circle cx="32" cy="20" r="3" fill="white" />

        <!-- Mouth based on mood -->
        <!-- Mood 1: Very sad -->
        <path
          v-if="mood.level === 1"
          d="M14 36 Q24 28 34 36"
          fill="none"
          stroke="white"
          stroke-width="3"
          stroke-linecap="round"
        />

        <!-- Mood 2: Sad -->
        <path
          v-if="mood.level === 2"
          d="M16 34 Q24 30 32 34"
          fill="none"
          stroke="white"
          stroke-width="3"
          stroke-linecap="round"
        />

        <!-- Mood 3: Neutral -->
        <line
          v-if="mood.level === 3"
          x1="16"
          y1="32"
          x2="32"
          y2="32"
          stroke="white"
          stroke-width="3"
          stroke-linecap="round"
        />

        <!-- Mood 4: Happy -->
        <path
          v-if="mood.level === 4"
          d="M16 30 Q24 36 32 30"
          fill="none"
          stroke="white"
          stroke-width="3"
          stroke-linecap="round"
        />

        <!-- Mood 5: Very happy -->
        <path
          v-if="mood.level === 5"
          d="M14 28 Q24 40 34 28"
          fill="none"
          stroke="white"
          stroke-width="3"
          stroke-linecap="round"
        />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.mood-selector {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
}

.mood-button {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 3px solid transparent;
  background: none;
  padding: 0;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--mood-color);
}

.mood-button:hover {
  transform: scale(1.05);
}

.mood-button.active {
  border-color: #2E7D32;
  transform: scale(1.15);
  box-shadow: 0 0 12px rgba(46, 125, 50, 0.4);
}

.mood-icon {
  width: 100%;
  height: 100%;
}
</style>
