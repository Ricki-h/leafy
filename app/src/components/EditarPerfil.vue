<script setup>
import { ref } from 'vue'
import api from '../services/api.js'

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


function close() {
    emit('close')
}

const saving = ref(false)
async function save() {
    saving.value = true
    try {
        const { data } = await api.patch('/users/me', {
            name: form.value.name,
            bio: form.value.bio
        })

        emit('updated', data)
        emit('close')
    } catch (err) {
        console.error(err)
    } finally {
        saving.value = false
    }
}
</script>

<template>
    <div class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4" @click.self="close">
        <div class="w-full max-w-md rounded-2xl overflow-hidden bg-[#171a24] border border-[#2a3142] shadow-2xl">

            <!-- Banner -->
            <div class="flex items-center justify-between px-4 py-3 bg-[#171a24]">
                <button
                    @click="close"
                    class="w-8 h-8 rounded-full border border-[#2BA69C]/60 text-[#2BA69C] flex items-center justify-center hover:bg-white/10 transition"
                    aria-label="Fechar"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <button
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

            <!-- Banner roxo com os ícones de capa -->
            <div class="relative h-28 flex items-center justify-center gap-3 bg-[#682B9C]" >
                <button
                    class="w-9 h-9 rounded-full bg-black/40 border border-white/10 text-white flex items-center justify-center hover:bg-black/60 transition"
                    aria-label="Remover capa"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <button
                    class="w-9 h-9 rounded-full bg-black/40 border border-white/10 text-white flex items-center justify-center hover:bg-black/60 transition"
                    aria-label="Alterar capa"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <circle cx="12" cy="13" r="3.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>
                
            

            <!-- Avatar -->
            <div class="relative px-6">
                <div class="-mt-10 mb-2">
                    <div class="relative w-20 h-20 rounded-full bg-gray-400 border-4 border-[#171a24] flex items-center justify-center overflow-hidden">
                        <img v-if="avatarPreview" :src="avatarPreview" class="w-full h-full object-cover" />
                        <button
                            
                            class="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition"
                            aria-label="Alterar foto de perfil"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <circle cx="12" cy="13" r="3.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </div>
                    
                </div>
            </div>

            <!-- Form -->
            <div class="px-6 pb-6 pt-2 space-y-4">
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
            </div>
        </div>
    </div>
</template>