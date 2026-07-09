<template>
  <div class="w-full bg-[#151823] rounded-xl p-6 flex items-center justify-between gap-6">
    <!-- Left: avatar + content -->
    <div class="flex gap-4 flex-1 min-w-0">
      <!-- Avatar -->
      <div class="w-12 h-12 rounded-full bg-gray-300 shrink-0"></div>

      <div class="flex-1 min-w-0">
        <!-- Name + username -->
        <div class="flex items-baseline gap-2 mb-1">
          <span class="text-white font-semibold text-sm">{{ name }}</span>
          <span class="text-gray-400 text-sm">@{{ username }}</span>
        </div>

        <!-- Review text -->
        <p class="text-gray-300 text-sm leading-relaxed mb-3">
          {{ text }}
        </p>

        <!-- Stars -->
        <div class="flex gap-1">
          <svg
            v-for="n in 5"
            :key="n"
            viewBox="0 0 24 24"
            class="w-5 h-5"
            :class="n <= rating ? 'fill-teal-400' : 'fill-gray-500'"
          >
            <path
              d="M12 2l2.9 6.26 6.9.6-5.2 4.53 1.6 6.77L12 16.9l-6.2 3.26 1.6-6.77L2.2 8.86l6.9-.6L12 2z"
            />
          </svg>
        </div>
      </div>
    </div>

    <!-- Right: image placeholder -->
    <div class="w-24 h-24 md:w-28 md:h-28 bg-gray-300 rounded-md relative shrink-0 overflow-hidden">
      <svg class="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <line x1="0" y1="0" x2="100" y2="100" stroke="#4b5563" stroke-width="1" />
        <line x1="100" y1="0" x2="0" y2="100" stroke="#4b5563" stroke-width="1" />
      </svg>
    </div>
  </div>
</template>

<script setup>
defineProps({
  name: {
    type: String,
    default: 'Nome da Pessoa',
  },
  username: {
    type: String,
    default: 'nome_de_usuario',
  },
  text: {
    type: String,
    default:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce non volutpat odio. Maecenas feugiat est eget dolor volutpat, non luctus orci mattis.',
  },
  rating: {
    type: Number,
    default: 4,
  },
})
</script>