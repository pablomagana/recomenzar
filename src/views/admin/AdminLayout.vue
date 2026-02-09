<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const showUserMenu = ref(false)
const userMenuRef = ref<HTMLElement | null>(null)

const navItems = [
  { path: '/admin/dashboard', label: 'Panel de Control' },
  { path: '/admin/users', label: 'Usuarios' }
]

function toggleUserMenu() {
  showUserMenu.value = !showUserMenu.value
}

function handleClickOutside(event: MouseEvent) {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target as Node)) {
    showUserMenu.value = false
  }
}

function goToProfile() {
  showUserMenu.value = false
  router.push('/admin/profile')
}

async function handleLogout(): Promise<void> {
  showUserMenu.value = false
  await authStore.logout()
  router.push('/login')
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="admin-layout">
    <header class="admin-header">
      <h1 class="header-title">reComenzar Admin</h1>
      <div ref="userMenuRef" class="user-menu-container">
        <button class="user-icon-btn" @click="toggleUserMenu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="28" height="28">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
          </svg>
        </button>
        <div v-if="showUserMenu" class="user-dropdown">
          <button class="dropdown-item" @click="goToProfile">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="18" height="18">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
            </svg>
            Mi perfil
          </button>
          <button class="dropdown-item dropdown-item--danger" @click="handleLogout">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="18" height="18">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Cerrar sesión
          </button>
        </div>
      </div>
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

.user-menu-container {
  position: relative;
}

.user-icon-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
}

.user-icon-btn:active {
  background-color: rgba(255, 255, 255, 0.15);
}

.user-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  min-width: 180px;
  z-index: 50;
  overflow: hidden;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  background: none;
  font-size: 0.875rem;
  color: #424242;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.15s ease;
}

.dropdown-item:active {
  background-color: #F5F5F5;
}

.dropdown-item--danger {
  color: #DC2626;
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
