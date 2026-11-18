<script setup>
import { ref } from 'vue'
import api from '../services/api.js'
import { RouterLink, useRouter } from 'vue-router'
import Template from './base/Template.vue'
import Input from '../components/Input.vue'    
import Loading from '../components/Loading.vue' 
import LogoLogin from '../components/LogoLogin.vue'

const router = useRouter()

const name = ref('')
const username = ref('')
const email = ref('')
const password = ref('')
const birthDate = ref('')
const error = ref('')
const loading = ref(false)

const handleRegister = async () => {
  if (loading.value) return

  try {
    loading.value = true
    error.value = ''

    const { data } = await api.post('/auth/register', {
      name: name.value,
      username: username.value,
      email: email.value,
      password: password.value,
      birthDate: birthDate.value
    })

    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))

    router.push('/')
  } catch (err) {
    error.value = err.response?.data?.error || 'Erro ao criar conta.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <Template variant="none" class="items-center flex">
    <Loading v-if="loading" />

    <div class="flex flex-row-reverse justify-between items-center">
      <div class="w-full max-w-148 flex flex-col gap-8">
  
        <div class="font-qurova">
          <h2 class="text-5xl font-bold text-[#CCD6E5]">
            Bem vindo(a) ao
            <span class="text-[#33BC90]">Leafy</span>!
          </h2>
        </div>
  
        <img src="../../assets/line.svg" alt="">
  
        <form @submit.prevent="handleRegister" class="flex flex-col gap-6">
  
          <Input
            v-model="name"
            name="name"
            type="text"
            label="Nome"
            placeholder="Seu nome"
            autocomplete="name"
            :disabled="loading"
            required
          />
  
          <Input
            v-model="username"
            name="username"
            type="text"
            label="Nome de usuário"
            placeholder="@username"
            autocomplete="username"
            :disabled="loading"
            required
          />
  
          <Input
            v-model="email"
            name="email"
            type="email"
            label="E-mail"
            placeholder="email@exemplo.com"
            autocomplete="email"
            :disabled="loading"
            required
          />
  
          <Input
            v-model="birthDate"
            name="birthDate"
            type="date"
            label="Data de nascimento"
            autocomplete="bday"
            :disabled="loading"
            required
          />
  
          <Input
            v-model="password"
            name="password"
            type="password"
            label="Senha"
            placeholder="******"
            autocomplete="new-password"
            :disabled="loading"
            required
          />
  
          <p v-if="error" class="text-red-500 text-sm">
            {{ error }}
          </p>
  
          <div class="flex gap-3">
            <button
              type="submit"
              :disabled="loading"
              class="w-full text-xl bg-[#33BC90] text-[#18202C] font-bold py-2 px-4 rounded-full hover:bg-[#2BA69C] hover:cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
            >
              {{ loading ? 'Criando...' : 'Criar conta' }}
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

      <LogoLogin></LogoLogin>
    </div>
  </Template>
</template>