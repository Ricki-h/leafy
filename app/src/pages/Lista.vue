<script setup>
import { ref } from 'vue'
import Template from './base/Template.vue';
defineProps({
  lists: {
    type: Array,
    default: () => [
      { name: 'Lista de favoritos' },
      { name: 'Próximos para ler' },
      { name: 'Quero ler' },
      { name: 'Estou lendo' },
      { name: 'Livros de romance' },
      { name: 'Livros de aventura' },
      { name: 'Livros de comédia' },
      { name: 'Livros de aventura' },
    ],
  },
  totalPages: {
    type: Number,
    default: 3,
  },
})

const currentPage = ref(1)
</script>

<template>
    <Template variant="left">
        <section class="w-full h-full px-10 py-10">
            <div class="flex items-center gap-x-6 mb-6">
                <div class="w-[223px] h-[223px] bg-gray-200">

                </div>
                <div class="flex flex-col gap-4">
                    <h2 class="text-2xl font-bold ">
                        Titulo
                    </h2>
                    <div class="flex items-center gap-2">
                        <p class="text-[#2BA69C]">
                            @user
                        </p>
                        <button class="px-3 py-2 bg-gray-200 text-black rounded-[50px]">
                            33 livros
                        </button>

                    </div>
                </div>
            </div>
            <div class="w-full max-w-[876px] mx-auto h-[2px] bg-pink-500 mb-10"></div>
            <div class="grid grid-cols-4 overflow-y-auto max-w-[876px] max-h-[360px] max-lg:max-h-[380px] justify-between gap-x-6 gap-y-8">
                <div v-for="(list, index) in lists" :key="index" class="flex flex-col mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-full h-auto " viewBox="0 0 155 231" fill="none">
                        <path d="M0.5 230.5V0.5H154.413V230.5H0.5ZM0.5 0.5L77.5 115.5M0.5 230.5L77.5 115.5M154.5 0.5L77.5 115.5M77.5 115.5L154.5 230.5" stroke="black"/>
                    </svg>
                    <p class="font-semibold text-[#FFD4E8] ">
                        Titulo
                    </p>
                    <p class="text-xs">
                        Autor(a)
                    </p>

                </div>

            </div>
        </section>
    </Template>
</template>