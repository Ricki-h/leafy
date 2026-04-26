<script setup>
import { ref } from 'vue'
import api from '../services/api.js'
import { useRouter } from 'vue-router'
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

    router.push('/feed')
  } catch (err) {
    error.value = err.response?.data?.error || 'Erro ao fazer login.'
  }
}
</script>

<template>
  <main class="mx-auto container">
    <div class="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">

      <div class="text-center mb-6">
        <h2 class="text-3xl font-bold text-gray-700">Bem-vindo</h2>
        <p class="text-gray-500 text-sm mt-1">Faça login para acessar sua conta</p>
      </div>

      <form @submit.prevent="handleLogin">

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">E-mail ou Nome de usuário</label>
          <input
            v-model="login"
            type="text"
            placeholder="email ou username"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          >
        </div>

        <div class="mb-6">
          <div class="flex items-center justify-between mb-2">
            <label class="block text-sm font-medium text-gray-700">Senha</label>
            <a href="#" class="text-xs text-blue-600 hover:text-blue-800">Esqueceu a senha?</a>
          </div>
          <input
            v-model="password"
            type="password"
            placeholder="******"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          >
        </div>

        <p v-if="error" class="text-red-500 text-sm mb-4">{{ error }}</p>

        <button
          type="submit"
          class="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700"
        >
          Entrar
        </button>

      </form>

      <p class="mt-6 text-center text-sm text-gray-600">
        Não tem uma conta?
        <a href="/cadastro" class="text-blue-600 font-semibold hover:underline">Cadastre-se</a>
      </p>

    </div>
  </main>
</template>