<script setup>
import { ref } from 'vue'
import api from '../services/api.js'
import { RouterLink, useRouter } from 'vue-router'
import Template from './base/Template.vue'
import Input from '../components/Input.vue'     
import Loading from '../components/Loading.vue' 
import LogoLogin from '../components/LogoLogin.vue'

const router = useRouter()

const login = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const handleLogin = async () => {
  if (loading.value) return

  try {
    loading.value = true
    error.value = ''

    const res = await api.post('/auth/login', {
      login: login.value,
      password: password.value
    })

    localStorage.setItem('user', JSON.stringify(res.data.user))

    router.push('/')
  } catch (err) {
    error.value = err.response?.data?.error || 'Erro ao fazer login.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <Template variant="none" class="items-center">
    <div class="flex justify-between items-center">
      <div class="w-full max-w-148 flex flex-col gap-8">
  
        <div class="font-qurova max-w-98">
          <h2 class="text-5xl font-bold text-[#CCD6E5]">Bem-vindo(a) de volta ao <span class="text-[#33BC90]">Leafy</span>!</h2>
        </div>
        <img src="../../assets/line.svg" alt="">
  
        <form @submit.prevent="handleLogin" class="flex flex-col gap-6">
  
          <Input
            v-model="login"
            variant="floating"
            name="login"
            type="text"
            label="E-mail ou Nome de usuário"
            placeholder="email ou username"
            autocomplete="username"
            :disabled="loading"
            required
          />
  
          <Input
            v-model="password"
            variant="floating"
            name="password"
            type="password"
            label="Senha"
            placeholder="******"
            autocomplete="current-password"
            :disabled="loading"
            required
          />
  
          <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
  
          <div class="flex gap-3">
            <button
              type="submit"
              :disabled="loading"
              class="w-full text-xl bg-[#CCD6E5] flex items-center justify-center gap-3 text-[#0E121A] font-bold py-2 px-4 rounded-full hover:bg-[#2BA69C] hover:cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
            >
              <Loading v-if="loading" />
              {{ loading ? 'Entrando...' : 'Entrar' }}
            </button>
            <RouterLink to="/register"
              class="text-center w-full text-xl border-1 border-[#FF82BD] text-[#FF82BD] font-bold py-2 px-4 rounded-full hover:bg-[#FF82BD] hover:text-[#0E121A] hover:cursor-pointer"
            >
              Não tenho conta
            </RouterLink>
          </div>
  
        </form>
  
      </div>
  
      <LogoLogin></LogoLogin>
    </div>
  </Template>
</template>