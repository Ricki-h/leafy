import { createRouter, createWebHistory } from 'vue-router'
import Login from '../pages/Login.vue'
import Home from '../pages/Home.vue'
import Register from '../pages/Register.vue'
import NotFound from '../pages/NotFound.vue'
import Notificacoes from '../pages/Notificacoes.vue'
import User from '../pages/User.vue'
import Explorar from '../pages/Explorar.vue'
import Lists from '../pages/Lists.vue'
import SearchBooks from '../pages/SearchBooks.vue'
import Book from '../pages/Book.vue'
import Post from '../pages/Post.vue'
import Lista from '../pages/Lista.vue'


const routes = [
  { path: '/', component: Home, meta: { requiresAuth: true } },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/notfound', component: NotFound },
  { path: '/notificacoes', component: Notificacoes, meta: { requiresAuth: true } },
  { path: '/users/:username', component: User, meta: { requiresAuth: true } },
  { path: '/explorer', component: Explorar, meta: { requiresAuth: true } },
  { path: '/users/:username/lists', component: Lists, meta: { requiresAuth: true } },
  { path: '/lists/:id', component: Lista, meta: { requiresAuth: true } },
  
  { path: '/books', component: SearchBooks, meta: { requiresAuth: true } },
  { path: '/books/:id', component: Book, meta: { requiresAuth: true } },
  { path: '/post/:id', component: Post, meta: { requiresAuth: true } },
     { path: '/users/:username/followers', component: () => import('../pages/Followers.vue'), meta: { requiresAuth: true } },
   { path: '/users/:username/following', component: () => import('../pages/Followers.vue'), meta: { requiresAuth: true } },
  { path: '/users/:username/reviews', component: () => import('../pages/Resenhas.vue'), meta: { requiresAuth: true } },
  {
    path: '/resenhas/:id',
    component: () => import('../pages/Resenha.vue'),
    meta: { requiresAuth: true }
  },
  { path: '/settings', component: () => import('../pages/Settings.vue'), meta: { requiresAuth: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const user = localStorage.getItem('user')

  if (to.meta.requiresAuth && !user) {
    return '/login'
  }

  // Quem já está logado não precisa ver login/registro
  if (user && (to.path === '/login' || to.path === '/register')) {
    return '/'
  }
})

export default router