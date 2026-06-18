import { createRouter, createWebHistory } from 'vue-router'
import Login from '../pages/Login.vue'
import Home from '../pages/Home.vue'
import Register from '../pages/Register.vue'
import NotFound from '../pages/NotFound.vue'
import Notificacoes from '../pages/Notificacoes.vue'
import User from '../pages/User.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { 
    path: '/feed', 
    component: () => import('../pages/Feed.vue'), 
    meta: { requiresAuth: true } 
  },
  { path: '/verificar-email', component: () => import('../pages/VerificarEmail.vue') },
  { path: '/notfound', component: NotFound },
  { path: '/notificacoes', component: Notificacoes },
  { path: '/users/:username', component: User },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router