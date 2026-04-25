<script setup>
import { ref } from 'vue'
import api from '../services/api.js'

const name = ref('')
const email = ref('')
const password = ref('')
const birthDate = ref('')
const error = ref('')
const success = ref('')

const handleRegister = async () => {
  try {
    error.value = ''
    success.value = ''

    await api.post('/auth/register', {
      name: name.value,
      email: email.value,
      password: password.value,
      birthDate: birthDate.value
    })

    success.value = 'Conta criada com sucesso! Faça login.'
  } catch (err) {
    error.value = err.response?.data?.error || 'Erro ao criar conta.'
  }
}
</script>

<template>
  <main class="mx-auto container">
    <div class="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">

      <div class="text-center mb-6">
        <h2 class="text-3xl font-bold text-gray-700">Bem-vindo</h2>
        <p class="text-gray-500 text-sm mt-1">Faça sua conta</p>
      </div>

      <form @submit.prevent="handleRegister">

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Nome</label>
          <input
            v-model="name"
            type="text"
            placeholder="Seu nome"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          >
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
          <input
            v-model="email"
            type="email"
            placeholder="seu@email.com"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          >
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Data de nascimento</label>
          <input
            v-model="birthDate"
            type="date"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          >
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Senha</label>
          <input
            v-model="password"
            type="password"
            placeholder="******"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          >
        </div>

        <p v-if="error" class="text-red-500 text-sm mb-4">{{ error }}</p>
        <p v-if="success" class="text-green-500 text-sm mb-4">{{ success }}</p>

        <button
          type="submit"
          class="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700"
        >
          Criar conta
        </button>

      </form>

      <p class="mt-6 text-center text-sm text-gray-600">
        Já tem uma conta?
        <a href="/login" class="text-blue-600 font-semibold hover:underline">Entrar</a>
      </p>

    </div>
  </main>
</template>