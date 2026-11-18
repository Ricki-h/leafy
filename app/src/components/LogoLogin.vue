<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import folhaSvg from '../../assets/folha.svg' 

const containerRef = ref(null)

// Posição atual (suavizada) e posição alvo (onde o mouse está)
const current = ref({ x: 0, y: 0 })
const target = ref({ x: 0, y: 0 })
let animationFrameId = null

// Margem interna (%) para o centro do brilho nunca escapar das bordas da logo
const MARGEM_X = 0.22
const MARGEM_Y = 0.18

function clamp(valor, min, max) {
  return Math.max(min, Math.min(max, valor))
}

function handleMouseMove(e) {
  if (!containerRef.value) return

  const rect = containerRef.value.getBoundingClientRect()
  const relX = e.clientX - rect.left
  const relY = e.clientY - rect.top

  const minX = rect.width * MARGEM_X
  const maxX = rect.width * (1 - MARGEM_X)
  const minY = rect.height * MARGEM_Y
  const maxY = rect.height * (1 - MARGEM_Y)

  target.value.x = clamp(relX, minX, maxX)
  target.value.y = clamp(relY, minY, maxY)
}

function animar() {
  // Interpolação linear (lerp) para o brilho deslizar suavemente
  current.value.x += (target.value.x - current.value.x) * 0.12
  current.value.y += (target.value.y - current.value.y) * 0.12

  animationFrameId = requestAnimationFrame(animar)
}

onMounted(() => {
  // Inicia o brilho centralizado na logo (como na imagem de referência)
  if (containerRef.value) {
    const { width, height } = containerRef.value.getBoundingClientRect()
    current.value = { x: width / 2, y: height / 2 }
    target.value = { x: width / 2, y: height / 2 }
  }

  window.addEventListener('mousemove', handleMouseMove)
  animar()
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
  cancelAnimationFrame(animationFrameId)
})

const maskStyle = {
  maskImage: `url(${folhaSvg})`,
  WebkitMaskImage: `url(${folhaSvg})`,
  maskSize: 'contain',
  WebkitMaskSize: 'contain',
  maskRepeat: 'no-repeat',
  WebkitMaskRepeat: 'no-repeat',
  maskPosition: 'center',
  WebkitMaskPosition: 'center',
}
</script>

<template>
  <!-- 1.5x maior: de w-64 h-96 (256x384) para w-[384px] h-[576px] -->
  <div
    ref="containerRef"
    class="relative w-[384px] h-[576px] select-none pointer-events-none"
  >
    <!-- 1. Camada de brilho difuso externo (raio ajustado para 210px e blur-lg) -->
    <div
      class="absolute inset-0 blur-lg opacity-50"
      :style="{
        ...maskStyle,
        background: `radial-gradient(circle 210px at ${current.x}px ${current.y}px, #2BA69C 0%, rgba(43, 166, 156, 0.3) 45%, transparent 75%)`
      }"
    />

    <!-- 2. Camada base cinza da logo -->
    <div
      class="absolute inset-0 bg-[#323E4F]"
      :style="maskStyle"
    />

    <!-- 3. Camada do gradiente radial verde recortada pela máscara -->
    <div
      class="absolute inset-0"
      :style="{
        ...maskStyle,
        background: `radial-gradient(circle 210px at ${current.x}px ${current.y}px, #2BA69C 0%, rgba(43, 166, 156, 0.45) 45%, transparent 75%)`
      }"
    />
  </div>
</template>