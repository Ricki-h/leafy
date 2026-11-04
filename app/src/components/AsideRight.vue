<script setup>
import { ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import api from '../services/api.js' 
import UserAvatar from './AvatarImagem.vue' 

const searchQuery = ref('')
const results = ref([])
const isLoading = ref(false)
let debounceTimer = null

async function searchUsers(query) {
  if (!query.trim()) {
    results.value = []
    return
  }

  isLoading.value = true
  try {
    const response = await api.get('/users/search', {
      params: { q: query.trim() }
    })
    console.log('Resultados recebidos:', response.data)
    results.value = response.data
  } catch (error) {
    console.error('Erro detalhado da API:', error.response?.data || error.message)
    results.value = []
  } finally {
    isLoading.value = false
  }
}

watch(searchQuery, (newValue) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    searchUsers(newValue)
  }, 300)
})
</script>

<template>
  <aside class="min-h-screen w-full max-w-70 flex flex-col gap-6 px-6 py-4 border-l border-l-[#5A6270]">
    <!-- Campo de Busca -->
    <label class="input bg-[#0E121A] rounded-full text-[#5A6270] border-[#5A6270] flex items-center gap-2 px-3">
      <svg class="h-4 opacity-50 fill-[#5A6270] shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <g
          stroke-linejoin="round"
          stroke-linecap="round"
          stroke-width="2.5"
          fill="none"
          stroke="currentColor"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.3-4.3"></path>
        </g>
      </svg>
      <input
        v-model="searchQuery"
        type="search"
        placeholder="Search"
        class="p-2 text-base bg-transparent text-white focus:outline-none w-full"
      />
    </label>

    <!-- Estado: Carregando -->
    <div v-if="isLoading" class="text-[#5A6270] text-sm px-4">
      Buscando...
    </div>

    <!-- Estado: Nenhum Resultado -->
    <div v-else-if="searchQuery && results.length === 0" class="text-[#5A6270] text-sm px-4">
      Nenhum usuário encontrado.
    </div>

    <!-- Lista de Resultados -->
    <div v-else class="flex flex-col gap-1">
      <RouterLink
        v-for="user in results"
        :key="user.id"
        :to="'/users/' + user.username"
        class="flex gap-3 items-center p-3 rounded-xl bg-[#0E121A] hover:bg-[#2E3B4E] transition"
      >
        <!-- Reutilizando o UserAvatar -->
        <UserAvatar 
          :src="user.avatarUrl" 
          :name="user.name" 
          size-class="w-12 h-12"
        />

        <div class="flex flex-col items-start truncate">
          <p class="text-[#CCD6E5] text-base font-semibold truncate">{{ user.name }}</p>
          <p class="text-[#5A6270] text-sm truncate">@{{ user.username }}</p>
        </div>
      </RouterLink>
    </div>

    <hr class="border-[#5A6270] mt-auto">
    <p class="text-[#5A6270] text-xs/5">Termos de serviço | Política de privacidade | Política de cookies | Acessibilidade | ©2026 Leafy Corp.</p>
  </aside>
</template>