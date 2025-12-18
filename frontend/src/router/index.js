import { createRouter, createWebHistory } from 'vue-router'
import { authService } from '@/services/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/LoginView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/RegisterView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/BoardView.vue'),
      meta: { requiresAuth: true }
    },
        {
         path: '/pomodoro',
         name: 'Pomodoro',
         component: () => import('@/views/PomodoroView.vue'),
         meta: { requiresAuth: false }
        },
        {
          path: '/privacy-policy',
          name: 'PrivacyPolicy',
          component: () => import('@/views/PrivacyPolicy.vue'),
          meta: { requiresAuth: false }
        }
      ]
    })
router.beforeEach((to, from, next) => {
  const isAuthenticated = authService.isAuthenticated()

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
