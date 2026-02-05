import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Challenge } from '@/types'
import { challengesApi } from '@/services/api/challenges'

const MAX_CHALLENGES = 3

export const useChallengesStore = defineStore('challenges', () => {
  const challenges = ref<Challenge[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const canAddChallenge = computed(() => challenges.value.length < MAX_CHALLENGES)
  const challengeCount = computed(() => challenges.value.length)

  async function fetchChallenges(): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      challenges.value = await challengesApi.getChallenges()
    } catch (e) {
      error.value = 'Error al cargar los retos'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function addChallenge(nombre: string): Promise<Challenge> {
    if (!canAddChallenge.value) {
      throw new Error('Has alcanzado el máximo de 3 retos')
    }

    isLoading.value = true
    error.value = null
    try {
      const challenge = await challengesApi.createChallenge(nombre)
      challenges.value.push(challenge)
      return challenge
    } catch (e) {
      error.value = 'Error al crear el reto'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function removeChallenge(id: string): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      await challengesApi.deleteChallenge(id)
      challenges.value = challenges.value.filter(c => c.id !== id)
    } catch (e) {
      error.value = 'Error al eliminar el reto'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  function getChallengeById(id: string): Challenge | undefined {
    return challenges.value.find(c => c.id === id)
  }

  function clearChallenges(): void {
    challenges.value = []
  }

  return {
    challenges,
    isLoading,
    error,
    canAddChallenge,
    challengeCount,
    fetchChallenges,
    addChallenge,
    removeChallenge,
    getChallengeById,
    clearChallenges
  }
})
