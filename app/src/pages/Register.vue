<script setup>
import { ref } from 'vue'
import api from '../services/api.js'
import { RouterLink, useRouter } from 'vue-router'
import Template from './base/Template.vue'

const router = useRouter()

const name = ref('')
const username = ref('')
const email = ref('')
const password = ref('')
const birthDate = ref('')
const error = ref('')

const handleRegister = async () => {
  try {
    error.value = ''

    await api.post('/auth/register', {
      name: name.value,
      username: username.value,
      email: email.value,
      password: password.value,
      birthDate: birthDate.value
    })

    router.push('/login')
  } catch (err) {
    error.value = err.response?.data?.error || 'Erro ao criar conta.'
  }
}
</script>

<template>
  <Template variant="none" class="items-center flex">
    <div class="w-full max-w-148 flex flex-col gap-8">

      <div class="font-qurova">
        <h2 class="text-5xl font-bold text-[#CCD6E5]">
          Bem vindo(a) ao
          <span class="text-[#33BC90]">Leafy</span>!
        </h2>
      </div>

      <img src="../../assets/line.svg" alt="">

      <form @submit.prevent="handleRegister" class="flex flex-col gap-6">

        <div>
          <label class="block text-sm font-medium text-[#86909F] mb-2">
            Nome
          </label>
          <input
            v-model="name"
            type="text"
            placeholder="Seu nome"
            class="w-full px-4 py-2 border border-[#5A6270] rounded-lg focus:border-[#2BA69C]"
            required
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-[#86909F] mb-2">
            Nome de usuário
          </label>
          <input
            v-model="username"
            type="text"
            placeholder="@username"
            class="w-full px-4 py-2 border border-[#5A6270] rounded-lg focus:border-[#2BA69C]"
            required
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-[#86909F] mb-2">
            E-mail
          </label>
          <input
            v-model="email"
            type="email"
            placeholder="email@exemplo.com"
            class="w-full px-4 py-2 border border-[#5A6270] rounded-lg focus:border-[#2BA69C]"
            required
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-[#86909F] mb-2">
            Data de nascimento
          </label>
          <input
            v-model="birthDate"
            type="date"
            class="w-full px-4 py-2 border border-[#5A6270] rounded-lg focus:border-[#2BA69C]"
            required
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-[#86909F] mb-2">
            Senha
          </label>
          <input
            v-model="password"
            type="password"
            placeholder="******"
            class="w-full px-4 py-2 border border-[#5A6270] rounded-lg focus:border-[#2BA69C]"
            required
          >
        </div>

        <p v-if="error" class="text-red-500 text-sm">
          {{ error }}
        </p>

        <div class="flex gap-3">
          <button
            type="submit"
            class="w-full text-xl bg-[#33BC90] text-[#18202C] font-bold py-2 px-4 rounded-full hover:bg-[#2BA69C] hover:cursor-pointer"
          >
            Criar conta
          </button>

          <RouterLink
            to="/login"
            class="text-center w-full text-xl border border-[#CCD6E5] text-[#CCD6E5] font-bold py-2 px-4 rounded-full hover:bg-[#CCD6E5] hover:text-[#18202C] transition-colors"
          >
            Já tenho conta
          </RouterLink>
        </div>

      </form>

    </div>
  </Template>
</template>