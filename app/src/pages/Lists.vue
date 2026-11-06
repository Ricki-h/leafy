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

            <!-- Vazio (só para quem não pode criar listas) -->
            <div v-else-if="lists.length === 0 && !isOwner" class="text-center text-white/70 py-10">
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

            <!-- Botão: criar nova lista -->
            <button
                v-if="isOwner && currentPage === totalPages"
                type="button"
                class="flex flex-col items-center cursor-pointer group"
                aria-label="Criar nova lista"
                @click="showCreateModal = true"
            >
                <div class="w-full aspect-[3/4] rounded-sm border-2 border-dashed border-white/30 flex items-center justify-center group-hover:border-teal-400 group-hover:bg-white/5 transition-colors">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" class="text-white/60 group-hover:text-teal-400 transition-colors">
                        <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
                    </svg>
                </div>
            </button>
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

        <ModalCriarLista
            v-if="showCreateModal"
            @close="showCreateModal = false"
            @criada="handleListaCriada"
        />
    </Template>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import Template from './base/Template.vue'
import ModalCriarLista from '../components/ModalCriarLista.vue'
import api from '../services/api.js'

const props = defineProps({
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
const showCreateModal = ref(false)

const totalPages = computed(() =>
  Math.max(1, Math.ceil(lists.value.length / props.itemsPerPage))
)

const paginatedLists = computed(() => {
  const start = (currentPage.value - 1) * props.itemsPerPage
  return lists.value.slice(start, start + props.itemsPerPage)
})

function getLoggedUser() {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null')
  } catch {
    return null
  }
}

// A página é do usuário logado quando não há username na rota ou ele é o mesmo
const isOwner = computed(() => {
  const logged = getLoggedUser()
  if (!logged) return false

  const username = route.params.username
  return !username || logged.username === username
})

// Pega a capa do primeiro livro da lista, se houver itens
function firstCover(list) {
  return list.items?.[0]?.book?.coverUrl || null
}

async function load() {
  loading.value = true
  error.value = null

  try {
    const username = route.params.username
    const logged = getLoggedUser()

    let endpoint = '/lists/me'

    if (username) {
      // Mesma rota que a página de perfil usa
      const { data: user } = await api.get(`/users/${username}`)
      userName.value = user.name || ''

      // Listas do próprio usuário usam /lists/me; as de outros, a rota pública
      if (logged?.username !== username) {
        // AJUSTE AQUI se a rota pública do seu listRoutes for outra
        endpoint = `/lists/user/${user.id}`
      }
    } else {
      userName.value = logged?.name || ''
    }

    const { data } = await api.get(endpoint)
    lists.value = data
    currentPage.value = 1
  } catch (err) {
    console.error(err)
    error.value = err.response?.data?.error || 'Não foi possível carregar as listas.'
  } finally {
    loading.value = false
  }
}

// Lista criada no modal: entra no grid e a página pula para onde ela está
function handleListaCriada(newList) {
  newList.items = newList.items || []
  lists.value = [...lists.value, newList]
  currentPage.value = totalPages.value
  showCreateModal.value = false
}

onMounted(load)
watch(() => route.params.username, load)
</script>