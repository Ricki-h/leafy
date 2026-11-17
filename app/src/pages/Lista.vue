<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import Template from './base/Template.vue'
import api from '../services/api.js'

const route = useRoute()

const list = ref(null)
const loading = ref(true)
const error = ref(null)

const editing = ref(false)
const newName = ref('')
const saving = ref(false)
const editError = ref('')
const nameInput = ref(null)

const bookCount = computed(() => list.value?.items?.length || 0)

// Só o dono da lista vê o botão "+" e o de editar o nome
const isOwner = computed(() => {
  const logged = JSON.parse(localStorage.getItem('user') || 'null')
  if (!logged || !list.value?.user) return false

  return logged.username === list.value.user.username
})

async function loadList() {
  loading.value = true
  error.value = null
  try {
    const { data } = await api.get(`/lists/${route.params.id}`)
    list.value = data

  } catch (err) {
    console.error(err)
    error.value = 'Não foi possível carregar essa lista.'
  } finally {
    loading.value = false
  }
}

async function startEdit() {
  newName.value = list.value.name
  editError.value = ''
  editing.value = true
  await nextTick()
  nameInput.value?.focus()
  nameInput.value?.select()
}

function cancelEdit() {
  editing.value = false
  editError.value = ''
}

async function saveName() {
  const name = newName.value.trim()

  if (!name) {
    editError.value = 'O nome não pode ficar vazio.'
    return
  }

  if (name === list.value.name) {
    cancelEdit()
    return
  }

  saving.value = true
  editError.value = ''
  try {
    await api.patch(`/lists/${list.value.id}`, { name })
    list.value.name = name
    editing.value = false
  } catch (err) {
    console.error(err)
    editError.value = err.response?.data?.error || 'Não foi possível renomear a lista.'
  } finally {
    saving.value = false
  }
}

onMounted(loadList)
</script>

<template>
    <Template variant="left">
        <section class="w-full h-full px-10 py-10">

            <!-- Loading -->
            <div v-if="loading" class="text-center text-white/70 py-10">
              Carregando lista...
            </div>

            <!-- Erro -->
            <div v-else-if="error" class="text-center text-red-400 py-10">
              {{ error }}
            </div>

            <template v-else-if="list">
                <div class="flex items-center gap-x-6 mb-6">
                    <div class="w-[223px] h-[223px] bg-gray-200 overflow-hidden">
                        <img
                            v-if="list.user.avatarUrl"
                            :src="list.user.avatarUrl"
                            :alt="list.user.username"
                            class="w-full h-full object-cover"
                        />
                    </div>
                    <div class="flex flex-col gap-4">
                        <!-- Nome da lista (visualização) -->
                        <div v-if="!editing" class="flex items-center gap-3">
                            <h2 class="text-2xl font-bold ">
                                {{ list.name }}
                            </h2>
                            <button
                                v-if="isOwner"
                                type="button"
                                class="p-2 rounded-full text-white/60 hover:text-[#2BA69C] hover:bg-white/5 transition-colors cursor-pointer"
                                aria-label="Editar nome da lista"
                                title="Editar nome"
                                @click="startEdit"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                        </div>

                        <!-- Nome da lista (edição) -->
                        <div v-else class="flex flex-col gap-2">
                            <div class="flex items-center gap-2">
                                <input
                                    ref="nameInput"
                                    v-model="newName"
                                    type="text"
                                    maxlength="100"
                                    class="bg-transparent border-b border-white/30 focus:border-[#2BA69C] outline-none text-2xl font-bold text-white pb-1 w-full max-w-[360px]"
                                    :disabled="saving"
                                    @keyup.enter="saveName"
                                    @keyup.esc="cancelEdit"
                                />
                                <button
                                    type="button"
                                    class="px-3 py-1 rounded-full bg-[#CCD6E5] text-[#0E121A] font-bold hover:bg-[#2BA69C] transition-colors disabled:opacity-50 cursor-pointer"
                                    :disabled="saving || !newName.trim()"
                                    aria-label="Salvar nome"
                                    @click="saveName"
                                >
                                    {{ saving ? '...' : '✓' }}
                                </button>
                                <button
                                    type="button"
                                    class="px-3 py-1 rounded-full border border-white/40 text-white hover:bg-white/10 transition-colors cursor-pointer"
                                    :disabled="saving"
                                    aria-label="Cancelar edição"
                                    @click="cancelEdit"
                                >
                                    ✕
                                </button>
                            </div>
                            <p v-if="editError" class="text-red-400 text-sm">{{ editError }}</p>
                        </div>

                        <div class="flex items-center gap-2">
                            <p class="text-[#2BA69C]">
                                @{{ list.user?.username || 'usuário' }}
                            </p>
                            <button class="px-3 py-2 bg-gray-200 text-black rounded-[50px]">
                                {{ bookCount }} {{ bookCount === 1 ? 'livro' : 'livros' }}
                            </button>

                        </div>
                    </div>
                </div>
                <div class="w-full max-w-[876px] mx-auto h-[2px] bg-pink-500 mb-10"></div>

                <div v-if="bookCount === 0 && !isOwner" class="text-center text-white/70 py-10">
                  Essa lista ainda não tem livros.
                </div>

                <div v-else class="grid grid-cols-4 overflow-y-auto max-w-[876px] max-h-[360px] max-lg:max-h-[380px] justify-between gap-x-6 gap-y-8">
                    <router-link
                        v-for="item in list.items"
                        :key="item.book.id"
                        :to="`/books/${item.book.id}`"
                        class="flex flex-col mb-4 cursor-pointer"
                    >
                        <img
                            v-if="item.book.coverUrl"
                            :src="item.book.coverUrl"
                            :alt="item.book.title"
                            class="w-full aspect-[155/231] object-cover"
                        />
                        <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-full h-auto " viewBox="0 0 155 231" fill="none">
                            <path d="M0.5 230.5V0.5H154.413V230.5H0.5ZM0.5 0.5L77.5 115.5M0.5 230.5L77.5 115.5M154.5 0.5L77.5 115.5M77.5 115.5L154.5 230.5" stroke="black"/>
                        </svg>
                        <p class="font-semibold text-[#FFD4E8] ">
                            {{ item.book.title }}
                        </p>
                        <p class="text-xs">
                            {{ item.book.author?.name || 'Autor(a) desconhecido(a)' }}
                        </p>

                    </router-link>

                    <!-- Botão: adicionar livros (vai para a busca) -->
                    <router-link
                        v-if="isOwner"
                        to="/books"
                        class="flex flex-col mb-4 cursor-pointer group"
                        aria-label="Buscar livros"
                    >
                        <div class="w-full aspect-[155/231] border-2 border-dashed border-white/30 flex items-center justify-center group-hover:border-[#2BA69C] group-hover:bg-white/5 transition-colors">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" class="text-white/60 group-hover:text-[#2BA69C] transition-colors">
                                <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
                            </svg>
                        </div>
                    </router-link>

                </div>
            </template>
        </section>
    </Template>
</template>