<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const navItems = [
  { path: '/admin/dashboard', label: 'Panel de Control' },
  { path: '/admin/users', label: 'Usuarios' }
]

async function handleLogout(): Promise<void> {
  await authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="admin-layout">
    <header class="admin-header">
      <h1 class="header-title">reComenzar Admin</h1>
      <button class="logout-btn" @click="handleLogout">Cerrar sesion</button>
    </header>
    <nav class="admin-nav">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="nav-item"
        :class="{ active: route.path.startsWith(item.path) }"
      >
        {{ item.label }}
      </router-link>
    </nav>
    <main class="admin-content">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.admin-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #F5F5F5;
}

.admin-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #4A3728;
  color: white;
  padding: 1rem 1.25rem;
  padding-top: calc(1rem + env(safe-area-inset-top));
}

.header-title {
  font-size: 1.15rem;
  font-weight: 700;
  margin: 0;
}

.logout-btn {
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.4rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.8rem;
  cursor: pointer;
}

.logout-btn:active {
  background-color: rgba(255, 255, 255, 0.1);
}

.admin-nav {
  display: flex;
  background-color: white;
  border-bottom: 1px solid #E5E7EB;
  padding: 0 1rem;
}

.nav-item {
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6B7280;
  text-decoration: none;
  border-bottom: 2px solid transparent;
  transition: color 0.2s ease, border-color 0.2s ease;
}

.nav-item.active {
  color: #2E7D32;
  border-bottom-color: #2E7D32;
}

.admin-content {
  flex: 1;
  padding: 1rem;
}
</style>
