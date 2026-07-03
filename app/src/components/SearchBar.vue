<script setup>
import { ref } from 'vue'
import api from '../services/api.js'

const props = defineProps({
    endpoint: {
        type: String,
        required: true, // ex: '/users/search' ou '/posts/search'
    },
    paramName: {
        type: String,
        default: 'q', // nome do query param enviado na requisição
    },
    placeholder: {
        type: String,
        default: 'Pesquisar',
    },
    debounce: {
        type: Number,
        default: 400, // tempo em ms pra evitar disparar request a cada tecla
    },
})

const emit = defineEmits(['results', 'error', 'loading'])

const query = ref('')
const isFocused = ref(false)
const isLoading = ref(false)
let debounceTimer = null

async function search() {
    if (!query.value.trim()) {
        emit('results', [])
        return
    }

    try {
        isLoading.value = true
        emit('loading', true)

        const { data } = await api.get(props.endpoint, {
            params: { [props.paramName]: query.value },
        })

        emit('results', data)
    }
    catch (err) {
        console.error(err)
        emit('error', err)
    }
    finally {
        isLoading.value = false
        emit('loading', false)
    }
}

function onInput() {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(search, props.debounce)
}

function onSubmit() {
    clearTimeout(debounceTimer)
    search()
}

defineExpose({ search, query })
</script>

<template>
    <form
        @submit.prevent="onSubmit"
        class="flex items-center gap-3 bg-[#18202C] border-1 rounded-full px-4 py-2.5 transition-colors duration-150"
        :class="isFocused ? 'border-[#2BA69C]' : 'border-[#5A6270]'"
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            class="shrink-0 transition-colors duration-150"
            :class="isFocused ? 'text-[#2BA69C]' : 'text-[#5A6270]'"
        >
            <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2" />
            <path d="M20 20L16.65 16.65" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>

        <input
            v-model="query"
            @input="onInput"
            @focus="isFocused = true"
            @blur="isFocused = false"
            type="text"
            :placeholder="placeholder"
            class="w-full bg-transparent outline-none border-none text-[#CCD6E5] placeholder-[#5A6270] text-sm"
        />
    </form>
</template>