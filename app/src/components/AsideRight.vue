<script setup>
import { ref, watch } from 'vue';
import { RouterLink } from 'vue-router';

const username = 'ricki'

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
    const response = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`)
    if (!response.ok) throw new Error('Erro na busca')
    results.value = await response.json()
  } catch (error) {
    console.error('Erro ao buscar usuários:', error)
    results.value = []
  } finally {
    isLoading.value = false
  }
}

watch(searchQuery, (newValue) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    searchUsers(newValue)
  }, 300) // espera 300ms depois que o usuário parar de digitar
})
</script>

<template>
    <aside class="min-h-screen w-full max-w-70 flex flex-col gap-6 px-6 py-4 border-l border-l-[#5A6270]">
        <label class="input bg-[#0E121A] rounded-full text-[#5A6270] border-[#5A6270]">
            <svg class="h-4 opacity-50 fill-[#5A6270]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
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
                required
                placeholder="Search"
                class="p-2 text-base"
            />
        </label>

        <div v-if="isLoading" class="text-[#5A6270] text-sm px-4">
            Buscando...
        </div>

        <div v-else-if="searchQuery && results.length === 0" class="text-[#5A6270] text-sm px-4">
            Nenhum usuário encontrado.
        </div>

        <div v-else>
            <RouterLink
                v-for="user in results"
                :key="user.id"
                :to="'/users/' + user.username"
                class="flex gap-3 items-center p-4 bg-[#0E121A] hover:bg-[#2E3B4E]"
            >
                <div class="w-12 h-12 rounded-full bg-[#D9D9D9]">
                    <img v-if="user.avatarUrl" :src="user.avatarUrl" class="w-full h-full rounded-full object-cover" />
                </div>
                <div class="flex flex-col items-start">
                    <p class="text-[#CCD6E5] text-base font-semibold">{{ user.name }}</p>
                    <p class="text-[#5A6270] text-sm">@{{ user.username }}</p>
                </div>
            </RouterLink>
        </div>

        <hr class="border-[#5A6270]">
        <p class="text-[#5A6270] text-xs/5">Termos de serviço | Política de privacidade | Política de cookies | Acessibilidade | ©2026 Leafy Corp.</p>
    </aside>
</template>