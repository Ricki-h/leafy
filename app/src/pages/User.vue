<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import Template from './base/Template.vue'
import api from '../services/api.js'

const route = useRoute()
const follows = ref(null)
async function loadFollowsQtd() {
    try {
        const { data } = await api.get(`/users/${route.params.username}/followers`)
        console.log(data)

        follows.value = data.length
    }
    catch (err) {
        console.error(err)
    }
}
const following = ref(null)
async function loadFollowingQtd() {
    try {
        const { data } = await api.get(`/users/${route.params.username}/following`)
        console.log(data)
        following.value = data.length
    }
    catch (err) {
        console.error(err)
    }
}

const qtdposts = 10

async function follow() {
    try {
        await api.post(`/users/${route.params.username}/follow`)

        await loadFollowingQtd()
        await loadFollowsQtd()
    }
    catch (err) {
        console.erroor(err)
    }
}

const user = ref(null)
async function loadUser() {
    try {
        const { data } = await api.get(`/users/${route.params.username}`)

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
    await loadFollowsQtd()
    await loadFollowingQtd()
})
</script>

<template>
    <Template>
        <div class="flex flex-col h-screen">
            <div class="flex border-b-1 border-[#5A6270] px-8 py-6">
                <button @click="voltar" class="flex items-center gap-2 hover:cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="9" height="16" viewBox="0 0 12 19" fill="none">
                        <path d="M4.01878 9.4335L10.618 16.0327C10.9282 16.3429 11.0833 16.7378 11.0833 17.2172C11.0833 17.6966 10.9282 18.0915 10.618 18.4017C10.3078 18.7119 9.91296 18.867 9.43353 18.867C8.9541 18.867 8.55927 18.7119 8.24905 18.4017L0.465355 10.618C0.296144 10.4488 0.176569 10.2655 0.106628 10.068C0.0366879 9.87063 0.0011541 9.65912 2.60328e-05 9.4335C-0.00110204 9.20789 0.0344318 8.99637 0.106628 8.79896C0.178825 8.60155 0.2984 8.41824 0.465355 8.24903L8.24905 0.465329C8.55927 0.155109 8.9541 0 9.43353 0C9.91296 0 10.3078 0.155109 10.618 0.465329C10.9282 0.775549 11.0833 1.17037 11.0833 1.64981C11.0833 2.12924 10.9282 2.52406 10.618 2.83428L4.01878 9.4335Z" fill="#CCD6E5"/>
                    </svg>
                    <span>voltar</span>
                </button>   
            </div>
    
            <div v-if="user" class="h-full overflow-y-auto">
                <div class="bg-[#054B84] h-38 w-full"></div>
                <div class="px-8 h-full">
                    <div class="flex items-start justify-end relative" v-if="user" >
                        <img :src="user.avatarUrl" alt="" class="rounded-full border-6 border-[#0E121A] w-35 h-35 absolute bottom-[-20px] left-0">
                        <button class="mt-3 font-bold hover:text-[#0E121A] px-4 py-2 text-[#2BA69C] border-1 border-[#2BA69C] rounded-full hover:bg-[#2BA69C] hover:cursor-pointer " v-if="isOwnProfile">Editar perfil</button>
                        <button class="mt-3 font-bold hover:text-[#0E121A] px-4 py-2 text-[#2BA69C] border-1 border-[#2BA69C] rounded-full hover:bg-[#2BA69C] hover:cursor-pointer " v-else @click="follow">Seguir</button>
                    </div>
                    <div>
                        <h6 class="mt-6 text-xl font-bold">{{ user.name }}</h6>
                        <p class="text-base text-[#5A6270]">{{ '@' + user.username }}</p>
                    </div>
    
                    <p v-if="user.bio">{{ user.bio }}</p>
    
                    <div class="flex gap-4 mt-4">
                        <RouterLink :to="'/users/' + user.username + '/following'" class="flex gap-1.5">
                            <span class="font-bold">{{ following }}</span>
                            <span class="text-[#5A6270]">Following</span>
                        </RouterLink>
                        <RouterLink :to="'/users/' + user.username + '/followers'" class="flex gap-1.5">
                            <span class="font-bold">{{ follows }}</span>
                            <span class="text-[#5A6270]">Followers</span>
                        </RouterLink>
                    </div>
    
                    <div class="flex gap-4 mt-6 w-80 pb-4">
                        <RouterLink class="w-full text-center px-4 py-2 bg-[#CCD6E5] hover:bg-[#682B9C] text-[#0E121A] hover:text-[#CCD6E5] font-bold rounded-full">Resenhas</RouterLink>
                        <RouterLink :to="'/users/' + user.username + '/lists'" class="w-full text-center px-4 py-2 bg-[#CCD6E5] hover:bg-[#682B9C] text-[#0E121A] hover:text-[#CCD6E5] font-bold rounded-full">Listas</RouterLink>
                    </div>
    
                    <div class="">
                        <div class="px-8 py-3 flex gap-3" v-for="post in qtdposts">
                            <div class="min-w-12 h-12 rounded-full bg-[#D9D9D9] hover:cursor-pointer"></div>
                            <div class="flex flex-col gap-2">
                                <div class="flex items-center gap-1">
                                    <p class="text-[#CCD6E5] text-sm font-semibold">Nome da pessoa</p>
                                    <p class="text-[#5A6270] text-sm hover:cursor-pointer">@username</p>
                                </div>
                                <p class="text-[#CCD6E5] text-sm">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce non volutpat odio. Maecenas feugiat est eget dolor volutpat, non luctus orci mattis.
                                </p>
                                <div class="w-full h-8 bg-[#D9D9D9]"></div>
                            </div>
                        </div>
                    </div>
                </div>
    
            </div>
        </div>
    </Template>
</template>