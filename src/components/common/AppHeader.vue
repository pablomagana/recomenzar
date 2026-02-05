<script setup lang="ts">
import { useRouter } from 'vue-router'

interface Props {
  title: string
  showBack?: boolean
  rightAction?: {
    label: string
    emit: string
  }
}

defineProps<Props>()
const emit = defineEmits<{
  (e: 'action'): void
}>()

const router = useRouter()

function goBack(): void {
  router.back()
}
</script>

<template>
  <header class="app-header">
    <div class="header-left">
      <button v-if="showBack" class="back-button" @click="goBack">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
    </div>

    <h1 class="header-title">{{ title }}</h1>

    <div class="header-right">
      <button v-if="rightAction" class="action-button" @click="emit('action')">
        {{ rightAction.label }}
      </button>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #d7ae48;
  color: #4A3728;
  padding: 1rem;
  padding-top: calc(1rem + env(safe-area-inset-top));
  position: sticky;
  top: 0;
  z-index: 50;
}

.header-left,
.header-right {
  width: 60px;
  display: flex;
}

.header-right {
  justify-content: flex-end;
}

.header-title {
  font-size: 1.25rem;
  font-weight: 600;
  text-align: center;
  flex: 1;
}

.back-button {
  background: none;
  border: none;
  color: #4A3728;
  padding: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-button svg {
  width: 24px;
  height: 24px;
}

.action-button {
  background: none;
  border: none;
  color: #F9A825;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0.5rem;
}
</style>
