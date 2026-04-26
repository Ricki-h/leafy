<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../services/api.js'

const route = useRoute()
const router = useRouter()
const mensagem = ref('Verificando...')
const erro = ref('')

onMounted(async () => {
  try {
    const token = route.query.token
    const res = await api.get(`/auth/verificar-email?token=${token}`)
    mensagem.value = res.data.message
    setTimeout(() => router.push('/login'), 3000)
  } catch (err) {
    erro.value = err.response?.data?.error || 'Token inválido ou expirado.'
  }
})
</script>

<template>
  <main class="min-h-screen flex items-center justify-center">
    <div class="bg-white p-8 rounded-xl shadow text-center max-w-sm w-full">
      <p v-if="erro" class="text-red-500">{{ erro }}</p>
      <p v-else class="text-green-600">{{ mensagem }}</p>
      <p v-if="!erro" class="text-gray-400 text-sm mt-2">Redirecionando para o login...</p>
    </div>
  </main>
</template>