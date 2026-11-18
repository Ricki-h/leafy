<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import Template from './base/Template.vue'
import Loading from '../components/Loading.vue'
import api from '../services/api.js'

const router = useRouter()

const isAuthorized = ref(false)
const loading = ref(true)
const loadingMore = ref(false)
const error = ref(null)

const logs = ref([])
const total = ref(0)
const page = ref(1)
const hasMore = ref(false)

const filters = reactive({
    action: '',
    userId: '',
    status: '', // '' | '400' | '500'
    from: '',
    to: '',
})

let debounceTimer = null
let requestId = 0

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

function getExtraPayload(log) {
    return log.details || log.metadata || log.meta || log.changes || log.data || null
}

function getRouteLabel(log) {
    const routeText = [log.method, log.route || log.path].filter(Boolean).join(' ')
    if (!routeText || routeText === log.action) return ''
    return routeText
}

function buildQueryParams(targetPage) {
    const params = {
        page: targetPage,
        limit: 50,
    }

    if (filters.action.trim()) params.action = filters.action.trim()
    if (filters.userId.trim()) params.userId = filters.userId.trim()
    if (filters.status) params.status = filters.status
    if (filters.from) params.from = new Date(`${filters.from}T00:00:00`).toISOString()
    if (filters.to) params.to = new Date(`${filters.to}T23:59:59.999`).toISOString()

    return params
}

async function fetchLogs(reset = true) {
    const myRequest = ++requestId

    if (reset) {
        page.value = 1
        loading.value = true
    } else {
        loadingMore.value = true
    }

    error.value = null

    try {
        const { data } = await api.get('/admin/audit-logs', {
            params: buildQueryParams(page.value),
        })

        if (myRequest !== requestId) return

        const fetchedLogs = data.logs ?? []
        logs.value = reset ? fetchedLogs : [...logs.value, ...fetchedLogs]
        total.value = data.total ?? logs.value.length
        hasMore.value = Boolean(data.hasMore)
    } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
            router.replace('/')
            return
        }
        if (myRequest === requestId) {
            console.error('Erro ao buscar logs:', err)
            error.value = err.response?.data?.error || 'Erro ao buscar logs.'
        }
    } finally {
        if (myRequest === requestId) {
            loading.value = false
            loadingMore.value = false
        }
    }
}

async function loadMore() {
    if (!hasMore.value || loadingMore.value) return
    page.value += 1
    await fetchLogs(false)
}

function clearFilters() {
    filters.action = ''
    filters.userId = ''
    filters.status = ''
    filters.from = ''
    filters.to = ''
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
        fetchLogs(true)
    } catch {
        router.replace('/')
    }
}

watch(
    () => [filters.action, filters.userId],
    () => {
        clearTimeout(debounceTimer)
        debounceTimer = setTimeout(() => {
            if (isAuthorized.value) fetchLogs(true)
        }, 350)
    }
)

watch(
    () => [filters.status, filters.from, filters.to],
    () => {
        if (isAuthorized.value) fetchLogs(true)
    }
)

function voltar() {
    router.push('/')
}

onMounted(verifyAdminAndLoad)
</script>

<template>
    <Template v-if="isAuthorized" variant="left">
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

                    <div class="flex items-center gap-3 min-w-0">
                        <h6 class="text-xl font-bold leading-tight text-[#CCD6E5] truncate">Audit Logs</h6>
                        <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#682B9C]/30 text-[#CCD6E5] border border-[#682B9C] shrink-0">
                            {{ total }} registros
                        </span>
                    </div>
                </div>

                <button
                    @click="fetchLogs(true)"
                    :disabled="loading"
                    class="px-4 py-1.5 rounded-full border border-[#2BA69C] text-[#2BA69C] hover:bg-[#2BA69C] hover:text-[#0E121A] text-sm font-bold hover:cursor-pointer transition-colors disabled:opacity-50 shrink-0"
                >
                    Atualizar
                </button>
            </div>

            <!-- Filtros -->
            <div class="px-8 py-4 border-b border-[#5A6270] flex flex-col gap-3 min-w-0">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-0">
                    <label class="input bg-[#0E121A] rounded-full text-[#5A6270] border-[#5A6270] w-full min-w-0 flex items-center gap-2 px-3 focus-within:border-[#2BA69C]">
                        <svg class="h-4 opacity-50 fill-[#5A6270] shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <g stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" fill="none" stroke="currentColor">
                                <circle cx="11" cy="11" r="8"></circle>
                                <path d="m21 21-4.3-4.3"></path>
                            </g>
                        </svg>
                        <input
                            v-model="filters.action"
                            type="search"
                            placeholder="Ação (ex: POST_, USER_)"
                            class="p-2 text-sm bg-transparent text-[#CCD6E5] placeholder-[#5A6270] focus:outline-none w-full min-w-0"
                        />
                    </label>

                    <label class="input bg-[#0E121A] rounded-full text-[#5A6270] border-[#5A6270] w-full min-w-0 flex items-center gap-2 px-3 focus-within:border-[#2BA69C]">
                        <span class="text-xs font-mono text-[#5A6270] shrink-0">userId:</span>
                        <input
                            v-model="filters.userId"
                            type="text"
                            placeholder="ID do usuário..."
                            class="p-2 text-sm bg-transparent text-[#CCD6E5] placeholder-[#5A6270] focus:outline-none w-full min-w-0"
                        />
                    </label>
                </div>

                <div class="flex flex-col gap-2.5 min-w-0">
                    <div class="flex items-center gap-2 flex-wrap">
                        <button
                            @click="filters.status = ''"
                            class="px-3 py-1 rounded-full text-xs font-semibold hover:cursor-pointer transition-colors"
                            :class="filters.status === '' ? 'bg-[#2BA69C] text-[#0E121A]' : 'bg-[#2E3B4E]/50 text-[#CCD6E5] hover:bg-[#2E3B4E]'"
                        >
                            Todos os status
                        </button>
                        <button
                            @click="filters.status = '400'"
                            class="px-3 py-1 rounded-full text-xs font-semibold hover:cursor-pointer transition-colors"
                            :class="filters.status === '400' ? 'bg-[#FF82BD] text-[#0E121A]' : 'bg-[#2E3B4E]/50 text-[#CCD6E5] hover:bg-[#2E3B4E]'"
                        >
                            Erros (400+)
                        </button>
                        <button
                            @click="filters.status = '500'"
                            class="px-3 py-1 rounded-full text-xs font-semibold hover:cursor-pointer transition-colors"
                            :class="filters.status === '500' ? 'bg-red-500 text-white' : 'bg-[#2E3B4E]/50 text-[#CCD6E5] hover:bg-[#2E3B4E]'"
                        >
                            Críticos (500+)
                        </button>
                    </div>

                    <div class="flex items-center gap-2 flex-wrap text-xs text-[#5A6270]">
                        <span>De:</span>
                        <input
                            v-model="filters.from"
                            type="date"
                            class="bg-[#0E121A] border border-[#5A6270] rounded-lg px-2.5 py-1 text-xs text-[#CCD6E5] focus:border-[#2BA69C] focus:outline-none"
                        />
                        <span>Até:</span>
                        <input
                            v-model="filters.to"
                            type="date"
                            class="bg-[#0E121A] border border-[#5A6270] rounded-lg px-2.5 py-1 text-xs text-[#CCD6E5] focus:border-[#2BA69C] focus:outline-none"
                        />
                        <button
                            v-if="filters.action || filters.userId || filters.status || filters.from || filters.to"
                            @click="clearFilters"
                            class="text-[#FF82BD] hover:underline hover:cursor-pointer ml-1 font-semibold"
                        >
                            Limpar
                        </button>
                    </div>
                </div>
            </div>

            <!-- Lista de logs -->
            <div class="flex-1 min-h-0 min-w-0 overflow-y-auto overflow-x-hidden">
                <div v-if="loading" class="flex justify-center py-10">
                    <Loading />
                </div>

                <div v-else-if="error" class="text-center text-red-400 text-sm py-10 px-8">
                    {{ error }}
                </div>

                <div v-else-if="logs.length === 0" class="text-center text-[#5A6270] text-sm py-10 px-8">
                    Nenhum registro encontrado com os filtros atuais.
                </div>

                <template v-else>
                    <div
                        v-for="log in logs"
                        :key="log.id"
                        @click="router.push(`/logs/${log.id}`)"
                        class="px-8 py-4 border-b border-[#5A6270] hover:bg-[#2E3B4E]/25 transition-colors flex flex-col gap-2 min-w-0"
                    >
                        <div class="flex items-center justify-between gap-2 flex-wrap min-w-0">
                            <div class="flex items-center gap-2 flex-wrap min-w-0">
                                <span
                                    v-if="log.statusCode"
                                    class="px-2 py-0.5 rounded-full text-xs font-mono font-bold border shrink-0"
                                    :class="getStatusBadgeClass(log.statusCode)"
                                >
                                    {{ log.statusCode }}
                                </span>

                                <span class="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#2BA69C]/15 text-[#2BA69C] border border-[#2BA69C]/30 shrink-0">
                                    {{ log.action || 'ACTION' }}
                                </span>

                                <span v-if="getRouteLabel(log)" class="text-xs font-mono text-[#974EFD] break-all">
                                    {{ getRouteLabel(log) }}
                                </span>

                                <span
                                    v-if="log.userId"
                                    :title="log.userId"
                                    class="text-xs font-mono text-[#CCD6E5]/80 bg-[#0E121A] px-2 py-0.5 rounded border border-[#5A6270]/50 truncate max-w-44"
                                >
                                    userId: {{ log.userId }}
                                </span>
                            </div>

                            <time class="text-xs text-[#5A6270] font-mono shrink-0">
                                {{ formatLogDate(log.createdAt) }}
                            </time>
                        </div>

                        <p v-if="log.message || log.description" class="text-sm text-[#CCD6E5] break-words">
                            {{ log.message || log.description }}
                        </p>

                        <div v-if="log.ip || log.userAgent || getExtraPayload(log)" class="flex flex-col gap-1.5 min-w-0">
                            <div v-if="log.ip || log.userAgent" class="flex items-center gap-3 min-w-0 text-xs text-[#5A6270] font-mono">
                                <span v-if="log.ip" class="shrink-0">IP: {{ log.ip }}</span>
                                <span v-if="log.userAgent" :title="log.userAgent" class="truncate min-w-0">
                                    {{ log.userAgent }}
                                </span>
                            </div>

                            <pre
                                v-if="getExtraPayload(log)"
                                class="w-full text-xs text-[#CCD6E5]/80 bg-[#0E121A] border border-[#5A6270]/50 rounded-lg p-2.5 whitespace-pre-wrap break-all font-mono"
                            >{{ typeof getExtraPayload(log) === 'string' ? getExtraPayload(log) : JSON.stringify(getExtraPayload(log), null, 2) }}</pre>
                        </div>
                    </div>

                    <!-- Paginação -->
                    <div v-if="hasMore" class="py-6 flex justify-center">
                        <button
                            @click="loadMore"
                            :disabled="loadingMore"
                            class="px-6 py-2 rounded-full bg-[#0E121A] border border-[#5A6270] hover:border-[#2BA69C] text-[#CCD6E5] hover:text-[#2BA69C] text-sm font-semibold hover:cursor-pointer transition-colors disabled:opacity-50"
                        >
                            {{ loadingMore ? 'Carregando...' : 'Carregar mais logs' }}
                        </button>
                    </div>
                </template>
            </div>
        </div>
    </Template>
</template>