<script setup>
import { onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import Template from './base/Template.vue'
import api from '../services/api.js'

const route = useRoute()
const router = useRouter()

const user = ref(null)
const reviews = ref([])
const loading = ref(true)
const error = ref(null)

// Chaves = nomes dos campos da API (cada critério vai de 1 a 5)
const criterios = [
  { chave: 'writing', label: 'Escrita' },
  { chave: 'plot', label: 'Narrativa' },
  { chave: 'characters', label: 'Personagens' },
  { chave: 'pacing', label: 'Ritmo' },
  { chave: 'emotionalImpact', label: 'Impacto' },
  { chave: 'worldbuilding', label: 'Mundo' },
]

async function load() {
  loading.value = true
  error.value = null

  try {
    const { data: userData } = await api.get(`/users/${route.params.username}`)
    user.value = userData

    const { data } = await api.get(`/resenhas/user/${userData.id}`)
    reviews.value = data
  } catch (err) {
    console.error(err)
    error.value = err.response?.data?.error || 'Não foi possível carregar as resenhas.'
  } finally {
    loading.value = false
  }
}

function voltar() {
  router.push(`/users/${route.params.username}`)
}

onMounted(load)
watch(() => route.params.username, load)
</script>

<template>
    <Template>
        <div class="flex flex-col h-screen">
            <!-- Cabeçalho -->
            <div class="flex items-center gap-6 border-b border-[#5A6270] px-8 py-6">
                <button @click="voltar" class="flex items-center gap-2 hover:cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="9" height="16" viewBox="0 0 12 19" fill="none">
                        <path d="M4.01878 9.4335L10.618 16.0327C10.9282 16.3429 11.0833 16.7378 11.0833 17.2172C11.0833 17.6966 10.9282 18.0915 10.618 18.4017C10.3078 18.7119 9.91296 18.867 9.43353 18.867C8.9541 18.867 8.55927 18.7119 8.24905 18.4017L0.465355 10.618C0.296144 10.4488 0.176569 10.2655 0.106628 10.068C0.0366879 9.87063 0.0011541 9.65912 2.60328e-05 9.4335C-0.00110204 9.20789 0.0344318 8.99637 0.106628 8.79896C0.178825 8.60155 0.2984 8.41824 0.465355 8.24903L8.24905 0.465329C8.55927 0.155109 8.9541 0 9.43353 0C9.91296 0 10.3078 0.155109 10.618 0.465329C10.9282 0.775549 11.0833 1.17037 11.0833 1.64981C11.0833 2.12924 10.9282 2.52406 10.618 2.83428L4.01878 9.4335Z" fill="#CCD6E5"/>
                    </svg>
                </button>

                <div v-if="user" class="flex items-center gap-3">
                    <img
                        v-if="user.avatarUrl"
                        :src="user.avatarUrl"
                        alt=""
                        class="w-12 h-12 rounded-full object-cover bg-gray-300"
                    />
                    <div v-else class="w-12 h-12 rounded-full bg-gray-300"></div>

                    <div>
                        <h6 class="text-xl font-bold leading-tight">Resenhas de {{ user.name }}</h6>
                        <p class="text-sm text-[#5A6270]">{{ '@' + user.username }}</p>
                    </div>
                </div>
            </div>

            <!-- Conteúdo -->
            <div class="flex-1 overflow-y-auto">
                <div v-if="loading" class="text-center text-white/70 py-10">
                    Carregando resenhas...
                </div>

                <div v-else-if="error" class="text-center text-red-400 py-10">
                    {{ error }}
                </div>

                <div v-else-if="reviews.length === 0" class="text-center text-white/70 py-10">
                    Nenhuma resenha publicada ainda.
                </div>

                <template v-else>
                    <article
                        v-for="review in reviews"
                        :key="review.id"
                        class="px-8 py-5 flex gap-4 border-b border-[#5A6270]"
                    >
                        <!-- Capa -->
                        <RouterLink :to="`/books/${review.book?.id}`" class="shrink-0 w-20">
                            <img
                                v-if="review.book?.coverUrl"
                                :src="review.book.coverUrl"
                                :alt="review.book.title"
                                class="w-full aspect-[155/231] object-cover"
                            />
                            <div v-else class="w-full aspect-[155/231] bg-gray-300"></div>
                        </RouterLink>

                        <div class="flex-1 min-w-0 flex flex-col gap-3">
                            <div class="flex items-start justify-between gap-3">
                                <RouterLink
                                    :to="`/books/${review.book?.id}`"
                                    class="font-semibold text-[#FFD4E8] hover:underline"
                                >
                                    {{ review.book?.title || 'Livro' }}
                                </RouterLink>

                                <!-- Nota geral (0 a 10, calculada no servidor) -->
                                <span class="shrink-0 px-3 py-1 rounded-full bg-[#2BA69C] text-[#0E121A] font-bold text-sm">
                                    {{ review.score }}/10
                                </span>
                            </div>

                            <!-- Notas por critério (1 a 5) -->
                            <div class="flex flex-wrap gap-2">
                                <template v-for="c in criterios" :key="c.chave">
                                    <span
                                        v-if="review[c.chave] !== null && review[c.chave] !== undefined"
                                        class="px-2 py-0.5 rounded-full border border-white/20 text-xs text-[#CCD6E5]"
                                    >
                                        {{ c.label }}: <b>{{ review[c.chave] }}/5</b>
                                    </span>
                                </template>
                            </div>

                            <p v-if="review.body" class="text-[#CCD6E5] text-sm whitespace-pre-line">
                                {{ review.body }}
                            </p>
                        </div>
                    </article>
                </template>
            </div>
        </div>
    </Template>
</template>