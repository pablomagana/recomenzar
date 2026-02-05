<script setup lang="ts">
import { computed, onMounted } from 'vue'
import AppHeader from '@/components/common/AppHeader.vue'
import ChallengeList from '@/components/challenges/ChallengeList.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { useChallengesStore } from '@/stores/challenges'
import { formatDate, getMondayOfWeek } from '@/services/timeUtils'

const challengesStore = useChallengesStore()

const challenges = computed(() => challengesStore.challenges)
const canAdd = computed(() => challengesStore.canAddChallenge)
const isLoading = computed(() => challengesStore.isLoading)

const weekStartDate = computed(() => formatDate(getMondayOfWeek()))
const resetInfo = computed(() => {
  const resetTime = import.meta.env.VITE_HORA_REINICIO_RETOS || '08:00'
  return `Se reinician: Lunes ${resetTime}`
})

onMounted(async () => {
  try {
    await challengesStore.fetchChallenges()
  } catch (error) {
    console.error('Error loading challenges:', error)
  }
})

async function handleAddChallenge(name: string): Promise<void> {
  try {
    await challengesStore.addChallenge(name)
  } catch (error) {
    console.error('Error adding challenge:', error)
  }
}

async function handleDeleteChallenge(id: string): Promise<void> {
  try {
    await challengesStore.removeChallenge(id)
  } catch (error) {
    console.error('Error deleting challenge:', error)
  }
}
</script>

<template>
  <div class="challenges-view">
    <AppHeader title="RETOS PERSONALES" />

    <div class="page-container">
      <div class="challenges-header">
        <span class="week-date">📅 Semana del {{ weekStartDate }}</span>
      </div>

      <div v-if="isLoading && challenges.length === 0" class="loading-container">
        <LoadingSpinner size="large" />
      </div>

      <div v-else class="challenges-content">
        <ChallengeList
          :challenges="challenges"
          :can-add="canAdd"
          :is-loading="isLoading"
          @add="handleAddChallenge"
          @delete="handleDeleteChallenge"
        />

        <div v-if="!canAdd" class="max-challenges-notice">
          <p>Has alcanzado el máximo de 3 retos semanales.</p>
        </div>
      </div>

      <div class="reset-info">
        <span>⏰ {{ resetInfo }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.challenges-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.challenges-header {
  padding: 1rem;
  text-align: right;
}

.week-date {
  font-size: 0.875rem;
  color: #6B7280;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem;
}

.challenges-content {
  padding: 0 1rem;
  flex: 1;
}

.max-challenges-notice {
  text-align: center;
  padding: 1rem;
  margin-top: 1rem;
  background-color: #FEF3C7;
  border-radius: 0.5rem;
}

.max-challenges-notice p {
  margin: 0;
  color: #92400E;
  font-size: 0.875rem;
}

.reset-info {
  padding: 1rem;
  text-align: center;
  color: #6B7280;
  font-size: 0.875rem;
}
</style>
