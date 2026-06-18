<script setup>
    import { RouterLink } from 'vue-router';
    const username = 'ricki'
    
</script>

<template>
    <aside class="min-h-screen w-full max-w-96 flex flex-col gap-6 px-6 py-4 border-l border-l-[#5A6270]">
        <label class="input bg-[#18202C] rounded-full text-[#5A6270] border-[#5A6270]">
            <svg class="h-4 opacity-50 fill-[#5A6270]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g
                stroke-linejoin="round"
                stroke-linecap="round"
                stroke-width="2.5"
                fill="none"
                stroke="currentColor"
                >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
                </g>
            </svg>
            <input type="search" required placeholder="Search" class="p-2  text-base"/>
        </label>
        <div>
            <RouterLink :to="'/users/' + username" class="flex gap-3 items-center p-4 bg-[#18202C] hover:bg-[#2E3B4E]">
                <div class="w-12 h-12 rounded-full bg-[#D9D9D9]"></div>
                <div class="flex flex-col items-start">
                    <p class="text-[#CCD6E5] text-base font-semibold">Nome da pessoa</p>
                    <p class="text-[#5A6270] text-sm">@username</p>
                </div>
            </RouterLink>
            <RouterLink :to="'/users/' + username" class="flex gap-3 items-center p-4 bg-[#18202C] hover:bg-[#2E3B4E]">
                <div class="w-12 h-12 rounded-full bg-[#D9D9D9]"></div>
                <div class="flex flex-col items-start">
                    <p class="text-[#CCD6E5] text-base font-semibold">Nome da pessoa</p>
                    <p class="text-[#5A6270] text-sm">@username</p>
                </div>
            </RouterLink>
            <RouterLink :to="'/users/' + username" class="flex gap-3 items-center p-4 bg-[#18202C] hover:bg-[#2E3B4E]">
                <div class="w-12 h-12 rounded-full bg-[#D9D9D9]"></div>
                <div class="flex flex-col items-start">
                    <p class="text-[#CCD6E5] text-base font-semibold">Nome da pessoa</p>
                    <p class="text-[#5A6270] text-sm">@username</p>
                </div>
            </RouterLink>
            <RouterLink :to="'/users/' + username" class="flex gap-3 items-center p-4 bg-[#18202C] hover:bg-[#2E3B4E]">
                <div class="w-12 h-12 rounded-full bg-[#D9D9D9]"></div>
                <div class="flex flex-col items-start">
                    <p class="text-[#CCD6E5] text-base font-semibold">Nome da pessoa</p>
                    <p class="text-[#5A6270] text-sm">@username</p>
                </div>
            </RouterLink>
            <RouterLink :to="'/users/' + username" class="flex gap-3 items-center p-4 bg-[#18202C] hover:bg-[#2E3B4E]">
                <div class="w-12 h-12 rounded-full bg-[#D9D9D9]"></div>
                <div class="flex flex-col items-start">
                    <p class="text-[#CCD6E5] text-base font-semibold">Nome da pessoa</p>
                    <p class="text-[#5A6270] text-sm">@username</p>
                </div>
            </RouterLink>
        </div>
        <hr class="border-[#5A6270]">
        <p class="text-[#5A6270] text-xs/5">Termos de serviço | Política de privacidade | Política de cookies | Acessibilidade | © 2026 Leafy Corp.</p>
    </aside>
</template>