<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import Template from './base/Template.vue';
import Loading from '../components/Loading.vue';
import api from '../services/api.js';

const route = useRoute();
const router = useRouter();

const review = ref(null);
const loading = ref(true);
const error = ref(null);

const criterios = [
    { chave: 'writing', label: 'Escrita' },
    { chave: 'plot', label: 'Narrativa' },
    { chave: 'characters', label: 'Personagens' },
    { chave: 'pacing', label: 'Ritmo' },
    { chave: 'emotionalImpact', label: 'Impacto' },
    { chave: 'worldbuilding', label: 'Mundo' },
];

const corNotaGeral = computed(() => {
    const nota = Number(review.value?.score);
    if (nota >= 9) return 'bg-[#A855F7]';
    if (nota >= 5) return 'bg-[#2BA69C]';
    return 'bg-[#F472B6]';
});

async function loadReview() {
    loading.value = true;
    error.value = null;

    try {
        const { data } = await api.get(`/resenhas/${route.params.id}`);
        review.value = data;
    } catch (err) {
        console.error(err);
        error.value = err.response?.data?.error || 'Não foi possível carregar a resenha.';
    } finally {
        loading.value = false;
    }
}

function formatarData(dataIso) {
    if (!dataIso) return '';
    return new Date(dataIso).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
}

function voltar() {
    if (window.history.length > 1) {
        router.back();
    } else if (review.value?.book?.id) {
        router.push(`/books/${review.value.book.id}`);
    } else {
        router.push('/');
    }
}

onMounted(loadReview);
watch(() => route.params.id, loadReview);
</script>

<template>
    <Template variant="left">
        <div class="flex flex-col h-full border-r border-[#5A6270] overflow-y-auto">
            <!-- Cabeçalho -->
            <div class="py-4 border-b border-[#5A6270] px-8 flex items-center gap-4">
                <button @click="voltar" class="flex items-center gap-2 hover:cursor-pointer text-[#CCD6E5]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="9" height="16" viewBox="0 0 12 19" fill="none">
                        <path d="M4.01878 9.4335L10.618 16.0327C10.9282 16.3429 11.0833 16.7378 11.0833 17.2172C11.0833 17.6966 10.9282 18.0915 10.618 18.4017C10.3078 18.7119 9.91296 18.867 9.43353 18.867C8.9541 18.867 8.55927 18.7119 8.24905 18.4017L0.465355 10.618C0.296144 10.4488 0.176569 10.2655 0.106628 10.068C0.0366879 9.87063 0.0011541 9.65912 2.60328e-05 9.4335C-0.00110204 9.20789 0.0344318 8.99637 0.106628 8.79896C0.178825 8.60155 0.2984 8.41824 0.465355 8.24903L8.24905 0.465329C8.55927 0.155109 8.9541 0 9.43353 0C9.91296 0 10.3078 0.155109 10.618 0.465329C10.9282 0.775549 11.0833 1.17037 11.0833 1.64981C11.0833 2.12924 10.9282 2.52406 10.618 2.83428L4.01878 9.4335Z" fill="#CCD6E5"/>
                    </svg>
                    <span>voltar</span>
                </button>
            </div>

            <div v-if="loading" class="flex justify-center py-12">
                <Loading />
            </div>

            <div v-else-if="error" class="px-8 py-10 text-center text-red-400">
                {{ error }}
            </div>

            <article v-else-if="review" class="flex flex-col">
                <!-- Contexto do Livro + Autor + Nota Geral -->
                <div class="px-8 py-6 border-b border-[#5A6270] flex items-center justify-between gap-6">
                    <div class="flex items-center gap-5 min-w-0">
                        <RouterLink
                            v-if="review.book"
                            :to="`/books/${review.book.id}`"
                            class="shrink-0 w-20"
                        >
                            <img
                                v-if="review.book.coverUrl"
                                :src="review.book.coverUrl"
                                :alt="review.book.title"
                                class="w-full aspect-[155/231] object-cover"
                            />
                            <div v-else class="w-full aspect-[155/231] bg-white/10"></div>
                        </RouterLink>

                        <div class="flex flex-col gap-2 min-w-0">
                            <span class="text-xs uppercase tracking-wider text-[#6E7684] font-semibold">
                                Resenha de livro
                            </span>

                            <RouterLink
                                v-if="review.book"
                                :to="`/books/${review.book.id}`"
                                class="font-inter font-bold text-2xl text-[#CCD6E5] hover:text-[#FFD4E8] transition-colors truncate"
                            >
                                {{ review.book.title }}
                            </RouterLink>

                            <!-- Autor da resenha -->
                            <div v-if="review.user" class="flex items-center gap-2.5 mt-1">
                                <RouterLink :to="`/users/${review.user.username}`" class="w-7 h-7 rounded-full overflow-hidden shrink-0">
                                    <img :src="review.user.avatarUrl" alt="" class="w-full h-full object-cover">
                                </RouterLink>
                                <div class="flex flex-wrap items-center gap-x-2 text-sm">
                                    <RouterLink :to="`/users/${review.user.username}`" class="text-[#CCD6E5] font-semibold hover:underline">
                                        {{ review.user.name }}
                                    </RouterLink>
                                    <span class="text-[#6E7684]">{{ '@' + review.user.username }}</span>
                                    <span v-if="review.createdAt" class="text-[#5A6270]">• {{ formatarData(review.createdAt) }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Nota geral em destaque -->
                    <div
                        class="shrink-0 flex flex-col items-center justify-center px-5 py-3 rounded-2xl text-[#0E121A] transition-colors"
                        :class="corNotaGeral"
                    >
                        <span class="text-2xl font-extrabold leading-none">{{ review.score }}</span>
                        <span class="text-xs font-bold opacity-80">de 10</span>
                    </div>
                </div>

                <!-- Painel de Critérios -->
                <div class="px-8 py-5 border-b border-[#5A6270] grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <template v-for="c in criterios" :key="c.chave">
                        <div
                            v-if="review[c.chave] !== null && review[c.chave] !== undefined"
                            class="px-4 py-2.5 rounded-xl border border-[#5A6270]/70 bg-white/[0.02] flex items-center justify-between"
                        >
                            <span class="text-xs text-[#6E7684] font-medium">{{ c.label }}</span>
                            <span class="text-sm font-bold text-[#CCD6E5]">
                                {{ review[c.chave] }}<span class="text-[#6E7684] font-normal">/5</span>
                            </span>
                        </div>
                    </template>
                </div>

                <!-- Corpo completo da resenha -->
                <div class="px-8 py-8">
                    <p
                        v-if="review.body"
                        class="text-[#CCD6E5] font-inter text-base leading-7 whitespace-pre-line max-w-[68ch]"
                    >
                        {{ review.body }}
                    </p>
                    <p v-else class="text-[#5A6270] text-sm">
                        Esta resenha contém apenas as notas por critério.
                    </p>
                </div>
            </article>
        </div>
    </Template>
</template>