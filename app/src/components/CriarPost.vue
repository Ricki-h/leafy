<script setup>
import { ref } from 'vue'
import ModalBase from './ModalBase.vue'

const emit = defineEmits(['close', 'postar'])

const campos = ref([
  { chave: 'escrita', label: 'Escrita', valor: '' },
  { chave: 'narrativa', label: 'Narrativa/história', valor: '' },
  { chave: 'personagens', label: 'Personagens', valor: '' },
  { chave: 'ritmo', label: 'Ritmo', valor: '' },
  { chave: 'impacto', label: 'Impacto emocional', valor: '' },
])

const nota = ref({ chave: 'nota', label: 'Nota geral', valor: '' })
const construcao = ref({ chave: 'construcao', label: 'Construção de mundo', valor: '' })
const construcaoAtiva = ref(false)
const erro = ref('')

function alternarConstrucao() {
  construcaoAtiva.value = !construcaoAtiva.value
  if (!construcaoAtiva.value) construcao.value.valor = ''
}

function postar() {
  const faltandoObrigatorio =
    campos.value.some(c => c.valor.trim() === '') || nota.value.valor.trim() === ''

  if (faltandoObrigatorio) {
    erro.value = 'Preencha todos os campos obrigatórios.'
    return
  }

  if (construcaoAtiva.value && construcao.value.valor.trim() === '') {
    erro.value = 'Preencha a construção de mundo ou desative o campo.'
    return
  }

  erro.value = ''

  const dados = Object.fromEntries(campos.value.map(c => [c.chave, c.valor]))
  dados.nota = nota.value.valor
  if (construcaoAtiva.value) {
    dados.construcao = construcao.value.valor
  }

  emit('postar', dados)
}

function close() {
  emit('close')
}
</script>

<template>
  <ModalBase width-class="w-full max-w-md" @close="close">
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

    <!-- Campos obrigatórios -->
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
          v-model="campo.valor"
          type="text"
          class="flex-1 bg-transparent text-gray-100 placeholder-gray-500 outline-none border-b border-transparent focus:border-teal-400/40 transition"
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
          v-model="construcao.valor"
          type="text"
          :disabled="!construcaoAtiva"
          class="flex-1 bg-transparent text-gray-100 placeholder-gray-500 outline-none border-b border-transparent focus:border-teal-400/40 transition disabled:cursor-not-allowed disabled:opacity-40"
        />
      </div>

      <!-- Nota geral -->
      <div class="flex items-center gap-2 text-[15px] text-gray-400">
        <label for="nota" class="shrink-0 text-gray-400">
          {{ nota.label }}:
        </label>

        <input
          id="nota"
          v-model="nota.valor"
          type="text"
          class="flex-1 bg-transparent text-gray-100 placeholder-gray-500 outline-none border-b border-transparent focus:border-teal-400/40 transition"
        />
      </div>
    </div>

    <!-- Erro de validação -->
    <p v-if="erro" class="mt-3 text-sm text-red-400">{{ erro }}</p>

    <!-- Rodapé -->
    <template #footer>
      <div class="mt-2 flex justify-end">
        <button
          @click="postar"
          class="rounded-full bg-gray-100 px-5 py-2 text-sm font-medium text-gray-900 hover:bg-white transition"
        >
          Postar
        </button>
      </div>
    </template>
  </ModalBase>
</template>