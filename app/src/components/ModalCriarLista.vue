<template>
  <ModalBase width-class="w-[380px]" z-class="z-[60]" @close="$emit('close')">
    <template #title>
      Qual vai ser o nome da sua <span class="text-[#A78BFA]">lista</span>?
    </template>

    <input
      v-model="name"
      type="text"
      placeholder="Lorem ipsum dolor sit amet consecteteur"
      class="w-full bg-transparent border-b border-white/30 text-white placeholder-white/40 pb-2 mb-2 focus:outline-none focus:border-[#2BA69C]"
      @keyup.enter="criar"
    />
    <p v-if="error" class="text-red-400 text-sm mt-2">{{ error }}</p>

    <template #footer>
      <div class="flex items-center justify-between mt-4">
        <button
          type="button"
          class="px-6 py-2 rounded-full border border-white/40 text-white hover:bg-white/10 transition-colors"
          @click="$emit('close')"
        >
          Cancelar
        </button>
        <button
          type="button"
          class="px-6 py-2 rounded-full bg-[#CCD6E5] text-[#0E121A] font-bold hover:bg-[#2BA69C] transition-colors disabled:opacity-50"
          :disabled="!name.trim() || loading"
          @click="criar"
        >
          {{ loading ? 'Criando...' : 'Criar' }}
        </button>
      </div>
    </template>
  </ModalBase>
</template>

<script setup>
import { ref } from 'vue'
import api from '../services/api.js'
import ModalBase from './ModalBase.vue'

const emit = defineEmits(['close', 'criada'])

const name = ref('')
const loading = ref(false)
const error = ref(null)

async function criar() {
  if (!name.value.trim()) return
  loading.value = true
  error.value = null
  try {
    const { data } = await api.post('/lists', { name: name.value.trim(), isPrivate: false })
    emit('criada', data)
  } catch (err) {
    console.error(err)
    error.value = err.response?.data?.error || 'Não foi possível criar a lista.'
  } finally {
    loading.value = false
  }
}
</script>