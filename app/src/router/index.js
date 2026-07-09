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