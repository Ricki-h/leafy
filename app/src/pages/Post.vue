<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import Template from './base/Template.vue'
import api from '../services/api.js'

const route = useRoute()


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
        const { data } = await api.get(`/posts/${route.params.id}`)

        post.value = data
    }
    catch (err) {
        console.error(err)
    }
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

onMounted(async () => {
    await loadPosts()
})
</script>

<template>
    <Template>
        <div class="flex flex-col h-screen">
            
        </div>
    </Template>
</template>