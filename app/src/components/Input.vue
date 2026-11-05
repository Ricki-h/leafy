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
</script>

<template>

</template>