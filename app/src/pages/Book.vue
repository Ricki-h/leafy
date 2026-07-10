<script setup>
import { onMounted, ref } from 'vue';
import Loading from '../components/Loading.vue';
import Template from './base/Template.vue';
import CriarPost from '../components/CriarPost.vue';
import ModalEscolherLista from '../components/ModalEscolherLista.vue';
import AvaliarLivro from '../components/AvaliarLivro.vue'
import api from '../services/api.js';
import { useRoute } from 'vue-router';

const loading = ref(false)
const book = ref(null)
const showModal = ref(false)
const showListModal = ref(false)
const showRatingModal = ref(false)

const ratingsData = ref(null)

const route = useRoute()
async function loadBook() {
    try {
        const { data } = await api.get(`/books/${route.params.id}`)
    
        book.value = data
    }
    catch(err) {
        console.error(err)
    }
}

async function loadRatings() {
    try {
        const { data } = await api.get(`/ratings/${route.params.id}`)

        ratingsData.value = data
    }
    catch(err) {
        console.error(err)
    }
}

function voltar() {
    window.history.back()
}
function handlePostar(dados) {
    
    try {
        api.post(`/resenhas/${book.id}`)
        console.log('avaliação enviada:', dados)
    }
    
    catch(err) {
        console.error(err)
    }
    showModal.value = false
}
onMounted(async () => {
    await loadBook()
    await loadRatings()
})
</script>

<template>
    <Template variant="left">
        <div class="flex flex-col h-full border-r border-[#5A6270]">
            <div class="py-4 border-b border-[#5A6270] px-8">
                <button @click="voltar" class="flex items-center gap-2 hover:cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="9" height="16" viewBox="0 0 12 19" fill="none">
                        <path d="M4.01878 9.4335L10.618 16.0327C10.9282 16.3429 11.0833 16.7378 11.0833 17.2172C11.0833 17.6966 10.9282 18.0915 10.618 18.4017C10.3078 18.7119 9.91296 18.867 9.43353 18.867C8.9541 18.867 8.55927 18.7119 8.24905 18.4017L0.465355 10.618C0.296144 10.4488 0.176569 10.2655 0.106628 10.068C0.0366879 9.87063 0.0011541 9.65912 2.60328e-05 9.4335C-0.00110204 9.20789 0.0344318 8.99637 0.106628 8.79896C0.178825 8.60155 0.2984 8.41824 0.465355 8.24903L8.24905 0.465329C8.55927 0.155109 8.9541 0 9.43353 0C9.91296 0 10.3078 0.155109 10.618 0.465329C10.9282 0.775549 11.0833 1.17037 11.0833 1.64981C11.0833 2.12924 10.9282 2.52406 10.618 2.83428L4.01878 9.4335Z" fill="#CCD6E5"/>
                    </svg>
                    <span>voltar</span>
                </button>
            </div>
            <div v-if="book" class="flex gap-8 py-8 border-b border-[#5A6270] px-8">
                <div class="flex flex-col gap-4 justify-between">
                    <div class="flex flex-col gap-2">
                        <h2 class="font-inter font-bold text-2xl text-[#CCD6E5]">{{ book.title }}</h2>
                        <div class="flex gap-6">
                            <p class="text-sm text-[#6E7684]">{{ book.author.name }}</p>
                            <p class="text-sm text-[#6E7684]">-</p>
                            <p class="text-sm text-[#6E7684]">{{ book.publishedYear }}</p>
                            <p class="text-sm text-[#6E7684]">-</p>
                            <p class="text-sm text-[#6E7684]">{{ book.publisher }}</p>
                            <p class="text-sm text-[#6E7684]">-</p>
                            <p class="text-sm text-[#6E7684]">{{ book.pageCount + ' pags' || '??? pags' }}</p>
                        </div>
                        <div class="flex gap-2">
                            <div v-for="genre in book.genres" :key="genre.id" class="px-6 py-1 bg-[#682B9C] text-sm text-[#CCD6E5] rounded-full font-inter font-bold">
                                {{ genre.name }}
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-col gap-2">
                        <p class="text-sm/6 text-[#CCD6E5] font-inter max-h-50 overflow-y-auto">{{ book.description }}</p>
                        <p class="font-semibold text-[#FF82BD]">{{ book.isbn || 'Código IBSN não encontrado' }}</p>
                    </div>
                    <div class="flex flex-col gap-4">
                        <button class="hover:cursor-pointer w-full text-center px-4 py-2 bg-[#CCD6E5] hover:bg-[#2BA69C] text-[#0E121A] font-bold rounded-full" @click="showListModal = true">Adicionar a uma lista</button>
                        <div class="flex gap-4">
                            <button @click="showRatingModal = true" class="hover:cursor-pointer w-full text-center px-4 py-2 bg-[#CCD6E5] hover:bg-[#FF82BD] text-[#0E121A] font-bold rounded-full">Avaliar</button>
                            <button class="hover:cursor-pointer w-full text-center px-4 py-2 bg-[#CCD6E5] hover:bg-[#FF82BD] text-[#0E121A] font-bold rounded-full" @click="showModal = true">Escrever uma resenha</button>
                        </div>
                    </div>
                </div>
                <img :src="book.coverUrl" alt="Book cover" class="w-80 h-120 object-cover">
            </div>

            <div v-if="ratingsData" class="flex flex-col">
                <div class="flex items-center gap-3 px-8 py-4 border-b border-[#5A6270]">
                    <span class="text-2xl font-bold text-[#CCD6E5]">{{ ratingsData.average || '—' }}</span>
                    <span class="text-[#5A6270] text-sm">
                        {{ ratingsData.total }} {{ ratingsData.total === 1 ? 'avaliação' : 'avaliações' }}
                    </span>
                </div>

                <div v-if="ratingsData.ratings.length === 0" class="px-8 py-6 text-[#5A6270] text-sm">
                    Nenhuma avaliação ainda. Seja o primeiro a avaliar!
                </div>

                <div
                    v-for="rating in ratingsData.ratings"
                    :key="rating.id"
                    class="px-8 py-4 flex gap-3 border-b border-[#5A6270]"
                >
                    <RouterLink :to="`/users/${rating.user.username}`" class="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                        <img :src="rating.user.avatarUrl" alt="" class="w-full h-full object-cover">
                    </RouterLink>

                    <div class="flex flex-col gap-2 flex-1">
                        <div class="flex items-center gap-2">
                            <p class="text-[#CCD6E5] text-sm font-semibold">{{ rating.user.name }}</p>
                            <p class="text-[#5A6270] text-sm">{{ '@' + rating.user.username }}</p>
                        </div>

                        <div class="flex gap-0.5">
                            <svg v-for="n in 5" :key="n" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 20 20" fill="none" class="mr-1">
                                <path d="M20 11.6206C20 11.2383 18.3917 11.3428 18.2639 11.065C18.1361 10.7872 20.0461 8.51833 19.7683 8.00944C19.4906 7.50056 16.9428 8.65778 16.7822 8.40278C16.6222 8.14833 16.9444 6.45833 16.6667 6.25C16.3889 6.04167 13.75 8.98111 13.3794 8.63444C13.0089 8.28778 14.2361 2.80111 13.9828 2.69111C13.7294 2.58111 12.0833 3.44944 11.8756 3.40333C11.6678 3.35667 10.3789 0 10 0C9.62111 0 8.33222 3.35667 8.12444 3.40278C7.91667 3.44889 6.27056 2.58056 6.01722 2.69056C5.76389 2.80056 6.99056 8.28667 6.62 8.63389C6.25 8.98111 3.61111 6.04167 3.33333 6.25C3.05556 6.45833 3.37778 8.14833 3.21778 8.40278C3.05722 8.65722 0.509444 7.5 0.231667 8.00944C-0.0461111 8.51889 1.86444 10.7872 1.73611 11.065C1.60778 11.3428 0 11.2383 0 11.6206C0 12.0028 4.68778 14.5289 5 14.8267C5.31222 15.1244 3.38111 16.3833 3.65722 16.6206C3.97722 16.8961 5.79 16.1594 9.44444 16.0889V19.4444C9.44444 19.5918 9.50298 19.7331 9.60716 19.8373C9.71135 19.9415 9.85266 20 10 20C10.1473 20 10.2887 19.9415 10.3928 19.8373C10.497 19.7331 10.5556 19.5918 10.5556 19.4444V16.0889C14.2094 16.1594 16.0228 16.8961 16.3428 16.6206C16.6183 16.3828 14.6878 15.1239 15 14.8267C15.3122 14.5294 20 12.0022 20 11.6206Z"
                                    :fill="rating.leafs >= n ? '#2BA69C' : '#5A6270'"
                                />
                            </svg>
                        </div>

                        <p v-if="rating.comment" class="text-[#CCD6E5] text-sm">
                            {{ rating.comment }}
                        </p>
                    </div>
                </div>
            </div>

            <CriarPost
                v-if="showModal"
                @close="showModal = false"
                @postar="handlePostar"
            />
            <ModalEscolherLista
                v-if="showListModal"
                :book-id="book?.id"
                :book-title="book?.title"
                @close="showListModal = false"
            />
            <AvaliarLivro
                v-if="showRatingModal"
                :book-id="book?.id"
                :book-title="book?.title"
                @close="showRatingModal = false"
                @avaliado="() => { showRatingModal = false; loadRatings() }"
            />
        </div>
    </Template>
</template>