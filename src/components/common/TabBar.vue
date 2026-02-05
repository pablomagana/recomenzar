<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const tabs = [
  { path: '/tabs/profile', name: 'Perfil', icon: 'profile' },
  { path: '/tabs/challenges', name: 'Retos', icon: 'challenges' },
  { path: '/tabs/reports', name: 'Registros', icon: 'reports' },
  { path: '/tabs/schedule', name: 'Horario', icon: 'schedule' }
]

const activeTab = computed(() => route.path)
</script>

<template>
  <nav class="tab-bar">
    <router-link
      v-for="tab in tabs"
      :key="tab.path"
      :to="tab.path"
      class="tab-item"
      :class="{ active: activeTab === tab.path }"
    >
      <div class="tab-icon">
        <!-- Profile Icon -->
        <svg v-if="tab.icon === 'profile'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
        </svg>

        <!-- Challenges Icon -->
        <svg v-if="tab.icon === 'challenges'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2l3 7h7l-5.5 4.5 2 7L12 16l-6.5 4.5 2-7L2 9h7z" />
        </svg>

        <!-- Reports Icon -->
        <svg v-if="tab.icon === 'reports'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="4" y="3" width="16" height="18" rx="2" />
          <path d="M8 7h8M8 11h8M8 15h4" />
        </svg>

        <!-- Schedule Icon -->
        <svg v-if="tab.icon === 'schedule'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      </div>
      <span class="tab-label">{{ tab.name }}</span>
    </router-link>
  </nav>
</template>

<style scoped>
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #4A3728;
  height: 60px;
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 100;
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 100%;
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  transition: color 0.2s ease;
}

.tab-item.active {
  color: #F9A825;
}

.tab-icon {
  width: 24px;
  height: 24px;
  margin-bottom: 4px;
}

.tab-icon svg {
  width: 100%;
  height: 100%;
}

.tab-label {
  font-size: 11px;
  font-weight: 500;
}
</style>
