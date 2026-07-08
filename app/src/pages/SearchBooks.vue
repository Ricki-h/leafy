<script setup>
import { ref } from 'vue';
import SearchBar from '../components/SearchBar.vue';
import Template from './base/Template.vue';
import Loading from '../components/Loading.vue';

const resultados = ref([])
const carregando = ref(false)

function handleResults(data) {
    resultados.value = data
}

function descricaoFormatada(descricao, max) {
    if (descricao?.length > max) {
        return descricao.substring(0, max) + '...'
    }
    return descricao
}

</script>

<template>
    <Template variant="left">
        <div class="flex flex-col h-full border-r border-[#5A6270] px-8">
            <SearchBar endpoint="/books/search" @results="handleResults" @loading="v => carregando = v" class="mb-8 mt-4"></SearchBar>

            <div class="flex items-center justify-center" v-if="carregando" >
                <Loading></Loading>
            </div>
            <div v-else class="grid grid-cols-2 overflow-y-auto gap-8 py-4">
                <div v-for="book in resultados" :key="book.id" class="flex gap-6">
                    <img :src="book.coverUrl || '../../assets/sem imagem.png'" alt="book cover" class="h-48 max-w-32 object-cover">
                    <div class="flex flex-col justify-between">
                        <div class="flex flex-col gap-3">
                            <h3 class="font-bold text-[#CCD6E5] font-inter text-xl">{{ book.title }}</h3>
                            <p class="font-inter text-sm text-[#6E7684]">{{ book.description ? descricaoFormatada(book.description, 120) : 'Livro sem descrição encontrada' }}</p>
                        </div>

                        <RouterLink class="w-full text-center px-4 py-2 bg-[#CCD6E5] hover:bg-[#682B9C] text-[#0E121A] hover:text-[#CCD6E5] font-bold rounded-full " :to="`/books/${book.id}`">Ver detalhes</RouterLink>
                    </div>
                </div>
            </div>
        </div>
    </Template>
</template>