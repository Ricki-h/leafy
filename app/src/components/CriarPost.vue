<script setup>
import { ref, computed } from 'vue'
import ModalBase from './ModalBase.vue'
import api from '../services/api.js'

const props = defineProps({
  bookId: {
    type: [String, Number],
    required: true,
  },
})

const emit = defineEmits(['close', 'postada'])

const TEXTO_MAX = 2000
const me = ref(JSON.parse(localStorage.getItem('user')))

const campos = ref([
  { chave: 'writing', label: 'Escrita', valor: 0, hover: 0 },
  { chave: 'plot', label: 'Narrativa/história', valor: 0, hover: 0 },
  { chave: 'characters', label: 'Personagens', valor: 0, hover: 0 },
  { chave: 'pacing', label: 'Ritmo', valor: 0, hover: 0 },
  { chave: 'emotionalImpact', label: 'Impacto emocional', valor: 0, hover: 0 },
])

const construcao = ref({
  chave: 'worldbuilding',
  label: 'Construção de mundo',
  valor: 0,
  hover: 0,
})
const construcaoAtiva = ref(false)

const body = ref('')
const erro = ref('')
const enviando = ref(false)

// Prévia da nota geral de 0 a 10 (o valor oficial é calculado no servidor)
const media = computed(() => {
  const valores = campos.value.map(c => c.valor)
  if (construcaoAtiva.value) valores.push(construcao.value.valor)

  if (valores.some(v => v === 0)) return null

  const soma = valores.reduce((s, v) => s + v, 0)
  return ((soma / valores.length) * 2).toFixed(1)
})

const formularioValido = computed(() => {
  const obrigatoriasOk = campos.value.every(c => c.valor > 0)
  const opcionalOk = !construcaoAtiva.value || construcao.value.valor > 0
  return obrigatoriasOk && opcionalOk && body.value.trim().length > 0
})

function alternarConstrucao() {
  construcaoAtiva.value = !construcaoAtiva.value
  if (!construcaoAtiva.value) {
    construcao.value.valor = 0
    construcao.value.hover = 0
  }
}

function selecionarConstrucao(nota) {
  if (!construcaoAtiva.value) {
    construcaoAtiva.value = true
  }
  construcao.value.valor = nota
}

async function postar() {
  if (!campos.value.every(c => c.valor > 0)) {
    erro.value = 'Avalie todos os critérios obrigatórios.'
    return
  }

  if (construcaoAtiva.value && construcao.value.valor === 0) {
    erro.value = 'Avalie a construção de mundo ou desative o campo.'
    return
  }

  if (body.value.trim() === '') {
    erro.value = 'Escreva sua resenha.'
    return
  }

  erro.value = ''

  const dados = Object.fromEntries(campos.value.map(c => [c.chave, c.valor]))
  if (construcaoAtiva.value) {
    dados.worldbuilding = construcao.value.valor
  }
  dados.body = body.value.trim()

  enviando.value = true
  try {
    const { data } = await api.post(`/resenhas/${props.bookId}`, dados)
    emit('postada', data)
    emit('close')
  } catch (err) {
    console.error(err)
    erro.value = err.response?.data?.error || 'Não foi possível publicar a resenha.'
  } finally {
    enviando.value = false
  }
}

function close() {
  emit('close')
}
</script>

<template>
  <ModalBase
    width-class="w-full max-w-lg"
    panel-class="max-h-[90vh] overflow-y-auto"
    @close="close"
  >
    <!-- Cabeçalho -->
    <div class="flex items-center gap-3 mb-5">
      <img
        v-if="me?.avatarUrl"
        :src="me.avatarUrl"
        alt=""
        class="h-10 w-10 shrink-0 rounded-full object-cover"
      />
      <div v-else class="h-10 w-10 shrink-0 rounded-full bg-[#2E3B4E]"></div>

      <p class="flex-1 text-[15px] text-[#CCD6E5] font-medium">
        O que você tem para avaliar nesse livro?
      </p>

      <button
        type="button"
        @click="close"
        class="p-1.5 rounded-full border border-[#2BA69C] hover:bg-[#2BA69C]/10 hover:cursor-pointer transition-colors shrink-0"
        aria-label="Fechar"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 16 16" fill="none">
          <path d="M1 15L8 8M8 8L15 1M8 8L1 1M8 8L15 15" stroke="#2BA69C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>

    <!-- Critérios com folhinhas -->
    <div class="space-y-3.5">
      <div
        v-for="campo in campos"
        :key="campo.chave"
        class="flex items-center justify-between gap-4 text-[15px]"
      >
        <span class="text-[#CCD6E5]">{{ campo.label }}</span>

        <div class="flex items-center gap-3 shrink-0">
          <div class="flex gap-1.5">
            <button
              v-for="n in 5"
              :key="n"
              type="button"
              @click="campo.valor = n"
              @mouseenter="campo.hover = n"
              @mouseleave="campo.hover = 0"
              class="hover:cursor-pointer transition-transform hover:scale-110"
              :aria-label="`${campo.label}: ${n} de 5`"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path
                  d="M20 11.6206C20 11.2383 18.3917 11.3428 18.2639 11.065C18.1361 10.7872 20.0461 8.51833 19.7683 8.00944C19.4906 7.50056 16.9428 8.65778 16.7822 8.40278C16.6222 8.14833 16.9444 6.45833 16.6667 6.25C16.3889 6.04167 13.75 8.98111 13.3794 8.63444C13.0089 8.28778 14.2361 2.80111 13.9828 2.69111C13.7294 2.58111 12.0833 3.44944 11.8756 3.40333C11.6678 3.35667 10.3789 0 10 0C9.62111 0 8.33222 3.35667 8.12444 3.40278C7.91667 3.44889 6.27056 2.58056 6.01722 2.69056C5.76389 2.80056 6.99056 8.28667 6.62 8.63389C6.25 8.98111 3.61111 6.04167 3.33333 6.25C3.05556 6.45833 3.37778 8.14833 3.21778 8.40278C3.05722 8.65722 0.509444 7.5 0.231667 8.00944C-0.0461111 8.51889 1.86444 10.7872 1.73611 11.065C1.60778 11.3428 0 11.2383 0 11.6206C0 12.0028 4.68778 14.5289 5 14.8267C5.31222 15.1244 3.38111 16.3833 3.65722 16.6206C3.97722 16.8961 5.79 16.1594 9.44444 16.0889V19.4444C9.44444 19.5918 9.50298 19.7331 9.60716 19.8373C9.71135 19.9415 9.85266 20 10 20C10.1473 20 10.2887 19.9415 10.3928 19.8373C10.497 19.7331 10.5556 19.5918 10.5556 19.4444V16.0889C14.2094 16.1594 16.0228 16.8961 16.3428 16.6206C16.6183 16.3828 14.6878 15.1239 15 14.8267C15.3122 14.5294 20 12.0022 20 11.6206Z"
                  :fill="(campo.hover || campo.valor) >= n ? '#2BA69C' : '#5A6270'"
                />
              </svg>
            </button>
          </div>

          <span class="w-7 text-right text-sm font-medium text-[#6E7684]">
            {{ (campo.hover || campo.valor) + ',0' }}
          </span>
        </div>
      </div>

      <!-- Critério opcional: Construção de mundo -->
      <div class="flex items-center justify-between gap-4 text-[15px] pt-1">
        <div class="flex items-center gap-2">
          <button
            type="button"
            @click="alternarConstrucao"
            :aria-pressed="construcaoAtiva"
            class="grid h-4 w-4 shrink-0 place-items-center rounded-full border border-purple-400 text-[9px] hover:cursor-pointer transition"
            :class="construcaoAtiva ? 'bg-purple-400 text-[#0E121A]' : 'text-transparent'"
            title="Campo opcional — clique para ativar ou desativar"
          >
            ●
          </button>

          <button
            type="button"
            @click="alternarConstrucao"
            class="text-left hover:cursor-pointer transition"
            :class="construcaoAtiva ? 'text-[#CCD6E5]' : 'text-[#5A6270]'"
          >
            {{ construcao.label }}
            <span class="text-xs text-[#6E7684]">(opcional)</span>
          </button>
        </div>

        <div
          class="flex items-center gap-3 shrink-0 transition-opacity"
          :class="construcaoAtiva ? 'opacity-100' : 'opacity-40'"
        >
          <div class="flex gap-1.5">
            <button
              v-for="n in 5"
              :key="n"
              type="button"
              @click="selecionarConstrucao(n)"
              @mouseenter="construcaoAtiva && (construcao.hover = n)"
              @mouseleave="construcao.hover = 0"
              class="hover:cursor-pointer transition-transform hover:scale-110"
              :aria-label="`${construcao.label}: ${n} de 5`"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path
                  d="M20 11.6206C20 11.2383 18.3917 11.3428 18.2639 11.065C18.1361 10.7872 20.0461 8.51833 19.7683 8.00944C19.4906 7.50056 16.9428 8.65778 16.7822 8.40278C16.6222 8.14833 16.9444 6.45833 16.6667 6.25C16.3889 6.04167 13.75 8.98111 13.3794 8.63444C13.0089 8.28778 14.2361 2.80111 13.9828 2.69111C13.7294 2.58111 12.0833 3.44944 11.8756 3.40333C11.6678 3.35667 10.3789 0 10 0C9.62111 0 8.33222 3.35667 8.12444 3.40278C7.91667 3.44889 6.27056 2.58056 6.01722 2.69056C5.76389 2.80056 6.99056 8.28667 6.62 8.63389C6.25 8.98111 3.61111 6.04167 3.33333 6.25C3.05556 6.45833 3.37778 8.14833 3.21778 8.40278C3.05722 8.65722 0.509444 7.5 0.231667 8.00944C-0.0461111 8.51889 1.86444 10.7872 1.73611 11.065C1.60778 11.3428 0 11.2383 0 11.6206C0 12.0028 4.68778 14.5289 5 14.8267C5.31222 15.1244 3.38111 16.3833 3.65722 16.6206C3.97722 16.8961 5.79 16.1594 9.44444 16.0889V19.4444C9.44444 19.5918 9.50298 19.7331 9.60716 19.8373C9.71135 19.9415 9.85266 20 10 20C10.1473 20 10.2887 19.9415 10.3928 19.8373C10.497 19.7331 10.5556 19.5918 10.5556 19.4444V16.0889C14.2094 16.1594 16.0228 16.8961 16.3428 16.6206C16.6183 16.3828 14.6878 15.1239 15 14.8267C15.3122 14.5294 20 12.0022 20 11.6206Z"
                  :fill="construcaoAtiva && (construcao.hover || construcao.valor) >= n ? '#2BA69C' : '#5A6270'"
                />
              </svg>
            </button>
          </div>

          <span class="w-7 text-right text-sm font-medium text-[#6E7684]">
            {{ (construcaoAtiva ? (construcao.hover || construcao.valor) : 0) + ',0' }}
          </span>
        </div>
      </div>

      <!-- Nota geral calculada -->
      <div class="flex items-center justify-between pt-3 border-t border-[#2E3B4E]">
        <div class="flex items-center gap-2 text-sm">
          <span class="text-[#CCD6E5] font-medium">Nota geral</span>
          <span class="text-xs text-[#6E7684]">(média dos critérios)</span>
        </div>
        <span class="px-3 py-0.5 rounded-full bg-[#2BA69C]/15 text-[#2BA69C] font-bold text-sm">
          {{ media ? `${media}/10` : '—' }}
        </span>
      </div>

      <!-- Texto da resenha -->
      <div class="pt-1">
        <textarea
          id="body"
          v-model="body"
          rows="5"
          :maxlength="TEXTO_MAX"
          placeholder="Escreva aqui sua resenha completa sobre o livro..."
          class="w-full resize-none rounded-xl bg-white/[0.04] p-3.5 text-[15px] leading-6 text-[#CCD6E5] placeholder-[#5A6270] outline-none border border-[#2E3B4E] focus:border-[#2BA69C] transition-colors"
        ></textarea>
        <p class="mt-1 text-right text-xs text-[#6E7684]">{{ body.length }}/{{ TEXTO_MAX }}</p>
      </div>
    </div>

    <!-- Erro de validação -->
    <p v-if="erro" class="mt-2 text-sm text-red-400">{{ erro }}</p>

    <!-- Rodapé -->
    <template #footer>
      <div class="mt-3 flex justify-end">
        <button
          type="button"
          @click="postar"
          :disabled="enviando || !formularioValido"
          class="rounded-full bg-[#CCD6E5] hover:bg-[#2BA69C] disabled:bg-[#2E3B4E] disabled:text-[#5A6270] px-6 py-2.5 text-sm font-bold text-[#0E121A] hover:cursor-pointer transition-colors"
        >
          {{ enviando ? 'Postando...' : 'Postar' }}
        </button>
      </div>
    </template>
  </ModalBase>
</template>