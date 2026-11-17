<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 bg-black/60 flex items-center justify-center"
      :class="zClass"
      @click.self="$emit('close')"
    >
      <div
        class="bg-[#151823] rounded-2xl p-6 shadow-xl flex flex-col"
        :class="[widthClass, panelClass]"
      >
        <h2
          v-if="$slots.title"
          class="font-inter font-bold text-lg text-white mb-5 leading-snug"
        >
          <slot name="title" />
        </h2>

        <slot />

        <div v-if="$slots.footer" class="mt-4">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'

defineProps({
  widthClass: { type: String, default: 'w-[360px]' },
  zClass: { type: String, default: 'z-50' },
  panelClass: { type: String, default: '' },
})

const emit = defineEmits(['close'])

function onKeydown(e) {
  if (e.key === 'Escape') emit('close')
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>