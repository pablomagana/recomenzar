<script setup lang="ts">
import type { DailyReport, Challenge } from '@/types'
import { formatDate } from '@/services/timeUtils'

interface Props {
  report: DailyReport
  challenges?: Challenge[]
}

defineProps<Props>()

const moodEmojis: Record<number, string> = {
  1: '😢',
  2: '😕',
  3: '😐',
  4: '🙂',
  5: '😊'
}

const moodColors: Record<number, string> = {
  1: '#EF4444',
  2: '#F97316',
  3: '#EAB308',
  4: '#84CC16',
  5: '#22C55E'
}

function getMoodEmoji(level: number): string {
  return moodEmojis[level] || '😐'
}

function getMoodColor(level: number): string {
  return moodColors[level] || '#EAB308'
}

function getChallengeName(challengeId: string, challenges?: Challenge[]): string {
  const challenge = challenges?.find(c => c.id === challengeId)
  return challenge?.nombre || challengeId
}
</script>

<template>
  <div class="report-card card">
    <div class="report-header">
      <span class="report-date">{{ formatDate(report.fecha) }}</span>
      <span class="report-mood" :style="{ backgroundColor: getMoodColor(report.estadoAnimo) }">
        {{ getMoodEmoji(report.estadoAnimo) }}
      </span>
    </div>

    <div class="report-status">
      <div class="status-item">
        <span class="status-icon" :class="{ completed: report.horarioCumplido }">
          {{ report.horarioCumplido ? '✅' : '❌' }}
        </span>
        <span>Horario cumplido</span>
      </div>

      <div class="status-item">
        <span class="status-icon" :class="{ completed: report.llamadasRealizadas }">
          {{ report.llamadasRealizadas ? '✅' : '❌' }}
        </span>
        <span>Llamadas realizadas</span>
      </div>
    </div>

    <div v-if="Object.keys(report.retosCumplidos).length > 0" class="report-challenges">
      <span class="section-title">Retos:</span>
      <div v-for="(completed, challengeId) in report.retosCumplidos" :key="challengeId" class="status-item">
        <span class="status-icon" :class="{ completed }">
          {{ completed ? '✅' : '❌' }}
        </span>
        <span>{{ getChallengeName(String(challengeId), challenges) }}</span>
      </div>
    </div>

    <div v-if="report.reporteEscrito" class="report-text">
      <span class="section-title">📝</span>
      <p>"{{ report.reporteEscrito }}"</p>
    </div>

    <div v-if="!report.presentado" class="not-presented">
      <span>⚠️ No presentado a tiempo</span>
    </div>
  </div>
</template>

<style scoped>
.report-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.report-date {
  font-weight: 600;
  color: #424242;
}

.report-mood {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.report-status,
.report-challenges {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.section-title {
  font-weight: 600;
  color: #424242;
  margin-bottom: 0.25rem;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #424242;
}

.status-icon {
  font-size: 1rem;
}

.report-text {
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
}

.report-text p {
  margin: 0;
  color: #6B7280;
  font-style: italic;
  flex: 1;
}

.not-presented {
  background-color: #FEF2F2;
  color: #DC2626;
  padding: 0.5rem;
  border-radius: 0.5rem;
  text-align: center;
  font-size: 0.875rem;
}
</style>
