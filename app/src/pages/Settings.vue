<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import Template from './base/Template.vue'
import api from '../services/api.js'

const router = useRouter()

const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
const activeSection = ref('account')

// Opções visuais de configuração (estado local)
const settings = ref({
    privateAccount: false,
    hideReadingActivity: false,
    allowDirectMessages: true,
    notifyLikes: true,
    notifyReplies: true,
    notifyFollowers: true,
    spoilerProtection: true,
    reduceMotion: false,
})

// Modal de exclusão de conta
const showDeleteModal = ref(false)
const confirmText = ref('')
const deleting = ref(false)
const deleteError = ref(null)

async function loadUserData() {
    if (!user.value?.username) return

    try {
        const { data } = await api.get(`/users/${user.value.username}`)
        user.value = { ...user.value, ...data }
    } catch (err) {
        console.error(err)
    }
}

function openDeleteModal() {
    confirmText.value = ''
    deleteError.value = null
    showDeleteModal.value = true
}

function closeDeleteModal() {
    if (deleting.value) return
    showDeleteModal.value = false
    confirmText.value = ''
    deleteError.value = null
}

async function deleteAccount() {
    if (confirmText.value.trim().toUpperCase() !== 'EXCLUIR') return

    deleting.value = true
    deleteError.value = null

    try {
        let userId = user.value?.id

        if (!userId && user.value?.username) {
            const { data } = await api.get(`/users/${user.value.username}`)
            userId = data.id
        }

        await api.delete(`/users/me`)

        localStorage.removeItem('token')
        localStorage.removeItem('user')

        router.push('/login')
    } catch (err) {
        console.error(err)
        deleteError.value = err.response?.data?.error || 'Não foi possível excluir a conta. Tente novamente.'
    } finally {
        deleting.value = false
    }
}

function voltar() {
    window.history.back()
}

onMounted(loadUserData)
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

                <div>
                    <h6 class="text-xl font-bold leading-tight text-[#CCD6E5]">Configurações</h6>
                    <p v-if="user" class="text-sm text-[#5A6270]">{{ '@' + user.username }}</p>
                </div>
            </div>

            <!-- Abas de navegação -->
            <div class="flex border-b border-[#5A6270]">
                <button
                    @click="activeSection = 'account'"
                    class="text-[#CCD6E5] font-bold w-full p-3 text-sm hover:bg-[#2E3B4E] hover:cursor-pointer transition-colors"
                    :class="activeSection === 'account' ? 'border-b-2 border-[#682B9C]' : 'text-[#5A6270]'"
                >
                    Sua conta
                </button>
                <button
                    @click="activeSection = 'privacy'"
                    class="text-[#CCD6E5] font-bold w-full p-3 text-sm hover:bg-[#2E3B4E] hover:cursor-pointer transition-colors"
                    :class="activeSection === 'privacy' ? 'border-b-2 border-[#682B9C]' : 'text-[#5A6270]'"
                >
                    Privacidade
                </button>
                <button
                    @click="activeSection = 'notifications'"
                    class="text-[#CCD6E5] font-bold w-full p-3 text-sm hover:bg-[#2E3B4E] hover:cursor-pointer transition-colors"
                    :class="activeSection === 'notifications' ? 'border-b-2 border-[#682B9C]' : 'text-[#5A6270]'"
                >
                    Notificações
                </button>
                <button
                    @click="activeSection = 'preferences'"
                    class="text-[#CCD6E5] font-bold w-full p-3 text-sm hover:bg-[#2E3B4E] hover:cursor-pointer transition-colors"
                    :class="activeSection === 'preferences' ? 'border-b-2 border-[#682B9C]' : 'text-[#5A6270]'"
                >
                    Exibição
                </button>
            </div>

            <!-- Conteúdo -->
            <div class="flex-1 overflow-y-auto">
                <!-- SEÇÃO: SUA CONTA -->
                <div v-if="activeSection === 'account'">
                    <div class="px-8 py-4 border-b border-[#5A6270]">
                        <p class="text-xs uppercase tracking-wider text-[#5A6270] font-semibold">Informações da conta</p>
                    </div>

                    <div class="px-8 py-4 flex items-center justify-between border-b border-[#5A6270] hover:bg-[#2E3B4E]/30 transition-colors">
                        <div>
                            <p class="text-sm font-semibold text-[#CCD6E5]">Nome de usuário</p>
                            <p class="text-sm text-[#5A6270]">{{ user ? '@' + user.username : '—' }}</p>
                        </div>
                        <span class="text-xs px-2.5 py-1 rounded-full bg-[#2E3B4E] text-[#CCD6E5]">Ativo</span>
                    </div>

                    <div class="px-8 py-4 flex items-center justify-between border-b border-[#5A6270] hover:bg-[#2E3B4E]/30 transition-colors">
                        <div>
                            <p class="text-sm font-semibold text-[#CCD6E5]">Nome de exibição</p>
                            <p class="text-sm text-[#5A6270]">{{ user?.name || '—' }}</p>
                        </div>
                        <RouterLink
                            v-if="user"
                            :to="`/users/${user.username}`"
                            class="text-xs font-semibold text-[#2BA69C] hover:underline"
                        >
                            Editar no perfil
                        </RouterLink>
                    </div>

                    <div class="px-8 py-4 flex items-center justify-between border-b border-[#5A6270] hover:bg-[#2E3B4E]/30 transition-colors">
                        <div>
                            <p class="text-sm font-semibold text-[#CCD6E5]">E-mail</p>
                            <p class="text-sm text-[#5A6270]">{{ user?.email || 'usuario@email.com' }}</p>
                        </div>
                        <span class="text-xs text-[#2BA69C]">Verificado</span>
                    </div>

                    <div class="px-8 py-4 flex items-center justify-between border-b border-[#5A6270] hover:bg-[#2E3B4E]/30 transition-colors">
                        <div>
                            <p class="text-sm font-semibold text-[#CCD6E5]">Idioma da interface</p>
                            <p class="text-sm text-[#5A6270]">Português (Brasil)</p>
                        </div>
                        <span class="text-xs text-[#5A6270]">Padrão</span>
                    </div>

                    <!-- Zona de perigo -->
                    <div class="px-8 py-4 border-b border-[#5A6270] mt-4">
                        <p class="text-xs uppercase tracking-wider text-red-400 font-semibold">Zona de perigo</p>
                    </div>

                    <button
                        @click="openDeleteModal"
                        class="w-full text-left px-8 py-5 flex items-center justify-between border-b border-[#5A6270] hover:bg-red-500/10 hover:cursor-pointer transition-colors group"
                    >
                        <div>
                            <p class="text-sm font-bold text-red-400 group-hover:text-red-300">Excluir sua conta</p>
                            <p class="text-xs text-[#5A6270] mt-0.5">
                                Remova permanentemente seu perfil, posts, resenhas, listas e avaliações.
                            </p>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="14" viewBox="0 0 12 19" fill="none" class="rotate-180 shrink-0">
                            <path d="M4.01878 9.4335L10.618 16.0327C10.9282 16.3429 11.0833 16.7378 11.0833 17.2172C11.0833 17.6966 10.9282 18.0915 10.618 18.4017C10.3078 18.7119 9.91296 18.867 9.43353 18.867C8.9541 18.867 8.55927 18.7119 8.24905 18.4017L0.465355 10.618C0.296144 10.4488 0.176569 10.2655 0.106628 10.068C0.0366879 9.87063 0.0011541 9.65912 2.60328e-05 9.4335C-0.00110204 9.20789 0.0344318 8.99637 0.106628 8.79896C0.178825 8.60155 0.2984 8.41824 0.465355 8.24903L8.24905 0.465329C8.55927 0.155109 8.9541 0 9.43353 0C9.91296 0 10.3078 0.155109 10.618 0.465329C10.9282 0.775549 11.0833 1.17037 11.0833 1.64981C11.0833 2.12924 10.9282 2.52406 10.618 2.83428L4.01878 9.4335Z" fill="#F87171"/>
                        </svg>
                    </button>
                </div>

                <!-- SEÇÃO: PRIVACIDADE -->
                <div v-else-if="activeSection === 'privacy'">
                    <div class="px-8 py-4 border-b border-[#5A6270]">
                        <p class="text-xs uppercase tracking-wider text-[#5A6270] font-semibold">Privacidade e segurança</p>
                    </div>

                    <div class="px-8 py-4 flex items-center justify-between gap-4 border-b border-[#5A6270]">
                        <div>
                            <p class="text-sm font-semibold text-[#CCD6E5]">Proteger suas postagens</p>
                            <p class="text-xs text-[#5A6270] mt-0.5">
                                Apenas seguidores aprovados poderão ver seus posts e respostas.
                            </p>
                        </div>
                        <button
                            @click="settings.privateAccount = !settings.privateAccount"
                            class="w-11 h-6 rounded-full transition-colors p-0.5 shrink-0 hover:cursor-pointer"
                            :class="settings.privateAccount ? 'bg-[#2BA69C]' : 'bg-[#2E3B4E]'"
                        >
                            <div
                                class="w-5 h-5 rounded-full bg-[#CCD6E5] transition-transform"
                                :class="settings.privateAccount ? 'translate-x-5' : 'translate-x-0'"
                            ></div>
                        </button>
                    </div>

                    <div class="px-8 py-4 flex items-center justify-between gap-4 border-b border-[#5A6270]">
                        <div>
                            <p class="text-sm font-semibold text-[#CCD6E5]">Ocultar atividade de leitura</p>
                            <p class="text-xs text-[#5A6270] mt-0.5">
                                Não exibir suas novas avaliações e listas no feed público de recomendações.
                            </p>
                        </div>
                        <button
                            @click="settings.hideReadingActivity = !settings.hideReadingActivity"
                            class="w-11 h-6 rounded-full transition-colors p-0.5 shrink-0 hover:cursor-pointer"
                            :class="settings.hideReadingActivity ? 'bg-[#2BA69C]' : 'bg-[#2E3B4E]'"
                        >
                            <div
                                class="w-5 h-5 rounded-full bg-[#CCD6E5] transition-transform"
                                :class="settings.hideReadingActivity ? 'translate-x-5' : 'translate-x-0'"
                            ></div>
                        </button>
                    </div>

                    <div class="px-8 py-4 flex items-center justify-between gap-4 border-b border-[#5A6270]">
                        <div>
                            <p class="text-sm font-semibold text-[#CCD6E5]">Permitir menções de qualquer pessoa</p>
                            <p class="text-xs text-[#5A6270] mt-0.5">
                                Escolha se outros leitores podem marcar seu @username em discussões de livros.
                            </p>
                        </div>
                        <button
                            @click="settings.allowDirectMessages = !settings.allowDirectMessages"
                            class="w-11 h-6 rounded-full transition-colors p-0.5 shrink-0 hover:cursor-pointer"
                            :class="settings.allowDirectMessages ? 'bg-[#2BA69C]' : 'bg-[#2E3B4E]'"
                        >
                            <div
                                class="w-5 h-5 rounded-full bg-[#CCD6E5] transition-transform"
                                :class="settings.allowDirectMessages ? 'translate-x-5' : 'translate-x-0'"
                            ></div>
                        </button>
                    </div>
                </div>

                <!-- SEÇÃO: NOTIFICAÇÕES -->
                <div v-else-if="activeSection === 'notifications'">
                    <div class="px-8 py-4 border-b border-[#5A6270]">
                        <p class="text-xs uppercase tracking-wider text-[#5A6270] font-semibold">Preferências de alerta</p>
                    </div>

                    <div class="px-8 py-4 flex items-center justify-between gap-4 border-b border-[#5A6270]">
                        <div>
                            <p class="text-sm font-semibold text-[#CCD6E5]">Curtidas</p>
                            <p class="text-xs text-[#5A6270] mt-0.5">Receber aviso quando alguém curtir seus posts ou resenhas.</p>
                        </div>
                        <button
                            @click="settings.notifyLikes = !settings.notifyLikes"
                            class="w-11 h-6 rounded-full transition-colors p-0.5 shrink-0 hover:cursor-pointer"
                            :class="settings.notifyLikes ? 'bg-[#2BA69C]' : 'bg-[#2E3B4E]'"
                        >
                            <div
                                class="w-5 h-5 rounded-full bg-[#CCD6E5] transition-transform"
                                :class="settings.notifyLikes ? 'translate-x-5' : 'translate-x-0'"
                            ></div>
                        </button>
                    </div>

                    <div class="px-8 py-4 flex items-center justify-between gap-4 border-b border-[#5A6270]">
                        <div>
                            <p class="text-sm font-semibold text-[#CCD6E5]">Respostas</p>
                            <p class="text-xs text-[#5A6270] mt-0.5">Receber aviso quando responderem às suas publicações.</p>
                        </div>
                        <button
                            @click="settings.notifyReplies = !settings.notifyReplies"
                            class="w-11 h-6 rounded-full transition-colors p-0.5 shrink-0 hover:cursor-pointer"
                            :class="settings.notifyReplies ? 'bg-[#2BA69C]' : 'bg-[#2E3B4E]'"
                        >
                            <div
                                class="w-5 h-5 rounded-full bg-[#CCD6E5] transition-transform"
                                :class="settings.notifyReplies ? 'translate-x-5' : 'translate-x-0'"
                            ></div>
                        </button>
                    </div>

                    <div class="px-8 py-4 flex items-center justify-between gap-4 border-b border-[#5A6270]">
                        <div>
                            <p class="text-sm font-semibold text-[#CCD6E5]">Novos seguidores</p>
                            <p class="text-xs text-[#5A6270] mt-0.5">Receber aviso quando alguém começar a seguir você.</p>
                        </div>
                        <button
                            @click="settings.notifyFollowers = !settings.notifyFollowers"
                            class="w-11 h-6 rounded-full transition-colors p-0.5 shrink-0 hover:cursor-pointer"
                            :class="settings.notifyFollowers ? 'bg-[#2BA69C]' : 'bg-[#2E3B4E]'"
                        >
                            <div
                                class="w-5 h-5 rounded-full bg-[#CCD6E5] transition-transform"
                                :class="settings.notifyFollowers ? 'translate-x-5' : 'translate-x-0'"
                            ></div>
                        </button>
                    </div>
                </div>

                <!-- SEÇÃO: EXIBIÇÃO -->
                <div v-else-if="activeSection === 'preferences'">
                    <div class="px-8 py-4 border-b border-[#5A6270]">
                        <p class="text-xs uppercase tracking-wider text-[#5A6270] font-semibold">Acessibilidade e exibição</p>
                    </div>

                    <div class="px-8 py-4 flex items-center justify-between gap-4 border-b border-[#5A6270]">
                        <div>
                            <p class="text-sm font-semibold text-[#CCD6E5]">Ocultar resenhas marcadas com spoiler</p>
                            <p class="text-xs text-[#5A6270] mt-0.5">Exibir aviso antes de revelar trechos com spoilers de livros.</p>
                        </div>
                        <button
                            @click="settings.spoilerProtection = !settings.spoilerProtection"
                            class="w-11 h-6 rounded-full transition-colors p-0.5 shrink-0 hover:cursor-pointer"
                            :class="settings.spoilerProtection ? 'bg-[#2BA69C]' : 'bg-[#2E3B4E]'"
                        >
                            <div
                                class="w-5 h-5 rounded-full bg-[#CCD6E5] transition-transform"
                                :class="settings.spoilerProtection ? 'translate-x-5' : 'translate-x-0'"
                            ></div>
                        </button>
                    </div>

                    <div class="px-8 py-4 flex items-center justify-between gap-4 border-b border-[#5A6270]">
                        <div>
                            <p class="text-sm font-semibold text-[#CCD6E5]">Reduzir animações</p>
                            <p class="text-xs text-[#5A6270] mt-0.5">Minimiza efeitos de transição na navegação entre páginas.</p>
                        </div>
                        <button
                            @click="settings.reduceMotion = !settings.reduceMotion"
                            class="w-11 h-6 rounded-full transition-colors p-0.5 shrink-0 hover:cursor-pointer"
                            :class="settings.reduceMotion ? 'bg-[#2BA69C]' : 'bg-[#2E3B4E]'"
                        >
                            <div
                                class="w-5 h-5 rounded-full bg-[#CCD6E5] transition-transform"
                                :class="settings.reduceMotion ? 'translate-x-5' : 'translate-x-0'"
                            ></div>
                        </button>
                    </div>

                    <div class="px-8 py-4 flex items-center justify-between border-b border-[#5A6270]">
                        <div>
                            <p class="text-sm font-semibold text-[#CCD6E5]">Tema</p>
                            <p class="text-xs text-[#5A6270] mt-0.5">Modo escuro padrão</p>
                        </div>
                        <span class="text-xs px-3 py-1 rounded-full border border-[#682B9C] text-[#CCD6E5]">Escuro</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal de Confirmação de Exclusão -->
        <div
            v-if="showDeleteModal"
            @click.self="closeDeleteModal"
            class="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4"
        >
            <div class="bg-[#0E121A] border border-[#5A6270] rounded-2xl max-w-md w-full p-6 flex flex-col gap-4 shadow-xl">
                <div class="flex items-start justify-between gap-3">
                    <div>
                        <h3 class="text-lg font-bold text-[#CCD6E5]">Excluir conta permanentemente?</h3>
                        <p class="text-xs text-[#5A6270] mt-1">Esta ação não pode ser desfeita.</p>
                    </div>
                    <button
                        @click="closeDeleteModal"
                        :disabled="deleting"
                        class="text-[#5A6270] hover:text-[#CCD6E5] text-lg leading-none hover:cursor-pointer"
                    >
                        ✕
                    </button>
                </div>

                <div class="bg-red-500/10 border border-red-500/30 rounded-xl p-3.5 text-xs text-red-300 leading-relaxed">
                    Ao confirmar, seu perfil <strong v-if="user">({{ '@' + user.username }})</strong>, todos os seus posts, respostas, resenhas, listas e avaliações serão apagados definitivamente.
                </div>

                <div class="flex flex-col gap-1.5">
                    <label class="text-xs text-[#CCD6E5]">
                        Digite <span class="font-bold text-red-400">EXCLUIR</span> para confirmar:
                    </label>
                    <input
                        v-model="confirmText"
                        type="text"
                        placeholder="EXCLUIR"
                        :disabled="deleting"
                        class="w-full px-3.5 py-2.5 rounded-xl bg-[#0E121A] border border-[#5A6270] text-sm text-[#CCD6E5] placeholder-[#5A6270] focus:outline-none focus:border-red-400"
                    />
                </div>

                <p v-if="deleteError" class="text-xs text-red-400">
                    {{ deleteError }}
                </p>

                <div class="flex items-center justify-end gap-3 pt-2">
                    <button
                        @click="closeDeleteModal"
                        :disabled="deleting"
                        class="px-4 py-2 rounded-full border border-[#5A6270] text-sm font-semibold text-[#CCD6E5] hover:bg-[#2E3B4E] hover:cursor-pointer transition-colors disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        @click="deleteAccount"
                        :disabled="deleting || confirmText.trim().toUpperCase() !== 'EXCLUIR'"
                        class="px-5 py-2 rounded-full bg-red-600 hover:bg-red-500 text-sm font-bold text-white hover:cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {{ deleting ? 'Excluindo...' : 'Excluir conta' }}
                    </button>
                </div>
            </div>
        </div>
    </Template>
</template>