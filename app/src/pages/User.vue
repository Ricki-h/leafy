<script setup>
import { computed, watch, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import Template from './base/Template.vue'
import api from '../services/api.js'
import EditarPerfil from '../components/EditarPerfil.vue'
import { formatPostDate, formatPostFullDate } from '../../utils/formatDate.js'

const tab = ref('posts')

const route = useRoute()
const showEditModal = ref(false)
const copiedPostId = ref(null)

async function follow() {
    try {
        await api.post(`/users/${route.params.username}/follow`)
        await loadUser() // atualiza contagens e isFollowing
    } catch (err) {
        console.error(err)
    }
}

const user = ref(null)
async function loadUser() {
    const username = route.params.username
    try {
        const { data } = await api.get(`/users/${username}`)
        if (username !== route.params.username) return // rota já mudou, ignora

        // evita o navegador mostrar a foto antiga em cache
        if (data.avatarUrl) {
            const sep = data.avatarUrl.includes('?') ? '&' : '?'
            data.avatarUrl += sep + 't=' + Date.now()
        }

        user.value = data
    } catch (err) {
        console.error(err)
    }
}

const posts = ref(null)
async function loadPosts() {
    try {
        const { data } = await api.get(`/posts/user/${user.value.id}`)

        posts.value = data
    }
    catch (err) {
        console.error(err)
    }
}
const allPosts = ref(null)
async function loadAllPosts() {
    try {
        const { data } = await api.get(`/posts/user/${user.value.id}/all`)

        allPosts.value = data
    }
    catch (err) {
        console.error(err)
    }
}

const ratings = ref(null)
async function loadRatings() {
    try {
        const { data } = await api.get(`/ratings/user/${user.value.id}`)

        ratings.value = Array.isArray(data) ? data : (data?.ratings ?? [])
    }
    catch (err) {
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

async function toggleLike(post) {
    try {
        if (post.likedByUser) {
            await api.delete(`/posts/${post.id}/like`)
            post.likedByUser = false
            post.likesCount--
        } else {
            await api.post(`/posts/${post.id}/like`)
            post.likedByUser = true
            post.likesCount++
        }
    } catch (err) {
        console.error(err)
    }
}

async function sharePost(postId) {
    const url = `${window.location.origin}/post/${postId}`
    try {
        await navigator.clipboard.writeText(url)
        copiedPostId.value = postId
        setTimeout(() => {
            if (copiedPostId.value === postId) copiedPostId.value = null
        }, 2000)
    } catch (err) {
        console.error(err)
    }
}

// Depois de salvar o perfil, busca o usuário completo de novo
// (o PATCH não devolve avatarUrl, contagens, isFollowing etc.)
async function onUpdated() {
    showEditModal.value = false
    await loadUser()
}

async function loadAll() {
    // limpa o usuário anterior para não mostrar dados antigos
    user.value = null
    posts.value = null
    allPosts.value = null
    ratings.value = null
    tab.value = 'posts'

    await loadUser()
    if (!user.value) return   // se falhou, não tenta carregar os posts

    await Promise.all([
        loadPosts(),
        loadAllPosts(),
        loadRatings(),
    ])
}

watch(
    () => route.params.username,
    () => loadAll(),
    { immediate: true },
)
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
                <div class="h-full">
                    <div class="px-8">
                        <div class="flex items-start justify-end relative">
                            <img :src="user.avatarUrl" alt="" class="rounded-full border-6 border-[#0E121A] w-35 h-35 absolute bottom-[-20px] left-0 object-cover">
                            <button class="mt-3 font-bold hover:text-[#0E121A] px-4 py-2 text-[#2BA69C] border-1 border-[#2BA69C] rounded-full hover:bg-[#2BA69C] hover:cursor-pointer " v-if="isOwnProfile" @click="showEditModal = true">Editar perfil</button>
                            <button class="mt-3 font-bold hover:text-[#0E121A] px-4 py-2 text-[#2BA69C] border-1 border-[#2BA69C] rounded-full hover:bg-[#2BA69C] hover:cursor-pointer " v-else @click="follow">{{ user.isFollowing ? 'Seguindo' : 'Seguir' }}</button>
                        </div>
                        <div>
                            <h6 class="mt-6 text-xl font-bold">{{ user.name }}</h6>
                            <p class="text-base text-[#5A6270]">{{ '@' + user.username }}</p>
                        </div>

                        <p v-if="user.bio">{{ user.bio }}</p>

                        <div class="flex gap-4 mt-4">
                            <RouterLink :to="'/users/' + user.username + '/following'" class="flex gap-1.5">
                                <span class="font-bold">{{ user.followingCount }}</span>
                                <span class="text-[#5A6270]">Following</span>
                            </RouterLink>
                            <RouterLink :to="'/users/' + user.username + '/followers'" class="flex gap-1.5">
                                <span class="font-bold">{{ user.followersCount }}</span>
                                <span class="text-[#5A6270]">Followers</span>
                            </RouterLink>
                        </div>

                        <div class="flex gap-4 mt-6 w-full pb-4">
                            <RouterLink :to="'/users/' + user.username + '/reviews'" class="w-full text-center px-4 py-2 bg-[#CCD6E5] hover:bg-[#682B9C] text-[#0E121A] hover:text-[#CCD6E5] font-bold rounded-full">Resenhas</RouterLink>
                            <RouterLink :to="'/users/' + user.username + '/lists'" class="w-full text-center px-4 py-2 bg-[#CCD6E5] hover:bg-[#682B9C] text-[#0E121A] hover:text-[#CCD6E5] font-bold rounded-full">Listas</RouterLink>
                        </div>
                    </div>
                    <div class="flex">
                        <button @click="tab = 'posts'" class="text-[#CCD6E5] font-bold w-full border-b p-3 hover:bg-[#2E3B4E] hover:cursor-pointer" :class="tab == 'posts' ? 'border-[#682B9C] border-b-2' : 'border-[#5A6270]'">
                            Postagens
                        </button>
                        <button @click="tab = 'replies'" class="text-[#CCD6E5] font-bold w-full border-b p-3 hover:bg-[#2E3B4E] hover:cursor-pointer" :class="tab == 'replies' ? 'border-[#682B9C] border-b-2' : 'border-[#5A6270]'">
                            Respostas
                        </button>
                        <button @click="tab = 'ratings'" class="text-[#CCD6E5] font-bold w-full border-b p-3 hover:bg-[#2E3B4E] hover:cursor-pointer" :class="tab == 'ratings' ? 'border-[#682B9C] border-b-2' : 'border-[#5A6270]'">
                            Avaliações
                        </button>
                    </div>
                    <div v-if="tab == 'posts'">
                        <div class="px-8 py-3 flex gap-3 border-b border-[#5A6270]" v-for="post in posts" :key="post.id">
                            <RouterLink :to="'/users/' + user.username" class="min-w-12 h-12 rounded-full hover:cursor-pointer overflow-hidden">
                                <img :src="user.avatarUrl" alt="" class="w-12 rounded-full">
                            </RouterLink>
                            <div class="flex flex-col gap-2 w-full">
                                <div class="flex items-center gap-2">
                                    <p class="text-[#CCD6E5] text-sm font-semibold">{{ user.name }}</p>
                                    <p class="text-[#5A6270] text-sm hover:cursor-pointer">{{ '@' + user.username }}</p>
                                </div>
                                <p class="text-[#CCD6E5] text-sm whitespace-pre-wrap break-words">
                                    {{ post.content }}
                                </p>
                                <div class="flex items-center justify-between w-full">
                                    <div class="flex gap-4 text-[#5A6270] text-sm">
                                        <button @click="toggleLike(post)" class="flex items-center gap-1 group hover:cursor-pointer hover:text-[#FF82BD]">
                                            <div class="group-hover:bg-[#463449] px-2 py-2 rounded-full">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="13" viewBox="0 0 14 13" fill="none">
                                                    <path v-if="post.likedByUser" d="M10.15 0C8.932 0 7.763 0.567 7 1.456C6.237 0.567 5.068 0 3.85 0C1.694 0 0 1.687 0 3.85C0 6.489 2.38 8.652 5.985 11.921L7 12.845L8.015 11.921C11.62 8.652 14 6.489 14 3.85C14 1.687 12.306 0 10.15 0Z" fill="#FF82BD" class="group-hover:fill-[#FF82BD]"/>
                                                    <path v-else d="M7.07 10.885L7 10.955L6.923 10.885C3.598 7.868 1.4 5.873 1.4 3.85C1.4 2.45 2.45 1.4 3.85 1.4C4.928 1.4 5.978 2.1 6.349 3.052H7.651C8.022 2.1 9.072 1.4 10.15 1.4C11.55 1.4 12.6 2.45 12.6 3.85C12.6 5.873 10.402 7.868 7.07 10.885ZM10.15 0C8.932 0 7.763 0.567 7 1.456C6.237 0.567 5.068 0 3.85 0C1.694 0 0 1.687 0 3.85C0 6.489 2.38 8.652 5.985 11.921L7 12.845L8.015 11.921C11.62 8.652 14 6.489 14 3.85C14 1.687 12.306 0 10.15 0Z" fill="#5A6270" class="group-hover:fill-[#FF82BD]"/>
                                                </svg>
                                            </div>
                                            <span>
                                                {{ post.likesCount }}
                                            </span>
                                        </button>
                                        <RouterLink :to="'/post/' + post.id" class="flex items-center gap-1 group hover:cursor-pointer hover:text-[#2BA69C]">
                                            <div class="group-hover:bg-[#1C3B42] px-2 py-2 rounded-full">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="14" viewBox="0 0 15 14" fill="none">
                                                    <path d="M7.01973 0C6.10048 0 5.19023 0.18106 4.34095 0.532843C3.49167 0.884626 2.71999 1.40024 2.06998 2.05025C0.757228 3.36301 0.0197305 5.14348 0.0197305 7C0.0142012 8.61629 0.573806 10.1837 1.60173 11.431L0.20173 12.831C0.1046 12.9294 0.0388027 13.0544 0.0126408 13.1902C-0.013521 13.326 0.00112483 13.4665 0.0547304 13.594C0.112871 13.72 0.207123 13.8258 0.325523 13.8981C0.443923 13.9704 0.581131 14.0058 0.71973 14H7.01973C8.87625 14 10.6567 13.2625 11.9695 11.9497C13.2822 10.637 14.0197 8.85652 14.0197 7C14.0197 5.14348 13.2822 3.36301 11.9695 2.05025C10.6567 0.737498 8.87625 0 7.01973 0ZM7.01973 12.6H2.40673L3.05773 11.949C3.18811 11.8178 3.26129 11.6404 3.26129 11.4555C3.26129 11.2706 3.18811 11.0932 3.05773 10.962C2.14114 10.0464 1.57035 8.84138 1.44261 7.55216C1.31488 6.26293 1.63809 4.9693 2.35719 3.89167C3.07629 2.81403 4.14678 2.01905 5.38629 1.64218C6.6258 1.26531 7.95763 1.32986 9.15488 1.82484C10.3521 2.31982 11.3407 3.21459 11.9522 4.35672C12.5637 5.49886 12.7603 6.81768 12.5085 8.08851C12.2567 9.35933 11.572 10.5035 10.5712 11.3262C9.57037 12.1488 8.31526 12.599 7.01973 12.6Z" fill="#5A6270" class="group-hover:fill-[#2BA69C]"/>
                                                </svg>
                                            </div>
                                            <span>
                                                {{ post.repliesCount }}
                                            </span>
                                        </RouterLink>
                                        <button @click="sharePost(post.id)" class="flex items-center gap-1 group hover:cursor-pointer hover:text-[#A855F7]" title="Copiar link do post">
                                            <div class="group-hover:bg-[#682B9C]/30 px-2 py-2 rounded-full">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 19 21" fill="none">
                                                    <path d="M14.999 2.47381e-07C14.507 -0.00019279 14.0214 0.112591 13.5798 0.32966C13.1382 0.546729 12.7524 0.862288 12.452 1.25202C12.1516 1.64175 11.9447 2.09525 11.8472 2.57756C11.7497 3.05987 11.7643 3.55813 11.8897 4.03393C11.8124 4.05104 11.7377 4.07881 11.668 4.11643L8.71403 5.72679L4.9576 7.875C4.92045 7.8971 4.88467 7.92143 4.85046 7.94786C4.32787 7.6388 3.72843 7.48408 3.12154 7.5016C2.51466 7.51912 1.92514 7.70816 1.42125 8.04684C0.917352 8.38553 0.519682 8.86 0.274276 9.41533C0.0288704 9.97066 -0.0542357 10.5841 0.0345791 11.1847C0.123394 11.7854 0.380498 12.3485 0.776125 12.8091C1.17175 13.2696 1.68973 13.6087 2.27008 13.787C2.85043 13.9654 3.46943 13.9757 4.05541 13.8168C4.64139 13.658 5.17039 13.3364 5.58117 12.8893L8.71617 14.6325L11.8812 16.3586C11.8169 16.6107 11.7847 16.8725 11.7847 17.1439C11.7847 17.8921 12.0456 18.6169 12.5226 19.1934C12.9995 19.7698 13.6627 20.1618 14.3977 20.3018C15.1326 20.4418 15.8934 20.321 16.5489 19.9602C17.2044 19.5995 17.7135 19.0213 17.9884 18.3255C18.2634 17.6296 18.287 16.8596 18.0551 16.1483C17.8233 15.4369 17.3505 14.8287 16.7183 14.4285C16.0862 14.0283 15.3342 13.8611 14.592 13.9559C13.8498 14.0506 13.164 14.4013 12.6526 14.9475L9.49403 13.2257L6.3376 11.4729C6.53043 10.6772 6.4124 9.83801 6.0076 9.12643L9.49832 7.13143L12.4372 5.5275C12.5068 5.48902 12.5706 5.44106 12.6269 5.385C12.9879 5.77921 13.4414 6.07717 13.9466 6.25192C14.4517 6.42668 14.9924 6.47271 15.5198 6.38584C16.0472 6.29897 16.5447 6.08195 16.9671 5.75443C17.3895 5.4269 17.7235 4.99921 17.939 4.51006C18.1545 4.02091 18.2446 3.48574 18.2011 2.95301C18.1577 2.42027 17.982 1.90677 17.6902 1.459C17.3983 1.01123 16.9993 0.643318 16.5294 0.388565C16.0595 0.133812 15.5335 0.000260805 14.999 2.47381e-07Z" :fill="copiedPostId === post.id ? '#2BA69C' : '#5A6270'" class="group-hover:fill-[#A855F7]"/>
                                                </svg>
                                            </div>
                                            <span v-if="copiedPostId === post.id" class="text-xs text-[#2BA69C]">Copiado!</span>
                                        </button>
                                    </div>
                                    <time
                                        :datetime="post.createdAt"
                                        :title="formatPostFullDate(post.createdAt)"
                                        class="text-[#5A6270] text-sm hover:underline"
                                    >
                                        {{ formatPostDate(post.createdAt) }}
                                    </time>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else-if="tab == 'replies'">
                        <div class="px-8 py-3 flex gap-3 border-b border-[#5A6270]" v-for="post in allPosts" :key="post.id">
                            <RouterLink :to="'/users/' + user.username" class="min-w-12 w-12 h-12 shrink-0 rounded-full hover:cursor-pointer overflow-hidden">
                                <img :src="user.avatarUrl" alt="" class="w-12 h-12 rounded-full object-cover">
                            </RouterLink>
                            <div class="flex flex-col gap-2 w-full">
                                <div class="flex items-center gap-2">
                                    <p class="text-[#CCD6E5] text-sm font-semibold">{{ user.name }}</p>
                                    <p class="text-[#5A6270] text-sm hover:cursor-pointer">{{ '@' + user.username }}</p>
                                </div>
                                <p class="text-[#CCD6E5] text-sm whitespace-pre-wrap break-words">
                                    {{ post.content }}
                                </p>
                                <div class="flex items-center justify-between w-full">
                                    <div class="flex gap-4 text-[#5A6270] text-sm">
                                        <button @click="toggleLike(post)" class="flex items-center gap-1 group hover:cursor-pointer hover:text-[#FF82BD]">
                                            <div class="group-hover:bg-[#463449] px-2 py-2 rounded-full">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="13" viewBox="0 0 14 13" fill="none">
                                                    <path v-if="post.likedByUser" d="M10.15 0C8.932 0 7.763 0.567 7 1.456C6.237 0.567 5.068 0 3.85 0C1.694 0 0 1.687 0 3.85C0 6.489 2.38 8.652 5.985 11.921L7 12.845L8.015 11.921C11.62 8.652 14 6.489 14 3.85C14 1.687 12.306 0 10.15 0Z" fill="#FF82BD" class="group-hover:fill-[#FF82BD]"/>
                                                    <path v-else d="M7.07 10.885L7 10.955L6.923 10.885C3.598 7.868 1.4 5.873 1.4 3.85C1.4 2.45 2.45 1.4 3.85 1.4C4.928 1.4 5.978 2.1 6.349 3.052H7.651C8.022 2.1 9.072 1.4 10.15 1.4C11.55 1.4 12.6 2.45 12.6 3.85C12.6 5.873 10.402 7.868 7.07 10.885ZM10.15 0C8.932 0 7.763 0.567 7 1.456C6.237 0.567 5.068 0 3.85 0C1.694 0 0 1.687 0 3.85C0 6.489 2.38 8.652 5.985 11.921L7 12.845L8.015 11.921C11.62 8.652 14 6.489 14 3.85C14 1.687 12.306 0 10.15 0Z" fill="#5A6270" class="group-hover:fill-[#FF82BD]"/>
                                                </svg>
                                            </div>
                                            <span>
                                                {{ post.likesCount }}
                                            </span>
                                        </button>
                                        <RouterLink :to="'/post/' + post.id" class="flex items-center gap-1 group hover:cursor-pointer hover:text-[#2BA69C]">
                                            <div class="group-hover:bg-[#1C3B42] px-2 py-2 rounded-full">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="14" viewBox="0 0 15 14" fill="none">
                                                    <path d="M7.01973 0C6.10048 0 5.19023 0.18106 4.34095 0.532843C3.49167 0.884626 2.71999 1.40024 2.06998 2.05025C0.757228 3.36301 0.0197305 5.14348 0.0197305 7C0.0142012 8.61629 0.573806 10.1837 1.60173 11.431L0.20173 12.831C0.1046 12.9294 0.0388027 13.0544 0.0126408 13.1902C-0.013521 13.326 0.00112483 13.4665 0.0547304 13.594C0.112871 13.72 0.207123 13.8258 0.325523 13.8981C0.443923 13.9704 0.581131 14.0058 0.71973 14H7.01973C8.87625 14 10.6567 13.2625 11.9695 11.9497C13.2822 10.637 14.0197 8.85652 14.0197 7C14.0197 5.14348 13.2822 3.36301 11.9695 2.05025C10.6567 0.737498 8.87625 0 7.01973 0ZM7.01973 12.6H2.40673L3.05773 11.949C3.18811 11.8178 3.26129 11.6404 3.26129 11.4555C3.26129 11.2706 3.18811 11.0932 3.05773 10.962C2.14114 10.0464 1.57035 8.84138 1.44261 7.55216C1.31488 6.26293 1.63809 4.9693 2.35719 3.89167C3.07629 2.81403 4.14678 2.01905 5.38629 1.64218C6.6258 1.26531 7.95763 1.32986 9.15488 1.82484C10.3521 2.31982 11.3407 3.21459 11.9522 4.35672C12.5637 5.49886 12.7603 6.81768 12.5085 8.08851C12.2567 9.35933 11.572 10.5035 10.5712 11.3262C9.57037 12.1488 8.31526 12.599 7.01973 12.6Z" fill="#5A6270" class="group-hover:fill-[#2BA69C]"/>
                                                </svg>
                                            </div>
                                            <span>
                                                {{ post.repliesCount }}
                                            </span>
                                        </RouterLink>
                                        <button @click="sharePost(post.id)" class="flex items-center gap-1 group hover:cursor-pointer hover:text-[#A855F7]" title="Copiar link do post">
                                            <div class="group-hover:bg-[#682B9C]/30 px-2 py-2 rounded-full">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 19 21" fill="none">
                                                    <path d="M14.999 2.47381e-07C14.507 -0.00019279 14.0214 0.112591 13.5798 0.32966C13.1382 0.546729 12.7524 0.862288 12.452 1.25202C12.1516 1.64175 11.9447 2.09525 11.8472 2.57756C11.7497 3.05987 11.7643 3.55813 11.8897 4.03393C11.8124 4.05104 11.7377 4.07881 11.668 4.11643L8.71403 5.72679L4.9576 7.875C4.92045 7.8971 4.88467 7.92143 4.85046 7.94786C4.32787 7.6388 3.72843 7.48408 3.12154 7.5016C2.51466 7.51912 1.92514 7.70816 1.42125 8.04684C0.917352 8.38553 0.519682 8.86 0.274276 9.41533C0.0288704 9.97066 -0.0542357 10.5841 0.0345791 11.1847C0.123394 11.7854 0.380498 12.3485 0.776125 12.8091C1.17175 13.2696 1.68973 13.6087 2.27008 13.787C2.85043 13.9654 3.46943 13.9757 4.05541 13.8168C4.64139 13.658 5.17039 13.3364 5.58117 12.8893L8.71617 14.6325L11.8812 16.3586C11.8169 16.6107 11.7847 16.8725 11.7847 17.1439C11.7847 17.8921 12.0456 18.6169 12.5226 19.1934C12.9995 19.7698 13.6627 20.1618 14.3977 20.3018C15.1326 20.4418 15.8934 20.321 16.5489 19.9602C17.2044 19.5995 17.7135 19.0213 17.9884 18.3255C18.2634 17.6296 18.287 16.8596 18.0551 16.1483C17.8233 15.4369 17.3505 14.8287 16.7183 14.4285C16.0862 14.0283 15.3342 13.8611 14.592 13.9559C13.8498 14.0506 13.164 14.4013 12.6526 14.9475L9.49403 13.2257L6.3376 11.4729C6.53043 10.6772 6.4124 9.83801 6.0076 9.12643L9.49832 7.13143L12.4372 5.5275C12.5068 5.48902 12.5706 5.44106 12.6269 5.385C12.9879 5.77921 13.4414 6.07717 13.9466 6.25192C14.4517 6.42668 14.9924 6.47271 15.5198 6.38584C16.0472 6.29897 16.5447 6.08195 16.9671 5.75443C17.3895 5.4269 17.7235 4.99921 17.939 4.51006C18.1545 4.02091 18.2446 3.48574 18.2011 2.95301C18.1577 2.42027 17.982 1.90677 17.6902 1.459C17.3983 1.01123 16.9993 0.643318 16.5294 0.388565C16.0595 0.133812 15.5335 0.000260805 14.999 2.47381e-07Z" :fill="copiedPostId === post.id ? '#2BA69C' : '#5A6270'" class="group-hover:fill-[#A855F7]"/>
                                                </svg>
                                            </div>
                                            <span v-if="copiedPostId === post.id" class="text-xs text-[#2BA69C]">Copiado!</span>
                                        </button>
                                    </div>
                                    <time
                                        :datetime="post.createdAt"
                                        :title="formatPostFullDate(post.createdAt)"
                                        class="text-[#5A6270] text-sm hover:underline"
                                    >
                                        {{ formatPostDate(post.createdAt) }}
                                    </time>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else-if="tab == 'ratings'">
                        <div v-if="ratings && ratings.length === 0" class="px-8 py-6 text-[#5A6270] text-sm">
                            Nenhuma avaliação ainda.
                        </div>

                        <div
                            v-for="rating in ratings"
                            :key="rating.id"
                            class="px-8 py-4 flex gap-4 border-b border-[#5A6270]"
                        >
                            <RouterLink
                                v-if="rating.book"
                                :to="'/books/' + rating.book.id"
                                class="w-16 h-24 shrink-0 overflow-hidden rounded"
                            >
                                <img
                                    :src="rating.book.coverUrl"
                                    :alt="rating.book.title"
                                    class="w-full h-full object-cover"
                                >
                            </RouterLink>

                            <div class="flex flex-col gap-2 flex-1 min-w-0">
                                <div class="flex items-center justify-between gap-2">
                                    <RouterLink
                                        v-if="rating.book"
                                        :to="'/books/' + rating.book.id"
                                        class="text-[#CCD6E5] text-sm font-bold hover:underline truncate"
                                    >
                                        {{ rating.book.title }}
                                    </RouterLink>
                                    <time
                                        :datetime="rating.createdAt"
                                        :title="formatPostFullDate(rating.createdAt)"
                                        class="text-[#5A6270] text-sm shrink-0 hover:underline"
                                    >
                                        {{ formatPostDate(rating.createdAt) }}
                                    </time>
                                </div>

                                <div class="flex gap-0.5">
                                    <svg v-for="n in 5" :key="n" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 20 20" fill="none" class="mr-1">
                                        <path d="M20 11.6206C20 11.2383 18.3917 11.3428 18.2639 11.065C18.1361 10.7872 20.0461 8.51833 19.7683 8.00944C19.4906 7.50056 16.9428 8.65778 16.7822 8.40278C16.6222 8.14833 16.9444 6.45833 16.6667 6.25C16.3889 6.04167 13.75 8.98111 13.3794 8.63444C13.0089 8.28778 14.2361 2.80111 13.9828 2.69111C13.7294 2.58111 12.0833 3.44944 11.8756 3.40333C11.6678 3.35667 10.3789 0 10 0C9.62111 0 8.33222 3.35667 8.12444 3.40278C7.91667 3.44889 6.27056 2.58056 6.01722 2.69056C5.76389 2.80056 6.99056 8.28667 6.62 8.63389C6.25 8.98111 3.61111 6.04167 3.33333 6.25C3.05556 6.45833 3.37778 8.14833 3.21778 8.40278C3.05722 8.65722 0.509444 7.5 0.231667 8.00944C-0.0461111 8.51889 1.86444 10.7872 1.73611 11.065C1.60778 11.3428 0 11.2383 0 11.6206C0 12.0028 4.68778 14.5289 5 14.8267C5.31222 15.1244 3.38111 16.3833 3.65722 16.6206C3.97722 16.8961 5.79 16.1594 9.44444 16.0889V19.4444C9.44444 19.5918 9.50298 19.7331 9.60716 19.8373C9.71135 19.9415 9.85266 20 10 20C10.1473 20 10.2887 19.9415 10.3928 19.8373C10.497 19.7331 10.5556 19.5918 10.5556 19.4444V16.0889C14.2094 16.1594 16.0228 16.8961 16.3428 16.6206C16.6183 16.3828 14.6878 15.1239 15 14.8267C15.3122 14.5294 20 12.0022 20 11.6206Z"
                                            :fill="rating.leafs >= n ? '#2BA69C' : '#5A6270'"
                                        />
                                    </svg>
                                </div>

                                <p v-if="rating.comment" class="text-[#CCD6E5] text-sm whitespace-pre-wrap break-words">
                                    {{ rating.comment }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </div>

    </Template>
    <EditarPerfil
        v-if="showEditModal"
        :user="user"
        @close="showEditModal = false"
        @updated="onUpdated"
    />
</template>