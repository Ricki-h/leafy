<script setup>
import { ref, onMounted, nextTick, onBeforeUnmount } from 'vue'
import api from '../services/api.js'
import autosize from 'autosize'

const props = defineProps(['bookId', 'bookTitle'])
const emit = defineEmits(['close', 'avaliado'])

const leafs = ref(0)
const hoverLeaf = ref(0)
const comment = ref('')
const loading = ref(false)
const textarea = ref(null)

const me = ref(JSON.parse(localStorage.getItem('user')))

async function loadExistingRating() {
    try {
        const { data } = await api.get(`/ratings/${props.bookId}`)
        const myRating = data.ratings.find(r => r.userId === me.value?.id)

        if (myRating) {
            leafs.value = myRating.leafs
            comment.value = myRating.comment || ''
        }
    } catch (err) {
        console.error(err)
    }
}

async function handleSubmit() {
    if (leafs.value === 0) return

    try {
        loading.value = true

        const { data } = await api.put(`/ratings/rate/${props.bookId}`, {
            leafs: leafs.value,
            comment: comment.value
        })

        emit('avaliado', data)
        emit('close')
    } catch (err) {
        console.error(err)
    } finally {
        loading.value = false
    }
}

onMounted(async () => {
    await loadExistingRating()
    await nextTick()
    autosize(textarea.value)
})

onBeforeUnmount(() => {
    if (textarea.value) autosize.destroy(textarea.value)
})
</script>

<template>
    <div class="fixed inset-0 flex w-full h-full bg-[#110B2A]/60 items-center justify-center z-50">
        <div class="flex items-start gap-4 bg-[#18202C] p-6 rounded-2xl w-140 border border-[#2E3B4E]">

            <img :src="me?.avatarUrl" alt="" class="w-16 h-16 rounded-full object-cover flex-shrink-0">

            <div class="flex flex-col gap-3 flex-1">
                <textarea
                    ref="textarea"
                    v-model="comment"
                    rows="3"
                    maxlength="500"
                    placeholder="O que achou desse livro?"
                    class="w-full resize-none overflow-hidden bg-transparent border-none focus:outline-none focus:ring-0 text-[#CCD6E5] placeholder-[#5A6270] text-lg"
                ></textarea>
                <div class="flex items-center gap-5">
                    <span class="text-[#CCD6E5] w-4 text-right">{{ leafs + ',0' }}</span>

                    <div class="flex gap-2">
                        <button
                            v-for="n in 5"
                            :key="n"
                            @click="leafs = n"
                            @mouseenter="hoverLeaf = n"
                            @mouseleave="hoverLeaf = 0"
                            class="hover:cursor-pointer transition-transform hover:scale-110"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M20 11.6206C20 11.2383 18.3917 11.3428 18.2639 11.065C18.1361 10.7872 20.0461 8.51833 19.7683 8.00944C19.4906 7.50056 16.9428 8.65778 16.7822 8.40278C16.6222 8.14833 16.9444 6.45833 16.6667 6.25C16.3889 6.04167 13.75 8.98111 13.3794 8.63444C13.0089 8.28778 14.2361 2.80111 13.9828 2.69111C13.7294 2.58111 12.0833 3.44944 11.8756 3.40333C11.6678 3.35667 10.3789 0 10 0C9.62111 0 8.33222 3.35667 8.12444 3.40278C7.91667 3.44889 6.27056 2.58056 6.01722 2.69056C5.76389 2.80056 6.99056 8.28667 6.62 8.63389C6.25 8.98111 3.61111 6.04167 3.33333 6.25C3.05556 6.45833 3.37778 8.14833 3.21778 8.40278C3.05722 8.65722 0.509444 7.5 0.231667 8.00944C-0.0461111 8.51889 1.86444 10.7872 1.73611 11.065C1.60778 11.3428 0 11.2383 0 11.6206C0 12.0028 4.68778 14.5289 5 14.8267C5.31222 15.1244 3.38111 16.3833 3.65722 16.6206C3.97722 16.8961 5.79 16.1594 9.44444 16.0889V19.4444C9.44444 19.5918 9.50298 19.7331 9.60716 19.8373C9.71135 19.9415 9.85266 20 10 20C10.1473 20 10.2887 19.9415 10.3928 19.8373C10.497 19.7331 10.5556 19.5918 10.5556 19.4444V16.0889C14.2094 16.1594 16.0228 16.8961 16.3428 16.6206C16.6183 16.3828 14.6878 15.1239 15 14.8267C15.3122 14.5294 20 12.0022 20 11.6206Z"
                                    :fill="(hoverLeaf || leafs) >= n ? '#2BA69C' : '#5A6270'"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

            </div>

            <div class="flex flex-col items-end justify-between self-stretch">
                <button @click="emit('close')" class="p-1 rounded-full border border-[#2BA69C] hover:bg-[#2BA69C]/10 hover:cursor-pointer transition-colors flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M1 15L8 8M8 8L15 1M8 8L1 1M8 8L15 15" stroke="#2BA69C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>

                <button
                    @click="handleSubmit"
                    :disabled="loading || leafs === 0"
                    class="rounded-full bg-[#CCD6E5] hover:bg-[#2BA69C] disabled:bg-[#2E3B4E] disabled:text-[#5A6270] px-6 py-3 text-[#0E121A] font-bold hover:cursor-pointer transition-colors"
                >
                    {{ loading ? 'Postando...' : 'Postar' }}
                </button>
            </div>

        </div>
    </div>
</template>