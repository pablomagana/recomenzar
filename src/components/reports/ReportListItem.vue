<script setup lang="ts">
import type { DailyReport } from '@/types'
import { formatDate } from '@/services/timeUtils'

interface Props {
  report: DailyReport
}

defineProps<Props>()

const moodEmojis: Record<number, string> = {
  1: '😢',
  2: '😕',
  3: '😐',
  4: '🙂',
  5: '😊'
}

function getMoodEmoji(level: number): string {
  return moodEmojis[level] || '😐'
}

function getChallengesSummary(report: DailyReport): { completed: number; total: number } {
  const entries = Object.values(report.retosCumplidos)
  return {
    completed: entries.filter(Boolean).length,
    total: entries.length
  }
}
</script>

<template>
  <div class="report-list-item card">
    <div class="item-header">
      <span class="item-date">{{ formatDate(report.fecha) }}</span>
      <span class="item-mood">{{ getMoodEmoji(report.estadoAnimo) }}</span>
    </div>

    <div class="item-status">
      <span class="status-badge" :class="{ success: report.horarioCumplido, fail: !report.horarioCumplido }">
        {{ report.horarioCumplido ? '✅' : '❌' }} Horario
      </span>
      <span class="status-badge" :class="{ success: report.llamadasRealizadas, fail: !report.llamadasRealizadas }">
        {{ report.llamadasRealizadas ? '✅' : '❌' }} Llamadas
      </span>
      <span
        v-if="getChallengesSummary(report).total > 0"
        class="status-badge"
        :class="{ success: getChallengesSummary(report).completed === getChallengesSummary(report).total }"
      >
        {{ getChallengesSummary(report).completed }}/{{ getChallengesSummary(report).total }} Retos
      </span>
    </div>

    <div v-if="!report.presentado" class="not-presented-badge">
      No presentado
    </div>
  </div>
</template>

<style scoped>
.report-list-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-date {
  font-weight: 600;
  color: #424242;
}

.item-mood {
  font-size: 1.5rem;
}

.item-status {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.status-badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  background-color: #F3F4F6;
  color: #6B7280;
}

.status-badge.success {
  background-color: #D1FAE5;
  color: #059669;
}

.status-badge.fail {
  background-color: #FEE2E2;
  color: #DC2626;
}

.not-presented-badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  background-color: #FEF3C7;
  color: #D97706;
  align-self: flex-start;
}
</style>
