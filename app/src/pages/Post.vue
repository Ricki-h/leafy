<script setup>
import { computed, onMounted, ref, onBeforeUnmount, nextTick } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import Template from './base/Template.vue'
import api from '../services/api.js'
import autosize from 'autosize'

const route = useRoute()

const loading = ref(null)

async function follow() {
    try {
        await api.post(`/users/${route.params.username}/follow`)

        await loadFollowingQtd()
        await loadFollowsQtd()
    }
    catch (err) {
        console.error(err)
    }
}

const post = ref(null)
async function loadPost() {
    try {
        loading.value = true
        const { data } = await api.get(`/posts/${route.params.id}`)

        post.value = data
    }
    catch (err) {
        console.error(err)
    }
    loading.value = false
}

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

const me = ref(null)
async function loadMe() {
    try {
        const user = JSON.parse(localStorage.getItem('user'))
        
        const { data } = await api.get(`/users/${user.username}`)
    
        me.value = data
        console.log(data)
    }
    catch(err) {
        console.error(err)
    }
}

const loadingPost = ref(false)
async function responder() {
    try {
        loadingPost.value = true
        await api.post('/posts/', {
            content: content.value,
            paremtId: post.id
        })
        
        content.value = ''
    }
    catch(err) {
        console.error(err)
    }
    loadingPost.value = false
}

const textarea = ref(null)

onMounted(async () => {
    await Promise.all([
        loadMe(),
        loadPost()
    ])

    await nextTick()

    autosize(textarea.value)
})
onBeforeUnmount(() => {
  autosize.destroy(textarea.value)
})
</script>

<template>
    <Template>
        <div v-if="loading == false" class="flex flex-col h-screen">
            <div class="flex border-b border-[#5A6270] px-8 py-6">
                <button @click="voltar" class="flex items-center gap-2 hover:cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="9" height="16" viewBox="0 0 12 19" fill="none">
                        <path d="M4.01878 9.4335L10.618 16.0327C10.9282 16.3429 11.0833 16.7378 11.0833 17.2172C11.0833 17.6966 10.9282 18.0915 10.618 18.4017C10.3078 18.7119 9.91296 18.867 9.43353 18.867C8.9541 18.867 8.55927 18.7119 8.24905 18.4017L0.465355 10.618C0.296144 10.4488 0.176569 10.2655 0.106628 10.068C0.0366879 9.87063 0.0011541 9.65912 2.60328e-05 9.4335C-0.00110204 9.20789 0.0344318 8.99637 0.106628 8.79896C0.178825 8.60155 0.2984 8.41824 0.465355 8.24903L8.24905 0.465329C8.55927 0.155109 8.9541 0 9.43353 0C9.91296 0 10.3078 0.155109 10.618 0.465329C10.9282 0.775549 11.0833 1.17037 11.0833 1.64981C11.0833 2.12924 10.9282 2.52406 10.618 2.83428L4.01878 9.4335Z" fill="#CCD6E5"/>
                    </svg>
                    <span>voltar</span>
                </button>   
            </div>
            <div class="flex flex-col items-center">
                <div class="px-8 py-3 flex flex-col gap-3 border-b border-[#5A6270] w-full">
                    <div class="flex gap-3">
                        <RouterLink class="w-12 h-12 rounded-full hover:cursor-pointer">
                            <img :src="post.user.avatarUrl" alt="" class="w-full">
                        </RouterLink>
                        <div>
                            <p class="text-[#CCD6E5] font-semibold">{{ post.user.name }}</p>
                            <p class="text-[#5A6270] hover:cursor-pointer">{{ '@' + post.user.username }}</p>
                        </div>
                    </div>
                    <div class="flex flex-col gap-2">
                        <p class="text-[#CCD6E5]">
                            {{ post.content }}
                        </p>
                        <div class="flex gap-4 text-[#5A6270] text-sm">
                            <button @click="toggleLike(post)" class="flex items-center gap-1 group hover:cursor-pointer hover:text-[#FF82BD]">
                                <div  class="group-hover:bg-[#463449] px-2 py-2 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="13" viewBox="0 0 14 13" fill="none">
                                        <path v-if="post.likedByUser" d="M10.15 0C8.932 0 7.763 0.567 7 1.456C6.237 0.567 5.068 0 3.85 0C1.694 0 0 1.687 0 3.85C0 6.489 2.38 8.652 5.985 11.921L7 12.845L8.015 11.921C11.62 8.652 14 6.489 14 3.85C14 1.687 12.306 0 10.15 0Z" fill="#FF82BD" class="group-hover:fill-[#FF82BD]"/>
                                        <path v-else d="M7.07 10.885L7 10.955L6.923 10.885C3.598 7.868 1.4 5.873 1.4 3.85C1.4 2.45 2.45 1.4 3.85 1.4C4.928 1.4 5.978 2.1 6.349 3.052H7.651C8.022 2.1 9.072 1.4 10.15 1.4C11.55 1.4 12.6 2.45 12.6 3.85C12.6 5.873 10.402 7.868 7.07 10.885ZM10.15 0C8.932 0 7.763 0.567 7 1.456C6.237 0.567 5.068 0 3.85 0C1.694 0 0 1.687 0 3.85C0 6.489 2.38 8.652 5.985 11.921L7 12.845L8.015 11.921C11.62 8.652 14 6.489 14 3.85C14 1.687 12.306 0 10.15 0Z" fill="#5A6270" class="group-hover:fill-[#FF82BD]"/>
                                    </svg>
                                </div>
                                <span>
                                    {{ post.likesCount }}
                                </span>
                            </button>
                            <button class="flex items-center gap-1 group hover:cursor-pointer hover:text-[#2BA69C]">
                                <div  class="group-hover:bg-[#1C3B42] px-2 py-2 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="14" viewBox="0 0 15 14" fill="none">
                                        <path d="M7.01973 0C6.10048 0 5.19023 0.18106 4.34095 0.532843C3.49167 0.884626 2.71999 1.40024 2.06998 2.05025C0.757228 3.36301 0.0197305 5.14348 0.0197305 7C0.0142012 8.61629 0.573806 10.1837 1.60173 11.431L0.20173 12.831C0.1046 12.9294 0.0388027 13.0544 0.0126408 13.1902C-0.013521 13.326 0.00112483 13.4665 0.0547304 13.594C0.112871 13.72 0.207123 13.8258 0.325523 13.8981C0.443923 13.9704 0.581131 14.0058 0.71973 14H7.01973C8.87625 14 10.6567 13.2625 11.9695 11.9497C13.2822 10.637 14.0197 8.85652 14.0197 7C14.0197 5.14348 13.2822 3.36301 11.9695 2.05025C10.6567 0.737498 8.87625 0 7.01973 0ZM7.01973 12.6H2.40673L3.05773 11.949C3.18811 11.8178 3.26129 11.6404 3.26129 11.4555C3.26129 11.2706 3.18811 11.0932 3.05773 10.962C2.14114 10.0464 1.57035 8.84138 1.44261 7.55216C1.31488 6.26293 1.63809 4.9693 2.35719 3.89167C3.07629 2.81403 4.14678 2.01905 5.38629 1.64218C6.6258 1.26531 7.95763 1.32986 9.15488 1.82484C10.3521 2.31982 11.3407 3.21459 11.9522 4.35672C12.5637 5.49886 12.7603 6.81768 12.5085 8.08851C12.2567 9.35933 11.572 10.5035 10.5712 11.3262C9.57037 12.1488 8.31526 12.599 7.01973 12.6Z" fill="#5A6270" class="group-hover:fill-[#2BA69C]"/>
                                    </svg>
                                </div>
                                <span>
                                    {{ post.repliesCount }}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
                
            </div>
            <div class="px-8 py-4 border-b border-[#5A6270] flex flex-col gap-4">
                <p class="text-[#5A6270]">Respondendo a <span class="text-[#2BA69C]">{{ '@' + post.user.username }}</span></p>
                <div class="flex gap-4">
                    <img :src="me.avatarUrl" alt="" class="w-12 h-12">
                    <textarea
                    ref="textarea"
                    v-model="content"
                    maxlength="280"
                    placeholder="Poste a sua resposta"
                    class="w-full resize-none overflow-hidden bg-transparent border-none focus:outline-none focus:ring-0 text-[#CCD6E5] placeholder-[#5A6270]"
                    ></textarea>
                    <button @click="responder" class="rounded-full bg-[#CCD6E5] hover:bg-[#2BA69C] px-6 text-center flex items-center hover:cursor-pointer text-[#0E121A] font-bold justify-center" :disabled="loadingPost">
                        {{ loadingPost ? 'Respondendo' : 'Responder' }}
                    </button>
                </div>
            </div>
            
        </div>
        <Loading v-else class="mt-8"></Loading>
    </Template>
</template>