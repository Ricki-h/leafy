<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import Template from './base/Template.vue'
import Loading from '../components/Loading.vue'
import api from '../services/api.js'

const route = useRoute()
const router = useRouter()

const isAuthorized = ref(false)
const loading = ref(true)
const error = ref(null)

const log = ref(null)
const logUser = ref(null)
const copiedField = ref('')

function formatLogDate(dateString) {
    if (!dateString) return '—'
    return new Date(dateString).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    })
}

function getStatusBadgeClass(statusCode) {
    const code = Number(statusCode)
    if (!code) return 'bg-[#2E3B4E]/50 text-[#CCD6E5] border-[#5A6270]'
    if (code >= 500) return 'bg-red-500/15 text-red-400 border-red-500/40'
    if (code >= 400) return 'bg-[#FF82BD]/15 text-[#FF82BD] border-[#FF82BD]/40'
    return 'bg-[#2BA69C]/15 text-[#2BA69C] border-[#2BA69C]/30'
}

const payload = computed(() => {
    if (!log.value) return null
    return log.value.details || log.value.metadata || log.value.meta || log.value.changes || log.value.data || null
})

// Separa seções do payload (ex: params, query, body) se for um objeto
const payloadSections = computed(() => {
    if (!payload.value) return []
    if (typeof payload.value === 'string') {
        return [{ key: 'Detalhes', value: payload.value }]
    }
    if (typeof payload.value === 'object') {
        return Object.entries(payload.value)
            .filter(([, val]) => val !== undefined && val !== null && !(typeof val === 'object' && Object.keys(val).length === 0))
            .map(([key, value]) => ({ key, value }))
    }
    return []
})

// Captura quaisquer campos adicionais não padrão salvos no model AuditLog
const extraFields = computed(() => {
    if (!log.value) return []
    const knownKeys = new Set([
        'id', 'action', 'statusCode', 'method', 'route', 'path',
        'userId', 'ip', 'userAgent', 'message', 'description',
        'details', 'metadata', 'meta', 'changes', 'data',
        'createdAt', 'updatedAt'
    ])
    return Object.entries(log.value)
        .filter(([key, val]) => !knownKeys.has(key) && val !== null && val !== undefined && val !== '')
        .map(([key, value]) => ({ key, value }))
})

async function copyText(text, fieldName) {
    try {
        await navigator.clipboard.writeText(typeof text === 'string' ? text : JSON.stringify(text, null, 2))
        copiedField.value = fieldName
        setTimeout(() => {
            if (copiedField.value === fieldName) copiedField.value = ''
        }, 2000)
    } catch (err) {
        console.error('Erro ao copiar:', err)
    }
}

async function fetchLogDetail() {
    loading.value = true
    error.value = null

    try {
        const { data } = await api.get(`/admin/audit-logs/${route.params.id}`)

        // Suporta tanto { log, user } quanto o objeto do log direto
        if (data?.log) {
            log.value = data.log
            logUser.value = data.user || null
        } else {
            log.value = data
            logUser.value = data.user || null
        }

        // Fallback: se o backend retornou só o log com userId sem o objeto user
        if (!logUser.value && log.value?.userId) {
            try {
                const userRes = await api.get(`/users/${log.value.userId}`)
                logUser.value = userRes.data
            } catch {
                // Ignora caso a rota /users/:id não exista ou o usuário tenha sido removido
            }
        }
    } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
            router.replace('/')
            return
        }
        console.error('Erro ao buscar detalhes do log:', err)
        error.value = err.response?.data?.error || 'Não foi possível carregar os detalhes deste log.'
    } finally {
        loading.value = false
    }
}

function verifyAdminAndLoad() {
    const rawUser = localStorage.getItem('user')
    if (!rawUser) {
        router.replace('/')
        return
    }

    try {
        const parsedUser = JSON.parse(rawUser)
        if (!parsedUser?.username || parsedUser.role !== 'admin') {
            router.replace('/')
            return
        }

        isAuthorized.value = true
        fetchLogDetail()
    } catch {
        router.replace('/')
    }
}

function voltar() {
    if (window.history.state?.back) {
        router.back()
    } else {
        router.push('/logs')
    }
}

onMounted(verifyAdminAndLoad)
</script>

<template>
    <Template v-if="isAuthorized">
        <div
            style="contain: inline-size;"
            class="flex flex-col w-full min-w-0 h-full overflow-hidden border-r border-[#5A6270]"
        >
            <!-- Cabeçalho -->
            <div class="flex items-center justify-between gap-4 border-b border-[#5A6270] px-8 py-6 min-w-0">
                <div class="flex items-center gap-4 min-w-0">
                    <button @click="voltar" class="flex items-center gap-2 hover:cursor-pointer shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="9" height="16" viewBox="0 0 12 19" fill="none">
                            <path d="M4.01878 9.4335L10.618 16.0327C10.9282 16.3429 11.0833 16.7378 11.0833 17.2172C11.0833 17.6966 10.9282 18.0915 10.618 18.4017C10.3078 18.7119 9.91296 18.867 9.43353 18.867C8.9541 18.867 8.55927 18.7119 8.24905 18.4017L0.465355 10.618C0.296144 10.4488 0.176569 10.2655 0.106628 10.068C0.0366879 9.87063 0.0011541 9.65912 2.60328e-05 9.4335C-0.00110204 9.20789 0.0344318 8.99637 0.106628 8.79896C0.178825 8.60155 0.2984 8.41824 0.465355 8.24903L8.24905 0.465329C8.55927 0.155109 8.9541 0 9.43353 0C9.91296 0 10.3078 0.155109 10.618 0.465329C10.9282 0.775549 11.0833 1.17037 11.0833 1.64981C11.0833 2.12924 10.9282 2.52406 10.618 2.83428L4.01878 9.4335Z" fill="#CCD6E5"/>
                        </svg>
                    </button>

                    <div class="flex flex-col min-w-0">
                        <h6 class="text-xl font-bold leading-tight text-[#CCD6E5] truncate">Detalhes do Log</h6>
                        <span class="text-xs font-mono text-[#5A6270] truncate">ID: {{ route.params.id }}</span>
                    </div>
                </div>

                <button
                    v-if="log"
                    @click="copyText(log, 'fullLog')"
                    class="px-4 py-1.5 rounded-full border border-[#2BA69C] text-[#2BA69C] hover:bg-[#2BA69C] hover:text-[#0E121A] text-xs font-bold hover:cursor-pointer transition-colors shrink-0"
                >
                    {{ copiedField === 'fullLog' ? 'Copiado!' : 'Copiar JSON' }}
                </button>
            </div>

            <!-- Conteúdo -->
            <div class="flex-1 min-h-0 overflow-y-auto px-8 py-6 flex flex-col gap-6">
                <div v-if="loading" class="flex justify-center py-12">
                    <Loading />
                </div>

                <div v-else-if="error" class="text-center text-red-400 text-sm py-12">
                    {{ error }}
                </div>

                <template v-else-if="log">
                    <!-- Resumo principal -->
                    <div class="p-5 rounded-2xl bg-[#0E121A] border border-[#5A6270] flex flex-col gap-3">
                        <div class="flex items-center justify-between gap-2 flex-wrap">
                            <div class="flex items-center gap-2 flex-wrap">
                                <span
                                    v-if="log.statusCode"
                                    class="px-3 py-1 rounded-full text-xs font-mono font-bold border"
                                    :class="getStatusBadgeClass(log.statusCode)"
                                >
                                    Status {{ log.statusCode }}
                                </span>

                                <span class="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#2BA69C]/15 text-[#2BA69C] border border-[#2BA69C]/30">
                                    {{ log.action || 'ACTION' }}
                                </span>
                            </div>

                            <time class="text-xs text-[#5A6270] font-mono">
                                {{ formatLogDate(log.createdAt) }}
                            </time>
                        </div>

                        <p v-if="log.method || log.route || log.path" class="text-sm font-mono text-[#974EFD] break-all">
                            {{ [log.method, log.route || log.path].filter(Boolean).join(' ') }}
                        </p>

                        <p v-if="log.message || log.description" class="text-sm text-[#CCD6E5] break-words">
                            {{ log.message || log.description }}
                        </p>
                    </div>

                    <!-- Informações do Usuário -->
                    <div class="flex flex-col gap-2">
                        <span class="text-xs font-bold uppercase tracking-wider text-[#5A6270]">
                            Usuário responsável
                        </span>

                        <div v-if="logUser" class="p-5 rounded-2xl bg-[#0E121A] border border-[#5A6270] flex items-center justify-between gap-4 flex-wrap">
                            <div class="flex items-center gap-3.5 min-w-0">
                                <RouterLink
                                    :to="`/users/${logUser.username}`"
                                    class="w-12 h-12 rounded-full overflow-hidden bg-[#2E3B4E] shrink-0 flex items-center justify-center"
                                >
                                    <img v-if="logUser.avatarUrl" :src="logUser.avatarUrl" :alt="logUser.name" class="w-full h-full object-cover" />
                                    <span v-else class="text-base font-bold text-[#CCD6E5]">
                                        {{ logUser.name?.charAt(0)?.toUpperCase() || '?' }}
                                    </span>
                                </RouterLink>

                                <div class="flex flex-col min-w-0">
                                    <div class="flex items-center gap-2 flex-wrap">
                                        <RouterLink
                                            :to="`/users/${logUser.username}`"
                                            class="text-base font-bold text-[#CCD6E5] hover:text-[#2BA69C] transition-colors truncate"
                                        >
                                            {{ logUser.name }}
                                        </RouterLink>
                                        <span
                                            v-if="logUser.role"
                                            class="px-2 py-0.5 rounded-full text-[11px] font-bold uppercase border"
                                            :class="logUser.role === 'admin'
                                                ? 'bg-[#682B9C]/30 text-[#CCD6E5] border-[#682B9C]'
                                                : 'bg-[#2E3B4E]/50 text-[#5A6270] border-[#5A6270]/50'"
                                        >
                                            {{ logUser.role }}
                                        </span>
                                    </div>

                                    <span class="text-sm text-[#2BA69C]">{{ '@' + logUser.username }}</span>
                                    <span v-if="logUser.email" class="text-xs text-[#5A6270] truncate">{{ logUser.email }}</span>
                                    <span class="text-xs font-mono text-[#5A6270] mt-0.5 break-all">ID: {{ logUser.id }}</span>
                                </div>
                            </div>

                            <div class="flex items-center gap-2 shrink-0">
                                <button
                                    @click="copyText(logUser.id, 'userId')"
                                    class="px-3 py-1.5 rounded-full bg-[#18202C] border border-[#5A6270] hover:border-[#2BA69C] text-xs text-[#CCD6E5] hover:cursor-pointer transition-colors"
                                >
                                    {{ copiedField === 'userId' ? 'ID Copiado!' : 'Copiar ID' }}
                                </button>
                                <RouterLink
                                    :to="`/users/${logUser.username}`"
                                    class="px-3.5 py-1.5 rounded-full bg-[#2BA69C] text-[#0E121A] text-xs font-bold hover:opacity-90 transition-opacity"
                                >
                                    Ver perfil
                                </RouterLink>
                            </div>
                        </div>

                        <div v-else-if="log.userId" class="p-4 rounded-2xl bg-[#0E121A] border border-[#5A6270] flex items-center justify-between gap-3 flex-wrap">
                            <div class="flex flex-col min-w-0">
                                <span class="text-sm text-[#CCD6E5] font-semibold">Usuário não encontrado no banco</span>
                                <span class="text-xs font-mono text-[#5A6270] break-all">userId: {{ log.userId }}</span>
                            </div>
                            <button
                                @click="copyText(log.userId, 'userId')"
                                class="px-3 py-1.5 rounded-full bg-[#18202C] border border-[#5A6270] hover:border-[#2BA69C] text-xs text-[#CCD6E5] hover:cursor-pointer shrink-0"
                            >
                                {{ copiedField === 'userId' ? 'Copiado!' : 'Copiar ID' }}
                            </button>
                        </div>

                        <div v-else class="p-4 rounded-2xl bg-[#0E121A] border border-[#5A6270] text-sm text-[#5A6270]">
                            Requisição não autenticada (sem <code class="font-mono text-[#CCD6E5]">userId</code> vinculado).
                        </div>
                    </div>

                    <!-- Metadados Técnicos -->
                    <div class="flex flex-col gap-2">
                        <span class="text-xs font-bold uppercase tracking-wider text-[#5A6270]">
                            Metadados da Requisição
                        </span>

                        <div class="rounded-2xl bg-[#0E121A] border border-[#5A6270] divide-y divide-[#5A6270]/50 text-sm">
                            <div class="px-5 py-3 flex items-center justify-between gap-4">
                                <span class="text-[#5A6270] shrink-0">ID do Log</span>
                                <span class="font-mono text-xs text-[#CCD6E5] break-all text-right">{{ log.id }}</span>
                            </div>

                            <div class="px-5 py-3 flex items-center justify-between gap-4">
                                <span class="text-[#5A6270] shrink-0">Data / Hora</span>
                                <span class="font-mono text-xs text-[#CCD6E5] text-right">{{ formatLogDate(log.createdAt) }}</span>
                            </div>

                            <div v-if="log.ip" class="px-5 py-3 flex items-center justify-between gap-4">
                                <span class="text-[#5A6270] shrink-0">Endereço IP</span>
                                <span class="font-mono text-xs text-[#CCD6E5] text-right">{{ log.ip }}</span>
                            </div>

                            <div v-if="log.userAgent" class="px-5 py-3 flex flex-col gap-1">
                                <span class="text-[#5A6270]">User-Agent</span>
                                <span class="font-mono text-xs text-[#CCD6E5]/90 break-all">{{ log.userAgent }}</span>
                            </div>

                            <div
                                v-for="item in extraFields"
                                :key="item.key"
                                class="px-5 py-3 flex flex-col gap-1"
                            >
                                <span class="text-[#5A6270] font-mono text-xs">{{ item.key }}</span>
                                <span class="font-mono text-xs text-[#CCD6E5] break-all">
                                    {{ typeof item.value === 'object' ? JSON.stringify(item.value) : item.value }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Payload / Dados da Requisição -->
                    <div v-if="payload" class="flex flex-col gap-3">
                        <span class="text-xs font-bold uppercase tracking-wider text-[#5A6270]">
                            Dados da Requisição (Payload)
                        </span>

                        <div
                            v-if="payloadSections.length > 0"
                            v-for="section in payloadSections"
                            :key="section.key"
                            class="rounded-2xl bg-[#0E121A] border border-[#5A6270] overflow-hidden"
                        >
                            <div class="px-5 py-2.5 border-b border-[#5A6270]/60 flex items-center justify-between bg-[#18202C]/50">
                                <span class="text-xs font-mono font-bold uppercase text-[#974EFD]">
                                    {{ section.key }}
                                </span>
                                <button
                                    @click="copyText(section.value, section.key)"
                                    class="text-xs text-[#5A6270] hover:text-[#2BA69C] hover:cursor-pointer transition-colors"
                                >
                                    {{ copiedField === section.key ? 'Copiado!' : 'Copiar' }}
                                </button>
                            </div>

                            <pre class="p-4 text-xs text-[#CCD6E5]/90 font-mono whitespace-pre-wrap break-all">{{ typeof section.value === 'string' ? section.value : JSON.stringify(section.value, null, 2) }}</pre>
                        </div>

                        <div v-else class="rounded-2xl bg-[#0E121A] border border-[#5A6270] p-4 text-xs font-mono text-[#5A6270]">
                            Payload vazio (<code class="text-[#CCD6E5]">{}</code>)
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </Template>
</template>