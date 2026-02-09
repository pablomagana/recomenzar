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
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('@/views/auth/ForgotPasswordView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: () => import('@/views/auth/ResetPasswordView.vue'),
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
      path: '/admin',
      component: () => import('@/views/admin/AdminLayout.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
      children: [
        {
          path: '',
          redirect: '/admin/dashboard'
        },
        {
          path: 'dashboard',
          name: 'admin-dashboard',
          component: () => import('@/views/admin/AdminDashboardView.vue')
        },
        {
          path: 'alertas',
          name: 'admin-alertas',
          component: () => import('@/views/admin/AdminAlertasView.vue')
        },
        {
          path: 'users',
          name: 'admin-users',
          component: () => import('@/views/admin/AdminUsersView.vue')
        },
        {
          path: 'users/new',
          name: 'admin-user-new',
          component: () => import('@/views/admin/AdminUserFormView.vue')
        },
        {
          path: 'users/:id/edit',
          name: 'admin-user-edit',
          component: () => import('@/views/admin/AdminUserFormView.vue')
        },
        {
          path: 'profile',
          name: 'admin-profile',
          component: () => import('@/views/admin/AdminProfileView.vue')
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/tabs/profile'
    }
  ]
})

router.beforeEach(authGuard)

export default router
