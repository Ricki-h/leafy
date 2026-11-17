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

// Valor máximo das notas (ajuste: 5, 10, 100...)
const NOTA_MAX = 5
const TEXTO_MAX = 2000

const campos = ref([
  { chave: 'writing', label: 'Escrita', valor: '' },
  { chave: 'plot', label: 'Narrativa/história', valor: '' },
  { chave: 'characters', label: 'Personagens', valor: '' },
  { chave: 'pacing', label: 'Ritmo', valor: '' },
  { chave: 'emotionalImpact', label: 'Impacto emocional', valor: '' },
])

const construcao = ref({ chave: 'worldbuilding', label: 'Construção de mundo', valor: '' })
const construcaoAtiva = ref(false)
const body = ref('')
const erro = ref('')
const enviando = ref(false)

// Mantém só dígitos e no máximo uma casa decimal, limitado a NOTA_MAX
function sanitizar(valor) {
  let v = String(valor).replace(/[^0-9]/g, '').slice(0, 1)
  if (v !== '' && Number(v) > NOTA_MAX) v = String(NOTA_MAX)
  if (v === '0') v = ''
  return v
}

function onNumeroInput(campo, event) {
  campo.valor = sanitizar(event.target.value)
  event.target.value = campo.valor // reflete a limpeza no input
}

function numeroValido(v) {
  return v !== '' && !isNaN(Number(v))
}

// Prévia da nota geral (o valor oficial é calculado no servidor)
const media = computed(() => {
  const valores = campos.value.map(c => c.valor)
  if (construcaoAtiva.value) valores.push(construcao.value.valor)

  if (valores.some(v => !numeroValido(v))) return null

  const soma = valores.reduce((s, v) => s + Number(v), 0)
  return ((soma / valores.length) * 2).toFixed(1)
})

function alternarConstrucao() {
  construcaoAtiva.value = !construcaoAtiva.value
  if (!construcaoAtiva.value) construcao.value.valor = ''
}

async function postar() {
  const notasOk = campos.value.every(c => numeroValido(c.valor))

  if (!notasOk) {
    erro.value = 'Preencha todas as notas com números.'
    return
  }

  if (construcaoAtiva.value && !numeroValido(construcao.value.valor)) {
    erro.value = 'Preencha a construção de mundo ou desative o campo.'
    return
  }

  if (body.value.trim() === '') {
    erro.value = 'Escreva sua resenha.'
    return
  }

  erro.value = ''

  const dados = Object.fromEntries(campos.value.map(c => [c.chave, Number(c.valor)]))
  if (construcaoAtiva.value) {
    dados.worldbuilding = Number(construcao.value.valor)
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
    width-class="w-full max-w-md"
    panel-class="max-h-[90vh] overflow-y-auto"
    @close="close"
  >
    <!-- Cabeçalho customizado (não usa o slot "title") -->
    <div class="flex items-center gap-3 mb-4">
      <div class="h-9 w-9 shrink-0 rounded-full bg-gray-300"></div>
      <p class="flex-1 text-[15px] text-gray-200">O que você tem para avaliar nesse livro?</p>
      <button
        @click="close"
        class="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-teal-400/60 text-teal-400 text-xs hover:bg-teal-400/10 transition"
        aria-label="Fechar"
      >
        ✕
      </button>
    </div>

    <!-- Notas obrigatórias (só números) -->
    <div class="space-y-4">
      <div
        v-for="campo in campos"
        :key="campo.chave"
        class="flex items-center gap-2 text-[15px] text-gray-400"
      >
        <label :for="campo.chave" class="shrink-0 text-gray-400">
          {{ campo.label }}:
        </label>

        <input
          :id="campo.chave"
          :value="campo.valor"
          type="text"
          inputmode="decimal"
          autocomplete="off"
          :placeholder="`0 a ${NOTA_MAX}`"
          class="flex-1 bg-transparent text-gray-100 placeholder-gray-600 outline-none border-b border-transparent focus:border-teal-400/40 transition"
          @input="onNumeroInput(campo, $event)"
        />
      </div>

      <!-- Campo opcional: Construção de mundo -->
      <div class="flex items-center gap-2 text-[15px] text-gray-400">
        <button
          type="button"
          @click="alternarConstrucao"
          :aria-pressed="construcaoAtiva"
          class="grid h-4 w-4 shrink-0 place-items-center rounded-full border border-purple-400 text-[9px] transition"
          :class="construcaoAtiva ? 'bg-purple-400 text-purple-400' : 'text-transparent'"
          title="Campo opcional — clique para incluir na avaliação"
        >
          ●
        </button>

        <label
          for="construcao"
          class="shrink-0 transition"
          :class="construcaoAtiva ? 'text-gray-400' : 'text-gray-600'"
        >
          {{ construcao.label }}:
        </label>

        <input
          id="construcao"
          :value="construcao.valor"
          type="text"
          inputmode="decimal"
          autocomplete="off"
          :placeholder="`0 a ${NOTA_MAX}`"
          :disabled="!construcaoAtiva"
          class="flex-1 bg-transparent text-gray-100 placeholder-gray-600 outline-none border-b border-transparent focus:border-teal-400/40 transition disabled:cursor-not-allowed disabled:opacity-40"
          @input="onNumeroInput(construcao, $event)"
        />
      </div>

      <!-- Nota geral (calculada automaticamente) -->
      <div class="flex items-center gap-2 text-[15px] text-gray-400">
        <span class="shrink-0">Nota geral:</span>
        <span class="font-bold text-teal-400">{{ media ?? '—' }}</span>
        <span class="text-xs text-gray-500">(média das notas acima)</span>
      </div>

      <!-- Texto da resenha -->
      <div class="pt-2">
        <label for="body" class="block text-[15px] text-gray-400 mb-2">Resenha:</label>
        <textarea
          id="body"
          v-model="body"
          rows="5"
          :maxlength="TEXTO_MAX"
          placeholder="Escreva aqui o que você achou do livro..."
          class="w-full resize-none rounded-lg bg-white/5 p-3 text-[15px] text-gray-100 placeholder-gray-500 outline-none border border-transparent focus:border-teal-400/40 transition"
        ></textarea>
        <p class="mt-1 text-right text-xs text-gray-500">{{ body.length }}/{{ TEXTO_MAX }}</p>
      </div>
    </div>

    <!-- Erro de validação -->
    <p v-if="erro" class="mt-3 text-sm text-red-400">{{ erro }}</p>

    <!-- Rodapé -->
    <template #footer>
      <div class="mt-2 flex justify-end">
        <button
          @click="postar"
          :disabled="enviando"
          class="rounded-full bg-gray-100 px-5 py-2 text-sm font-medium text-gray-900 hover:bg-white transition disabled:opacity-50"
        >
          {{ enviando ? 'Postando...' : 'Postar' }}
        </button>
      </div>
    </template>
  </ModalBase>
</template>