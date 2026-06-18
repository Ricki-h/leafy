<script setup>
import { ref } from 'vue'
import api from '../services/api.js'
import { RouterLink, useRouter } from 'vue-router'
import Template from './base/Template.vue'

const router = useRouter()

const login = ref('')
const password = ref('')
const error = ref('')

const handleLogin = async () => {
  try {
    error.value = ''

    const res = await api.post('/auth/login', {
      login: login.value,
      password: password.value
    })

    localStorage.setItem('token', res.data.token)
    localStorage.setItem('user', JSON.stringify(res.data.user))

    router.push('/')
  } catch (err) {
    error.value = err.response?.data?.error || 'Erro ao fazer login.'
  }
}
</script>

<template>
  <Template variant="none" class="items-center">
    <div class="w-full max-w-148 flex flex-col gap-8">

      <div class="font-qurova max-w-98">
        <h2 class="text-5xl font-bold text-[#CCD6E5]">Bem-vindo(a) de volta ao <span class="text-[#33BC90]">Leafy</span>!</h2>
      </div>
      <img src="../../assets/line.svg" alt="">

      <form @submit.prevent="handleLogin" class="flex flex-col gap-6">

        <div>
          <label class="block text-sm font-medium text-[#86909F] mb-2">E-mail ou Nome de usuário</label>
          <input
            v-model="login"
            type="text"
            placeholder="email ou username"
            class="w-full px-4 py-2 border border-[#5A6270] rounded-lg focus:border-[#2BA69C]"
            required
          >
        </div>

        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="block text-sm font-medium text-[#86909F]">Senha</label>
          </div>
          <input
            v-model="password"
            type="password"
            placeholder="******"
            class="w-full px-4 py-2 border border-[#5A6270] rounded-lg focus:border-[#2BA69C]"
            required
          >
        </div>

        <p v-if="error" class="text-red-500 text-sm mb-4">{{ error }}</p>

        <div class="flex gap-3">
          <button
            type="submit"
            class="w-full text-xl bg-[#CCD6E5] text-[#0E121A] font-bold py-2 px-4 rounded-full hover:bg-[#2BA69C] hover:cursor-pointer"
          >
            Entrar
          </button>
          <RouterLink to="/register"
            class="text-center w-full text-xl border-1 border-[#FF82BD] text-[#FF82BD] font-bold py-2 px-4 rounded-full hover:bg-[#FF82BD] hover:text-[#0E121A] hover:cursor-pointer"
          >
            Não tenho conta
          </RouterLink>
        </div>


      </form>

      </div>
  </Template>
</template>