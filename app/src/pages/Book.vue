<script setup>
import { onMounted, ref } from 'vue';
import Loading from '../components/Loading.vue';
import Template from './base/Template.vue';
import CriarPost from '../components/CriarPost.vue';
import ModalEscolherLista from '../components/ModalEscolherLista.vue';
import api from '../services/api.js';
import { useRoute } from 'vue-router';

const loading = ref(false)
const book = ref(null)
const showModal = ref(false)
const showListModal = ref(false)

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

function voltar() {
    window.history.back()
}
function handlePostar(dados) {
    
    try {
        api.post(`/resenhas/:bookid`)
        console.log('avaliação enviada:', dados)
    }
    
    catch(err) {
        console.error(err)
    }
    showModal.value = false
}
onMounted(async () => {
    await loadBook()
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
            <div v-if="book" class="flex gap-8 items-center justify-center h-full px-8">
                <img :src="book.coverUrl" alt="Book cover" class="w-80 h-120 object-cover">
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
                            <p class="text-sm text-[#6E7684]">{{ book.pageCount || 'Sem info' }}</p>
                        </div>
                        <div class="flex gap-2">
                            <div v-for="genre in book.genres" :key="genre.id" class="px-6 py-1 bg-[#682B9C] text-sm text-[#CCD6E5] rounded-full font-inter font-bold">
                                {{ genre.name }}
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-col gap-2">
                        <p class="text-sm/6 text-[#CCD6E5] font-inter">{{ book.description }}</p>
                        <p class="font-semibold text-[#FF82BD]">{{ book.isbn || 'Código IBSN não encontrado' }}</p>
                    </div>
                    <div class="flex flex-col gap-4">
                        <button class="w-full text-center px-4 py-2 bg-[#CCD6E5] hover:bg-[#2BA69C] text-[#0E121A] font-bold rounded-full" @click="showListModal = true">Adicionar a uma lista</button>
                        <div class="flex gap-4">
                            <button class="w-full text-center px-4 py-2 bg-[#CCD6E5] hover:bg-[#FF82BD] text-[#0E121A] font-bold rounded-full">Avaliar</button>
                            <button class="w-full text-center px-4 py-2 bg-[#CCD6E5] hover:bg-[#FF82BD] text-[#0E121A] font-bold rounded-full" @click="showModal = true">Escrever uma resenha</button>
                        </div>
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
        </div>
    </Template>
</template>