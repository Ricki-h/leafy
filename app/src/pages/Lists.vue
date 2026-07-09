<template>
    <Template variant="left">
          <div class="w-full h-full overflow-y-auto bg-[#151823] px-6 py-6">
            <!-- Title -->
            <h1 class="text-center text-2xl font-bold text-white mb-4">
            Listas de <span class="text-teal-400">usuário</span>
            </h1>

            <!-- Divider -->
            <div class="w-full max-w-[826px] mx-auto h-[2px] bg-pink-500 mb-10"></div>

            <!-- Grid -->
            <div class="max-w-[826px] mx-auto grid grid-cols-2 sm:grid-cols-4 gap-x-10 gap-y-5">
            <div
                v-for="(list, index) in lists"
                :key="index"
                class="flex flex-col items-center"
            >
                <div class="relative w-full aspect-[3/4] bg-gray-300 rounded-sm overflow-hidden">
                <svg class="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <line x1="0" y1="0" x2="100" y2="100" stroke="#4b5563" stroke-width="0.5" />
                    <line x1="100" y1="0" x2="0" y2="100" stroke="#4b5563" stroke-width="0.5" />
                </svg>
                </div>

                <span class="mt-3 text-white text-sm font-medium text-center">
                {{ list.name }}
                </span>
            </div>
            </div>

            <!-- Pagination -->
            <div class="flex items-center justify-center gap-3 mt-10">
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