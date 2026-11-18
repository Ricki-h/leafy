<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import Template from './base/Template.vue'
import api from '../services/api.js'

const route = useRoute()
const router = useRouter()

const username = computed(() => route.params.username)
const mode = computed(() => (route.path.endsWith('/following') ? 'following' : 'followers'))

const user = ref(null)
const users = ref([])
const loading = ref(true)
const error = ref(null)

const loggedUser = JSON.parse(localStorage.getItem('user') || 'null')
const myFollowingIds = ref(new Set())
const myFollowersIds = ref(new Set())

function isMe(u) {
    return loggedUser?.username === u.username
}

function isFollowingUser(u) {
    return u.isFollowing ?? myFollowingIds.value.has(u.id)
}

function followsMe(u) {
    return u.isFollowedBy ?? u.followsMe ?? myFollowersIds.value.has(u.id)
}

async function loadMyConnections() {
    if (!loggedUser?.username) return

    try {
        const [followingRes, followersRes] = await Promise.all([
            api.get(`/users/${loggedUser.username}/following`),
            api.get(`/users/${loggedUser.username}/followers`),
        ])

        const followingList = Array.isArray(followingRes.data)
            ? followingRes.data
            : (followingRes.data?.users ?? [])
        const followersList = Array.isArray(followersRes.data)
            ? followersRes.data
            : (followersRes.data?.users ?? [])

        myFollowingIds.value = new Set(followingList.map(item => item.id))
        myFollowersIds.value = new Set(followersList.map(item => item.id))
    } catch (err) {
        console.error(err)
    }
}

async function loadUser() {
    try {
        const { data } = await api.get(`/users/${username.value}`)
        user.value = data
    } catch (err) {
        console.error(err)
    }
}

async function loadUsers({ silent = false } = {}) {
    if (!silent) loading.value = true
    error.value = null

    try {
        const { data } = await api.get(`/users/${username.value}/${mode.value}`)
        users.value = Array.isArray(data) ? data : (data?.users ?? [])
    } catch (err) {
        console.error(err)
        error.value = err.response?.data?.error || 'Não foi possível carregar a lista.'
    } finally {
        loading.value = false
    }
}

async function follow(u) {
    try {
        await api.post(`/users/${u.username}/follow`)

        const atualizado = new Set(myFollowingIds.value)
        if (atualizado.has(u.id)) {
            atualizado.delete(u.id)
        } else {
            atualizado.add(u.id)
        }
        myFollowingIds.value = atualizado

        await loadUsers({ silent: true })
    } catch (err) {
        console.error(err)
    }
}

function voltar() {
    router.push(`/users/${route.params.username}`)
}

onMounted(() => {
    loadMyConnections()
    loadUser()
    loadUsers()
})

watch(() => [route.params.username, route.path], () => {
    loadUser()
    loadUsers()
})
</script>

<template>
    <Template>
        <div class="flex flex-col h-screen">
            <!-- Cabeçalho -->
            <div class="flex items-center gap-6 border-b border-[#5A6270] px-8 py-6">
                <button @click="voltar" class="flex items-center gap-2 hover:cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="9" height="16" viewBox="0 0 12 19" fill="none">
                        <path d="M4.01878 9.4335L10.618 16.0327C10.9282 16.3429 11.0833 16.7378 11.0833 17.2172C11.0833 17.6966 10.9282 18.0915 10.618 18.4017C10.3078 18.7119 9.91296 18.867 9.43353 18.867C8.9541 18.867 8.55927 18.7119 8.24905 18.4017L0.465355 10.618C0.296144 10.4488 0.176569 10.2655 0.106628 10.068C0.0366879 9.87063 0.0011541 9.65912 2.60328e-05 9.4335C-0.00110204 9.20789 0.0344318 8.99637 0.106628 8.79896C0.178825 8.60155 0.2984 8.41824 0.465355 8.24903L8.24905 0.465329C8.55927 0.155109 8.9541 0 9.43353 0C9.91296 0 10.3078 0.155109 10.618 0.465329C10.9282 0.775549 11.0833 1.17037 11.0833 1.64981C11.0833 2.12924 10.9282 2.52406 10.618 2.83428L4.01878 9.4335Z" fill="#CCD6E5"/>
                    </svg>
                </button>

                <div v-if="user" class="flex items-center gap-3">
                    <img
                        v-if="user.avatarUrl"
                        :src="user.avatarUrl"
                        alt=""
                        class="w-12 h-12 rounded-full object-cover bg-gray-300"
                    />
                    <div v-else class="w-12 h-12 rounded-full bg-gray-300"></div>

                    <div>
                        <h6 class="text-xl font-bold leading-tight">{{ user.name }}</h6>
                        <p class="text-sm text-[#5A6270]">{{ '@' + user.username }}</p>
                    </div>
                </div>
            </div>

            <!-- Abas -->
            <div class="flex">
                <RouterLink
                    :to="'/users/' + username + '/followers'"
                    class="text-center text-[#CCD6E5] font-bold w-full border-b p-3 hover:bg-[#2E3B4E]"
                    :class="mode === 'followers' ? 'border-[#682B9C] border-b-2' : 'border-[#5A6270]'"
                >
                    Seguidores
                </RouterLink>
                <RouterLink
                    :to="'/users/' + username + '/following'"
                    class="text-center text-[#CCD6E5] font-bold w-full border-b p-3 hover:bg-[#2E3B4E]"
                    :class="mode === 'following' ? 'border-[#682B9C] border-b-2' : 'border-[#5A6270]'"
                >
                    Seguindo
                </RouterLink>
            </div>

            <!-- Conteúdo -->
            <div class="flex-1 overflow-y-auto">
                <div v-if="loading" class="text-center text-white/70 py-10">
                    Carregando...
                </div>

                <div v-else-if="error" class="text-center text-red-400 py-10">
                    {{ error }}
                </div>

                <div v-else-if="users.length === 0" class="text-center text-white/70 py-10">
                    {{ mode === 'followers' ? 'Ainda não há seguidores.' : 'Ainda não segue ninguém.' }}
                </div>

                <div
                    v-else
                    v-for="u in users"
                    :key="u.id"
                    class="px-8 py-3 flex items-center gap-3 border-b border-[#5A6270] hover:bg-[#2E3B4E]/40 transition-colors"
                >
                    <RouterLink :to="'/users/' + u.username" class="shrink-0">
                        <img
                            :src="u.avatarUrl"
                            alt=""
                            class="w-12 h-12 rounded-full object-cover bg-gray-300"
                        />
                    </RouterLink>

                    <RouterLink :to="'/users/' + u.username" class="flex-1 min-w-0">
                        <p class="text-[#CCD6E5] text-sm font-semibold truncate">{{ u.name }}</p>

                        <div class="flex items-center gap-2 mt-0.5">
                            <p class="text-[#5A6270] text-sm truncate">{{ '@' + u.username }}</p>
                            <span
                                v-if="!isMe(u) && followsMe(u)"
                                class="shrink-0 px-2 py-0.5 text-[11px] font-medium rounded-md bg-[#2E3B4E] text-[#CCD6E5]"
                            >
                                Segue você
                            </span>
                        </div>

                        <p v-if="u.bio" class="text-[#CCD6E5] text-sm mt-1 line-clamp-2">{{ u.bio }}</p>
                    </RouterLink>

                    <button
                        v-if="!isMe(u)"
                        @click="follow(u)"
                        class="shrink-0 font-bold px-4 py-1.5 text-sm border border-[#2BA69C] rounded-full hover:cursor-pointer transition-colors"
                        :class="isFollowingUser(u)
                            ? 'bg-[#2BA69C] text-[#0E121A] hover:bg-transparent hover:text-[#2BA69C]'
                            : 'text-[#2BA69C] hover:bg-[#2BA69C] hover:text-[#0E121A]'"
                    >
                        {{ isFollowingUser(u) ? 'Seguindo' : 'Seguir' }}
                    </button>
                </div>
            </div>
        </div>
    </Template>
</template>