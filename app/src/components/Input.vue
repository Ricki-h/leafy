<script setup>
import { computed, ref, watch, useId } from 'vue';

const props = defineProps({
    modelValue: { type: null, default: null }, // string, number, File ou File[]
    label: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    name: { type: String, default: undefined },
    type: { type: String, default: 'text' }, // text, email, password, number, date, file, textarea... Basicamente o tipo do input html
    variant: {
        type: String,
        default: 'default',
        validator: (v) => ['default', 'floating'].includes(v), // pra alterar o hover
    },
    size: {
        type: String,
        default: 'md',
        validator: (v) => ['lg', 'md'].includes(v),
    },
    required: { type: Boolean, default: false }, // se é obrigatório preencher ou não
    disabled: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false }, // se é so pra ler
    error: { type: [String, Array], default: null }, // string ou array de erros
    hint: { type: String, default: '' }, // dica de preenchimento
    autocomplete: { type: String, default: undefined }, // ajuda o proprio navegador a ajudar o usuário com o autocomplete (nome, email, current-password, username são alguns valores comuns)
    //arquivos
    accept: { type: String, default: undefined }, // no caso de arquivos, que tipos são aceitos
    multiple: { type: Boolean, default: false }, // se é mais de um arquivo
    // Número
    min: { type: [String, Number], default: undefined }, // tbm pode ser usado pra uma data minima ou horário minimo
    max: { type: [String, Number], default: undefined }, // tbm pode ser usado pra uma data maxima ou horario máximo
    step: { type: [String, Number], default: undefined }, // para indicar o aumento em caso de input numerico (se pode decimais, centesimos, se vai de 5 em 5)
    // String
    maxlength: { type: [String, Number], default: undefined }, // numero máximo de caracteres
    rows: { type: [String, Number], default: 4 }, // textarea, numero de paragrafos/altura inicial
})

const emit = defineEmits(['update: modelValue', 'focus', 'blur'])

const inputRef = ref(null)
const focused = ref(false)
const showPassword = ref(false)
const fileCount = ref(0)

const uid = useId()
const inputId = computed(() => props.id || props.name || `input-${uid}`)
const errorId = computed(() => `${inputId.value}-error`)
const hintId = computed(() => `${inputId.value}-hint`)

const isTextarea = computed(() => props.type === 'textarea')
const isPassword = computed(() => props.type === 'password')
const isFile = computed(() => props.type === 'file')
const isFloating = computed(() => props.variant === 'floating')
const currentType = computed(() => (isPassword.value && showPassword.value ? 'text' : props.type))

// erros
const errors = computed(() => {
    const list = Array.isArray(props.error) ? props.error : [props.error]
    return list.filter(Boolean)
})
const hasError = computed(() => errors.value.length > 0)
const describedBy = computed(() => {
    if (hasError.value) return errorId.value
    if (props.hint) return hintId.value
    return undefined
})

// label flutuante
hasValue = computed(() => {
    if (isFile.value) return fileCount.value > 0
    const v = props.modelValue
    return v !== null && v !== undefined && String(v) !== ''
})

// tipos que mostra, algo por padrão como o Date (dd/mm/aaaa)
const alwaysFilled = ['date', 'time', 'datetime-local', 'month', 'week', 'file']
const isFloated = computed(() => {
    focused.value || hasValue.value || alwaysFilled.includes(props.type)
})

// Classes de tamanho
const sizes = {
  lg: {
    label: 'text-lg mb-2',
    pl: 'pl-4',
    pr: 'pr-4',
    input: 'h-14 text-lg',
    floating: 'h-16 pt-6 pb-1 text-lg',
    textarea: 'min-h-28 py-3 text-lg',
    textareaFloating: 'min-h-32 pt-8 pb-3 text-lg',
    floatLeft: 'left-4',
    floatDown: 'text-lg',
    floatDownTextarea: 'top-3',
    floatUp: 'top-1.5 text-sm',
    msg: 'text-sm mt-1.5',
  },
  md: {
    label: 'text-base mb-1.5',
    pl: 'pl-3.5',
    pr: 'pr-3.5',
    input: 'h-11 text-base',
    floating: 'h-12 pt-5 pb-1 text-base',
    textarea: 'min-h-24 py-2.5 text-base',
    textareaFloating: 'min-h-28 pt-7 pb-2.5 text-base',
    floatLeft: 'left-3.5',
    floatDown: 'text-base',
    floatDownTextarea: 'top-2.5',
    floatUp: 'top-1 text-xs',
    msg: 'text-xs mt-1',
  },
}
const s = computed(() => sizes[props.size])

const inputClasses = computed(() => [
  'block w-full rounded-lg border bg-[#18202C] text-slate-100 placeholder:text-[#86909F]',
  'outline-none transition-colors duration-150 [color-scheme:dark]',
  'disabled:cursor-not-allowed disabled:opacity-50 read-only:opacity-80',
  s.value.pl,
  isPassword.value ? 'pr-12' : s.value.pr,
  isTextarea.value
    ? isFloating.value ? s.value.textareaFloating : s.value.textarea
    : isFloating.value ? s.value.floating : s.value.input,
  hasError.value
    ? 'border-red-500 focus:ring-1 focus:ring-red-500'
    : 'border-slate-600 hover:border-[#86909F] focus:border-[#2BA69C] focus:ring-1 focus:ring-[#2BA69C]',
  isFile.value
    ? 'cursor-pointer file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-[#2BA69C] file:px-3 file:py-0.5 file:text-sm file:font-semibold file:text-white hover:file:bg-teal-600'
    : '',
])

// label normal
const topLabelColor = computed(() =>
  hasError.value ? 'text-[#FF82BD]' : focused.value ? 'text-[#2BA69C]' : 'text-slate-300',
)

// label futuante
const floatLabelClasses = computed(() => [
  'pointer-events-none absolute z-10 origin-left transition-all duration-150',
  s.value.floatLeft,
  isFloated.value
    ? s.value.floatUp
    : [
        isTextarea.value ? s.value.floatDownTextarea : 'top-1/2 -translate-y-1/2',
        s.value.floatDown,
      ],
  hasError.value ? 'text-[#FF82BD]' : focused.value ? 'text-[#2BA69C]' : 'text-slate-400',
])

// eventos
function onInput(e) {
  const el = e.target

  if (isFile.value) {
    const files = Array.from(el.files || [])
    fileCount.value = files.length
    emit('update:modelValue', props.multiple ? files : files[0] ?? null)
    return
  }

  let value = el.value
  if (props.type === 'number' && value !== '') value = Number(value)
  emit('update:modelValue', value)
}

function onFocus(e) {
  focused.value = true
  emit('focus', e)
}

function onBlur(e) {
  focused.value = false
  emit('blur', e)
}

// Permite limpar o input de arquivo pelo pai (form.avatar = null)
watch(
  () => props.modelValue,
  (v) => {
    const empty = v == null || (Array.isArray(v) && v.length === 0)
    if (isFile.value && empty && inputRef.value) {
      inputRef.value.value = ''
      fileCount.value = 0
    }
  },
)

defineExpose({ focus: () => inputRef.value?.focus(), el: inputRef })
</script>

<template>
    <div class="w-full">
    <!-- Label acima (variante default) -->
    <label
      v-if="variant === 'default' && label"
      :for="inputId"
      :class="['block font-medium transition-colors duration-150', s.label, topLabelColor, disabled && 'opacity-60']"
    >
      {{ label }}
      <span v-if="required" class="text-[#FF82BD]" aria-hidden="true">*</span>
      <span v-else-if="showOptional" class="text-[0.8em] font-normal text-[#86909F]">(opcional)</span>
    </label>

    <div class="relative">
      <component
        :is="isTextarea ? 'textarea' : 'input'"
        :id="inputId"
        ref="inputRef"
        :name="name"
        :type="isTextarea ? undefined : currentType"
        :value="isFile ? undefined : modelValue"
        :placeholder="isFloating && !focused ? undefined : placeholder"
        :required="required"
        :disabled="disabled"
        :readonly="readonly"
        :autocomplete="autocomplete"
        :accept="accept"
        :multiple="multiple"
        :min="min"
        :max="max"
        :step="step"
        :maxlength="maxlength"
        :rows="isTextarea ? rows : undefined"
        :aria-invalid="hasError || undefined"
        :aria-describedby="describedBy"
        :class="inputClasses"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
      />

      <!-- Label flutuante -->
      <label
        v-if="isFloating && label"
        :for="inputId"
        :class="[floatLabelClasses, disabled && 'opacity-60']"
      >
        {{ label }}
        <span v-if="required" class="text-[#FF82BD]" aria-hidden="true">*</span>
        <span v-else-if="showOptional" class="text-[0.8em] font-normal text-[#86909F]">(opcional)</span>
      </label>

      <!-- Mostrar / ocultar senha -->
      <button
        v-if="isPassword"
        type="button"
        class="absolute right-3 top-1/2 -translate-y-1/2 rounded text-slate-400 transition-colors hover:text-slate-200 focus-visible:text-teal-400 focus-visible:outline-none"
        :aria-label="showPassword ? 'Ocultar senha' : 'Mostrar senha'"
        :aria-pressed="showPassword"
        :disabled="disabled"
        @click="showPassword = !showPassword"
      >
        <svg
          v-if="!showPassword"
          class="size-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        <svg
          v-else
          class="size-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 19c-6.5 0-10-7-10-7a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c6.5 0 10 7 10 7a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
      </button>
    </div>

    <!-- Erros -->
    <div v-if="hasError" :id="errorId" role="alert" :class="['text-[#FF82BD]', s.msg]">
      <p v-for="msg in errors" :key="msg">{{ msg }}</p>
    </div>

    <!-- Dica -->
    <p v-else-if="hint" :id="hintId" :class="['text-slate-400', s.msg]">
      {{ hint }}
    </p>
  </div>
</template>