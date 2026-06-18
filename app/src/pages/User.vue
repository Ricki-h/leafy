<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import Template from './base/Template.vue'
import api from '../services/api.js'

const route = useRoute()

const user = ref(null)
async function loadUser() {
    try {
        const { data } = await api.get(`/users/${route.params.username}`)

        console.log('Resposta da API:', data)

        user.value = data
    } catch (err) {
        console.error(err)
    }
}

const isOwnProfile = computed(() => {
    const user = JSON.parse(localStorage.getItem('user'))

    if (!user) return false

    return (
        user.username ===
        route.params.username
    )
})

function voltar() {
    window.history.back()
}

onMounted(async () => {
    await loadUser()
})
</script>

<template>
    <Template>
        <div class="flex border-b-1 border-[#5A6270] px-8 py-6">
            <button @click="voltar" class="flex items-center gap-2 hover:cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="9" height="16" viewBox="0 0 12 19" fill="none">
                <path d="M4.01878 9.4335L10.618 16.0327C10.9282 16.3429 11.0833 16.7378 11.0833 17.2172C11.0833 17.6966 10.9282 18.0915 10.618 18.4017C10.3078 18.7119 9.91296 18.867 9.43353 18.867C8.9541 18.867 8.55927 18.7119 8.24905 18.4017L0.465355 10.618C0.296144 10.4488 0.176569 10.2655 0.106628 10.068C0.0366879 9.87063 0.0011541 9.65912 2.60328e-05 9.4335C-0.00110204 9.20789 0.0344318 8.99637 0.106628 8.79896C0.178825 8.60155 0.2984 8.41824 0.465355 8.24903L8.24905 0.465329C8.55927 0.155109 8.9541 0 9.43353 0C9.91296 0 10.3078 0.155109 10.618 0.465329C10.9282 0.775549 11.0833 1.17037 11.0833 1.64981C11.0833 2.12924 10.9282 2.52406 10.618 2.83428L4.01878 9.4335Z" fill="#CCD6E5"/>
            </svg>
            <span>voltar</span>
        </button>
            
        </div>

        <div>
            <div class="bg-[#054B84] h-38 w-full"></div>
            <div class="px-8" v-if="user" >
                <img :src="user.avatarUrl" alt="" class="w-35 h-35relative top-[-70px]">
                <button v-if="isOwnProfile">Editar perfil</button>
                <button v-else>Seguir</button>
            </div>

        </div>
    </Template>
</template>