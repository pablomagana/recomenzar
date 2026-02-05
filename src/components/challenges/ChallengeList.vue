<script setup lang="ts">
import { ref } from 'vue'
import type { Challenge } from '@/types'
import ChallengeItem from './ChallengeItem.vue'

interface Props {
  challenges: Challenge[]
  canAdd: boolean
  isLoading?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'add', name: string): void
  (e: 'delete', id: string): void
}>()

const newChallengeName = ref('')

function handleAdd(): void {
  const name = newChallengeName.value.trim()
  if (name) {
    emit('add', name)
    newChallengeName.value = ''
  }
}

function handleDelete(id: string): void {
  emit('delete', id)
}
</script>

<template>
  <div class="challenge-list">
    <div v-if="challenges.length === 0 && !canAdd" class="empty-state">
      <p>No tienes retos configurados para esta semana.</p>
    </div>

    <TransitionGroup name="list" tag="div" class="challenges">
      <ChallengeItem
        v-for="(challenge, index) in challenges"
        :key="challenge.id"
        :challenge="challenge"
        :index="index"
        @delete="handleDelete"
      />
    </TransitionGroup>

    <div v-if="canAdd" class="add-challenge card">
      <form class="add-form" @submit.prevent="handleAdd">
        <input
          v-model="newChallengeName"
          type="text"
          class="input-field"
          placeholder="Nuevo reto..."
          :disabled="isLoading"
        />
        <button
          type="submit"
          class="add-button"
          :disabled="!newChallengeName.trim() || isLoading"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.challenge-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.empty-state {
  text-align: center;
  color: #6B7280;
  padding: 2rem;
}

.add-challenge {
  padding: 0.75rem;
}

.add-form {
  display: flex;
  gap: 0.5rem;
}

.add-form .input-field {
  flex: 1;
}

.add-button {
  width: 44px;
  height: 44px;
  border-radius: 0.5rem;
  background-color: #2E7D32;
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
}

.add-button:hover:not(:disabled) {
  background-color: #256b29;
}

.add-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.add-button svg {
  width: 24px;
  height: 24px;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
