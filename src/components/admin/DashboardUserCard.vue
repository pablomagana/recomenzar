<script setup lang="ts">
import { ref } from 'vue'
import type { DashboardEntry } from '@/types'
import AlertBadge from './AlertBadge.vue'

interface Props {
  entry: DashboardEntry
}

defineProps<Props>()

const expanded = ref(false)

const moodEmojis: Record<number, string> = {
  1: '😢',
  2: '😟',
  3: '😐',
  4: '😊',
  5: '😄'
}

const moodLabels: Record<number, string> = {
  1: 'Muy mal',
  2: 'Mal',
  3: 'Neutro',
  4: 'Bien',
  5: 'Muy bien'
}
</script>

<template>
  <div class="user-card" :class="{ 'has-alerts': entry.alerts.length > 0 }">
    <div class="card-header" @click="expanded = !expanded">
      <div class="user-info">
        <div class="avatar">
          <img v-if="entry.user.avatarUrl" :src="entry.user.avatarUrl" :alt="entry.user.nombre" />
          <span v-else class="initials">{{ entry.user.nombre[0] }}{{ entry.user.apellidos[0] }}</span>
        </div>
        <div class="user-details">
          <h3 class="user-name">{{ entry.user.nombre }} {{ entry.user.apellidos }}</h3>
          <p class="user-email">{{ entry.user.email }}</p>
        </div>
      </div>
      <div class="card-right">
        <div v-if="entry.alerts.length > 0" class="alert-count">{{ entry.alerts.length }}</div>
        <svg class="expand-icon" :class="{ rotated: expanded }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
    </div>

    <div v-if="entry.alerts.length > 0" class="alerts-row">
      <AlertBadge v-for="alert in entry.alerts" :key="alert" :type="alert" />
    </div>

    <div v-if="expanded" class="card-body">
      <div v-if="entry.report" class="report-summary">
        <div class="summary-row">
          <span class="summary-label">Estado de animo:</span>
          <span class="summary-value">{{ moodEmojis[entry.report.estadoAnimo] }} {{ moodLabels[entry.report.estadoAnimo] }}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Horario cumplido:</span>
          <span class="summary-value" :class="entry.report.horarioCumplido ? 'success' : 'danger'">
            {{ entry.report.horarioCumplido ? 'Si' : 'No' }}
          </span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Llamadas realizadas:</span>
          <span class="summary-value" :class="entry.report.llamadasRealizadas ? 'danger' : 'success'">
            {{ entry.report.llamadasRealizadas ? 'Si' : 'No' }}
          </span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Retos:</span>
          <div class="challenges-list">
            <div v-for="challenge in entry.challenges" :key="challenge.id" class="challenge-item">
              <span :class="entry.report.retosCumplidos[challenge.id] ? 'success' : 'danger'">
                {{ entry.report.retosCumplidos[challenge.id] ? '✓' : '✗' }}
              </span>
              {{ challenge.nombre }}
            </div>
            <span v-if="entry.challenges.length === 0" class="no-data">Sin retos</span>
          </div>
        </div>
        <div v-if="entry.report.reporteEscrito" class="summary-row">
          <span class="summary-label">Reporte escrito:</span>
          <p class="report-text">{{ entry.report.reporteEscrito }}</p>
        </div>
      </div>
      <div v-else class="no-report">
        <p>No ha presentado reporte hoy.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-card {
  background: white;
  border-radius: 0.5rem;
  border: 1px solid #E5E7EB;
  overflow: hidden;
}

.user-card.has-alerts {
  border-left: 3px solid #DC2626;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  cursor: pointer;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #E8F5E9;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.initials {
  color: #2E7D32;
  font-weight: 600;
  font-size: 0.875rem;
}

.user-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: #424242;
  margin: 0;
}

.user-email {
  font-size: 0.75rem;
  color: #9CA3AF;
  margin: 0;
}

.card-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.alert-count {
  background-color: #DC2626;
  color: white;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 700;
}

.expand-icon {
  width: 20px;
  height: 20px;
  color: #9CA3AF;
  transition: transform 0.2s ease;
}

.expand-icon.rotated {
  transform: rotate(180deg);
}

.alerts-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  padding: 0 1rem 0.75rem;
}

.card-body {
  padding: 0 1rem 1rem;
  border-top: 1px solid #F3F4F6;
}

.report-summary {
  padding-top: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.summary-row {
  display: flex;
  gap: 0.5rem;
  font-size: 0.85rem;
}

.summary-label {
  color: #6B7280;
  min-width: 140px;
  flex-shrink: 0;
}

.summary-value {
  color: #424242;
  font-weight: 500;
}

.success {
  color: #2E7D32;
}

.danger {
  color: #DC2626;
}

.challenges-list {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.challenge-item {
  font-size: 0.85rem;
  color: #424242;
}

.no-data {
  color: #9CA3AF;
  font-size: 0.85rem;
}

.report-text {
  margin: 0;
  color: #424242;
  font-size: 0.85rem;
  font-style: italic;
  background-color: #F9FAFB;
  padding: 0.5rem;
  border-radius: 0.25rem;
  border-left: 3px solid #E5E7EB;
}

.no-report {
  padding-top: 0.75rem;
  color: #9CA3AF;
  font-size: 0.85rem;
}
</style>
