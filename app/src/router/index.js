import { createRouter, createWebHistory } from 'vue-router'
import Login from '../pages/Login.vue'
import Home from '../pages/Home.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})