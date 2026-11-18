<script setup>
import { onBeforeUnmount, ref } from 'vue'
import api from '../services/api.js'
import BaseModal from './ModalBase.vue' // Ajuste o caminho do seu modal base
import UserAvatar from './AvatarImagem.vue' // Ajuste o caminho do seu componente de avatar

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'updated'])

const form = ref({
  name: props.user.name ?? '',
  bio: props.user.bio ?? ''
})

const avatarFile = ref(null)
const avatarPreview = ref(props.user.avatarUrl ?? null)
const avatarInput = ref(null)
const saving = ref(false)
const errorMessage = ref('')

function revokePreview() {
  if (avatarPreview.value && avatarPreview.value.startsWith('blob:')) {
    URL.revokeObjectURL(avatarPreview.value)
  }
}

function close() {
  emit('close')
}

function triggerAvatarInput() {
  avatarInput.value?.click()
}

function onAvatarChange(event) {
  const file = event.target.files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    errorMessage.value = 'O arquivo selecionado não é uma imagem.'
    return
  }

  errorMessage.value = ''
  avatarFile.value = file

  revokePreview()
  avatarPreview.value = URL.createObjectURL(file)
  event.target.value = ''
}

function removeAvatar() {
  revokePreview()
  avatarFile.value = null
  avatarPreview.value = props.user.avatarUrl ?? null
}

async function save() {
  saving.value = true
  errorMessage.value = ''

  try {
    const { data: profileData } = await api.patch('/users/me', {
      name: form.value.name,
      bio: form.value.bio
    })

    let avatarData = null

    if (avatarFile.value) {
      const formData = new FormData()
      formData.append('avatar', avatarFile.value)

      // não defina Content-Type manualmente: o navegador gera com o boundary
      const response = await api.patch('/users/me/avatar', formData)
      avatarData = response.data
    }

    // o pai recarrega o perfil completo; aqui só avisamos que salvou
    emit('updated', { ...profileData, ...avatarData })
    emit('close')
  } catch (err) {
    console.error(err)
    errorMessage.value =
      err?.response?.data?.message || 'Não foi possível salvar. Tente novamente.'
  } finally {
    saving.value = false
  }
}

// libera a URL temporária da prévia ao fechar o modal
onBeforeUnmount(revokePreview)
</script>

<template>
  <BaseModal
    width-class="w-full max-w-md"
    panel-class="border border-[#2a3142] shadow-2xl"
    @close="close"
  >
    <!-- Slot de Título / Cabeçalho Superior -->
    <template #title>
      <div class="flex items-center justify-between w-full">
        <button
          type="button"
          @click="close"
          class="w-8 h-8 rounded-full border border-[#2BA69C]/60 text-[#2BA69C] flex items-center justify-center hover:bg-white/10 transition"
          aria-label="Fechar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <button
          type="button"
          @click="save"
          :disabled="saving"
          class="px-4 py-1.5 rounded-full bg-white text-[#171a24] text-sm font-medium flex items-center gap-1 hover:bg-gray-100 transition disabled:opacity-60"
        >
          {{ saving ? 'Salvando...' : 'Salvar' }}
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </template>

    <!-- Slot Default (Corpo do Modal) -->
    <div class="flex flex-col space-y-4 pt-2">
      <!-- Seção do Avatar com o novo componente UserAvatar -->
      <div class="flex flex-col items-center justify-center">
        <div class="relative group cursor-pointer" @click="triggerAvatarInput">
          <UserAvatar
            :src="avatarPreview"
            :name="form.name || user.name"
            size-class="w-30 h-30 border-2 border-[#2a3142]"
          />

          <!-- Overlay para indicar edição ao passar o mouse -->
          <div class="absolute inset-0 rounded-full flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <circle cx="12" cy="13" r="3.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>

          <!-- Input oculto para carregar arquivo -->
          <input
            ref="avatarInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="onAvatarChange"
          />
        </div>

        <button
          v-if="avatarFile"
          type="button"
          @click="removeAvatar"
          class="mt-2 text-xs text-[#2BA69C] hover:underline"
        >
          Remover nova foto
        </button>
      </div>

      <!-- Formulário -->
      <div class="space-y-4">
        <div>
          <label class="block text-xs text-[#2BA69C] mb-1" for="nome">Nome</label>
          <input
            id="nome"
            v-model="form.name"
            type="text"
            placeholder="Nome"
            class="w-full bg-[#171a2a] border border-[#2a3142] rounded-lg px-3 py-2 text-gray-100 placeholder-gray-500 text-sm focus:outline-none focus:border-[#2BA69C] transition"
          />
        </div>

        <div>
          <label class="block text-xs text-[#2BA69C] mb-1" for="bio">Bio</label>
          <textarea
            id="bio"
            v-model="form.bio"
            rows="3"
            placeholder="Fale um pouco sobre você"
            class="w-full bg-[#171a2a] border border-[#2a3142] rounded-lg px-3 py-2 text-gray-300 placeholder-gray-500 text-sm leading-relaxed focus:outline-none focus:border-[#2BA69C] transition"
          ></textarea>
        </div>

        <!-- Mensagem de erro -->
        <p v-if="errorMessage" role="alert" class="text-sm text-red-400">
          {{ errorMessage }}
        </p>
      </div>
    </div>
  </BaseModal>
</template>