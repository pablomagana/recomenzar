import { createRouter, createWebHistory } from 'vue-router'
import { authGuard } from './guards'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/tabs/profile'
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/auth/RegisterView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/tabs',
      component: () => import('@/views/TabsLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          redirect: '/tabs/profile'
        },
        {
          path: 'profile',
          name: 'profile',
          component: () => import('@/views/ProfileView.vue')
        },
        {
          path: 'challenges',
          name: 'challenges',
          component: () => import('@/views/ChallengesView.vue')
        },
        {
          path: 'reports',
          name: 'reports',
          component: () => import('@/views/ReportsView.vue')
        },
        {
          path: 'schedule',
          name: 'schedule',
          component: () => import('@/views/ScheduleView.vue')
        }
      ]
    },
    {
      path: '/new-report',
      name: 'new-report',
      component: () => import('@/views/NewReportView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/report-history',
      name: 'report-history',
      component: () => import('@/views/ReportHistoryView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/tabs/profile'
    }
  ]
})

router.beforeEach(authGuard)

export default router
