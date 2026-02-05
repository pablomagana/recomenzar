<script setup lang="ts">
import type { Challenge } from '@/types'

interface Props {
  challenge: Challenge
  index: number
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'delete', id: string): void
}>()

function handleDelete(id: string): void {
  emit('delete', id)
}
</script>

<template>
  <div class="challenge-item card">
    <div class="challenge-content">
      <span class="challenge-number">{{ index + 1 }}.</span>
      <span class="challenge-name">{{ challenge.nombre }}</span>
    </div>
    <button class="delete-button" @click="handleDelete(challenge.id)">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.challenge-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
}

.challenge-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}

.challenge-number {
  font-weight: 600;
  color: #2E7D32;
}

.challenge-name {
  color: #424242;
}

.delete-button {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: #DC2626;
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.delete-button:hover {
  opacity: 1;
}

.delete-button svg {
  width: 20px;
  height: 20px;
}
</style>
