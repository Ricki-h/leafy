<template>
    <Template variant="left">
          <div class="w-full h-full overflow-y-auto bg-[#151823] px-6 py-6">
            <!-- Title -->
            <h1 class="text-center text-2xl font-bold text-white mb-4">
            Listas de <span class="text-teal-400">{{ userName || 'usuário' }}</span>
            </h1>

            <!-- Divider -->
            <div class="w-full max-w-[826px] mx-auto h-[2px] bg-pink-500 mb-10"></div>

            <!-- Loading -->
            <div v-if="loading" class="text-center text-white/70 py-10">
              Carregando listas...
            </div>

            <!-- Erro -->
            <div v-else-if="error" class="text-center text-red-400 py-10">
              {{ error }}
            </div>

            <!-- Vazio -->
            <div v-else-if="lists.length === 0" class="text-center text-white/70 py-10">
              Nenhuma lista encontrada.
            </div>

            <!-- Grid -->
            <div v-else class="max-w-[826px] mx-auto grid grid-cols-2 sm:grid-cols-4 gap-x-10 gap-y-5">
            <router-link
                v-for="list in paginatedLists"
                :key="list.id"
                :to="`/lists/${list.id}`"
                class="flex flex-col items-center cursor-pointer group"
            >
                <div class="relative w-full aspect-[3/4] bg-gray-300 rounded-sm overflow-hidden">
                <!-- Capa do primeiro livro da lista, se existir -->
                <img
                    v-if="firstCover(list)"
                    :src="firstCover(list)"
                    :alt="list.name"
                    class="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                />
                <!-- Placeholder caso a lista esteja vazia -->
                <svg v-else class="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <line x1="0" y1="0" x2="100" y2="100" stroke="#4b5563" stroke-width="0.5" />
                    <line x1="100" y1="0" x2="0" y2="100" stroke="#4b5563" stroke-width="0.5" />
                </svg>
                </div>

                <span class="mt-3 text-white text-sm font-medium text-center">
                {{ list.name }}
                </span>
            </router-link>
            </div>

            <!-- Pagination -->
            <div v-if="totalPages > 1" class="flex items-center justify-center gap-3 mt-10">
            <button
                v-for="page in totalPages"
                :key="page"
                @click="currentPage = page"
                class="w-8 h-8 rounded-full text-white text-sm font-semibold flex items-center justify-center transition-opacity"
                :class="page === currentPage ? 'bg-purple-500' : 'bg-purple-500/70 hover:opacity-90'"
            >
                {{ page }}
            </button>
            </div>
        </div>
    </Template>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import Template from './base/Template.vue'
import api from '../services/api.js'

// Ajuste a URL base conforme seu .env (ex: VITE_API_URL=http://localhost:3000)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const props = defineProps({
  // Se userId for passado, busca as listas PÚBLICAS desse usuário (rota getLists).
  // Se não for passado, busca as listas do usuário LOGADO (rota getMyLists).
  userId: {
    type: [String, Number],
    default: null,
  },
  itemsPerPage: {
    type: Number,
    default: 8, // 2 colunas x 4 linhas, casa com o grid mobile
  },
})

const route = useRoute()

const lists = ref([])
const userName = ref('')
const loading = ref(true)
const error = ref(null)
const currentPage = ref(1)

const totalPages = computed(() =>
  Math.max(1, Math.ceil(lists.value.length / props.itemsPerPage))
)

const paginatedLists = computed(() => {
  const start = (currentPage.value - 1) * props.itemsPerPage
  return lists.value.slice(start, start + props.itemsPerPage)
})

// Pega a capa do primeiro livro da lista, se houver itens
function firstCover(list) {
  return list.items?.[0]?.book?.coverUrl || null
}

// ---------- Listas (código original, sem alterações) ----------
async function fetchLists() {
  loading.value = true
  error.value = null

  try {
    // Rota pública (getLists) x rota do próprio usuário (getMyLists)
    const endpoint = props.userId
      ? `${API_URL}/lists/${props.userId}`
      : `${API_URL}/lists/me`

    const token = localStorage.getItem('token')

    const res = await fetch(endpoint, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })

    if (!res.ok) {
      throw new Error('Não foi possível carregar as listas.')
    }

    const data = await res.json()
    lists.value = data
    currentPage.value = 1
  } catch (err) {
    error.value = err.message || 'Erro ao buscar listas.'
  } finally {
    loading.value = false
  }
}

// ---------- Nome do usuário (independente das listas) ----------
async function fetchUserName() {
  userName.value = ''

  try {
    const username = route.params.username

    if (username) {
      // Mesma rota que a página de perfil usa
      const { data } = await api.get(`/users/${username}`)
      userName.value = data.name || ''
    } else {
      // Sem username na rota: usuário logado
      const logged = JSON.parse(localStorage.getItem('user') || 'null')
      userName.value = logged?.name || ''
    }
  } catch (err) {
    console.error(err)
  }
}

onMounted(() => {
  fetchLists()
  fetchUserName()
})

watch(() => props.userId, fetchLists)
watch(() => route.params.username, fetchUserName)
</script>