<!-- UserAvatar.vue -->
<script setup>
defineProps({
  src: {
    type: String,
    default: null
  },
  name: {
    type: String,
    default: 'Usuário'
  },
  sizeClass: {
    type: String,
    default: 'w-10 h-10' // tamanho padrão (pode mudar para w-20 h-20, etc)
  }
})
</script>

<template>
  <div 
    class="relative rounded-full bg-gray-600 flex items-center justify-center overflow-hidden shrink-0"
    :class="sizeClass"
  >
    <!-- Se tiver foto, mostra a foto -->
    <img 
      v-if="src" 
      :src="src" 
      :alt="name" 
      class="w-full h-full object-cover" 
    />
    
    <!-- Se não tiver foto, mostra a inicial do nome como fallback -->
    <span v-else class="text-white font-medium uppercase text-sm">
      {{ name.charAt(0) }}
    </span>
  </div>
</template>