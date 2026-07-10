<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Template from './base/Template.vue'
import api from '../services/api.js'

const route = useRoute()

const list = ref(null)
const loading = ref(true)
const error = ref(null)

const bookCount = computed(() => list.value?.items?.length || 0)

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
                        <h2 class="text-2xl font-bold ">
                            {{ list.name }}
                        </h2>
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

                <div v-if="bookCount === 0" class="text-center text-white/70 py-10">
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

                </div>
            </template>
        </section>
    </Template>
</template>