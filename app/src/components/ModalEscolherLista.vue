<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      @click.self="$emit('close')"
    >
      <div class="bg-[#151823] rounded-2xl p-6 w-[360px] max-h-[80vh] flex flex-col shadow-xl">
        <!-- Título -->
        <h2 class="font-inter font-bold text-lg text-white mb-5 leading-snug">
          Em qual lista você deseja pôr o livro
          <span class="text-[#FF82BD]">{{ bookTitle }}</span>?
        </h2>

        <!-- Loading -->
        <div v-if="loading" class="text-center text-white/70 py-6">
          Carregando suas listas...
        </div>

        <!-- Erro -->
        <div v-else-if="error" class="text-center text-red-400 py-6">
          {{ error }}
        </div>

        <!-- Vazio -->
        <div v-else-if="lists.length === 0" class="text-center text-white/70 py-6">
          Você ainda não tem nenhuma lista.
        </div>

        <!-- Lista de listas -->
        <div v-else class="flex flex-col gap-3 overflow-y-auto pr-1">
          <button
            v-for="list in lists"
            :key="list.id"
            type="button"
            class="flex items-center gap-4 text-left rounded-lg px-1 py-1 hover:bg-white/5 transition-colors disabled:opacity-50"
            :disabled="togglingId === list.id"
            @click="toggleBookInList(list)"
          >
            <div class="relative w-12 h-12 shrink-0 bg-gray-300 rounded-sm overflow-hidden">
              <img
                v-if="firstCover(list)"
                :src="firstCover(list)"
                :alt="list.name"
                class="w-full h-full object-cover"
              />
              <svg v-else class="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <line x1="0" y1="0" x2="100" y2="100" stroke="#4b5563" stroke-width="4" />
                <line x1="100" y1="0" x2="0" y2="100" stroke="#4b5563" stroke-width="4" />
              </svg>

              <!-- Marca de "já está na lista" -->
              <div
                v-if="isInList(list)"
                class="absolute inset-0 bg-[#2BA69C]/80 flex items-center justify-center"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>

            <span class="text-white text-sm">{{ list.name }}</span>
          </button>
        </div>

        <button
          type="button"
          class="mt-4 w-full text-center px-4 py-2 border border-white/30 text-white font-semibold rounded-full hover:bg-white/5"
          @click="showCreateModal = true"
        >
          + Criar nova lista
        </button>

        <button
          type="button"
          class="mt-3 w-full text-center px-4 py-2 bg-[#CCD6E5] hover:bg-[#FF82BD] text-[#0E121A] font-bold rounded-full"
          @click="$emit('close')"
        >
          Fechar
        </button>
      </div>
    </div>

    <ModalCriarLista
      v-if="showCreateModal"
      @close="showCreateModal = false"
      @criada="handleListaCriada"
    />
  </Teleport>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api.js'
import ModalCriarLista from './ModalCriarLista.vue'

const props = defineProps({
  bookId: {
    type: [String, Number],
    required: true,
  },
  bookTitle: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['close', 'atualizado'])

const lists = ref([])
const loading = ref(false)
const error = ref(null)
const togglingId = ref(null)
const showCreateModal = ref(false)

function firstCover(list) {
  return list.items?.[0]?.book?.coverUrl || null
}

function isInList(list) {
  return list.items?.some((item) => String(item.book?.id) === String(props.bookId))
}

async function loadLists() {
  loading.value = true
  error.value = null
  try {
    const { data } = await api.get('/lists/me')
    lists.value = data
  } catch (err) {
    console.error(err)
    error.value = 'Não foi possível carregar suas listas.'
  } finally {
    loading.value = false
  }
}

async function toggleBookInList(list) {
  togglingId.value = list.id
  try {
    if (isInList(list)) {
      await api.delete(`/lists/${list.id}/books/${props.bookId}`)
      list.items = list.items.filter(
        (item) => String(item.book?.id) !== String(props.bookId)
      )
    } else {
      await api.post(`/lists/${list.id}/books`, { bookId: props.bookId })
      list.items = [...(list.items || []), { book: { id: props.bookId } }]
    }
    emit('atualizado', list)
  } catch (err) {
    console.error(err)
    error.value = err.response?.data?.error || 'Não foi possível atualizar a lista.'
  } finally {
    togglingId.value = null
  }
}

// Quando uma lista nova é criada no modal filho, ela entra na lista local
// e o livro atual já é adicionado nela direto, já que é esse o objetivo do fluxo.
async function handleListaCriada(newList) {
  newList.items = newList.items || []
  lists.value = [...lists.value, newList]
  showCreateModal.value = false
  await toggleBookInList(newList)
}

onMounted(loadLists)
</script>