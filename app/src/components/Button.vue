<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps({
  color: {
    type: String,
    default: 'gray',
    validator: (v) => ['gray', 'green', 'pink', 'purple', 'dark', 'slate'].includes(v),
  },
  variant: {
    type: String,
    default: 'filled',
    validator: (v) => ['filled', 'outline'].includes(v),
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['lg', 'md', 'sm', 'xs'].includes(v),
  },
  disabled: { type: Boolean, default: false },
  to: { type: [String, Object], default: null }, // rota (vue-router)
  href: { type: String, default: null }, // link externo
  target: { type: String, default: null },
  type: { type: String, default: 'button' },
})

const filled = {
  gray: 'bg-[#18202C] text-slate-800 hover:bg-[#2E3B4E] focus-visible:ring-slate-400',
  green: 'bg-[#CCD6E5] text-[#18202C] hover:bg-[#2BA69C] focus-visible:ring-teal-400',
  pink: 'bg-[#CCD6E5] text-[#18202C] hover:bg-[#FF82BD] focus-visible:ring-pink-400',
  purple: 'bg-[#CCD6E5] text-[#18202C] hover:bg-[#974EFD] focus-visible:ring-purple-400',
  dark: 'bg-slate-900 text-[#18202C] hover:bg-slate-800 focus-visible:ring-slate-500',
  slate: 'bg-slate-600 text-[#18202C] hover:bg-slate-700 focus-visible:ring-slate-400',
}

const outline = {
  gray: 'border border-slate-400 text-slate-600 hover:bg-slate-100 focus-visible:ring-slate-400',
  green: 'border border-[#2BA69C] text-[#2BA69C] hover:bg-[#2BA69C] hover:text-[#18202C] focus-visible:ring-teal-400',
  pink: 'border border-[#FF82BD] text-[#FF82BD] hover:bg-[#FF82BD] hover:text-[#18202C] focus-visible:ring-pink-400',
  purple: 'border border-[#974EFD] text-[#974EFD] hover:bg-[#974EFD] hover:text-[#18202C] focus-visible:ring-purple-400',
  dark: 'border border-slate-900 text-slate-900 hover:bg-slate-900 focus-visible:ring-slate-500',
  slate: 'border border-slate-600 text-slate-600 hover:bg-slate-600 focus-visible:ring-slate-400',
}

const sizes = {
  lg: 'h-10 px-5 py-5 text-base gap-2',
  md: 'h-9 px-4 py-4 text-sm gap-1.5',
  sm: 'h-8 px-3.5 py-3.5 text-xs gap-1.5',
  xs: 'h-6 px-3 py-3 text-[10px] gap-1',
}

const tag = computed(() => {
  if (props.to) return RouterLink
  if (props.href) return 'a'
  return 'button'
})

const tagProps = computed(() => {
  if (props.to) return { to: props.to }
  if (props.href) {
    return {
      href: props.href,
      target: props.target,
      rel: props.target === '_blank' ? 'noopener noreferrer' : undefined,
    }
  }
  return { type: props.type, disabled: props.disabled }
})

const classes = computed(() => [
  'inline-flex items-center justify-center rounded-full font-semibold select-none',
  'transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
  sizes[props.size],
  props.variant === 'filled' ? filled[props.color] : outline[props.color],
  props.disabled ? 'opacity-50 pointer-events-none' : 'cursor-pointer',
])
</script>

<template>
  <component
    :is="tag"
    v-bind="tagProps"
    :class="classes"
    :aria-disabled="disabled || undefined"
    :tabindex="disabled && tag !== 'button' ? -1 : undefined"
  >
    <slot>Button</slot>
  </component>
</template>