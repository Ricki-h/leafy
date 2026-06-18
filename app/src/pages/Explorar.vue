<script setup>
    import { ref } from 'vue';
    import Template from './base/Template.vue';
    import { RouterLink } from 'vue-router';
    const username = 'ricki'
    const page = ref('all')
    function mudaPage(pagina) {
        page.value = pagina
    }
    
    const qtdposts = 20
</script>

<template>
    <Template>
        <div class="flex flex-col h-full border-r border-[#5A6270]">
            <div class="px-8 py-6 border-b border-[#5A6270]">
                <label class="input bg-[#0E121A] rounded-full text-[#5A6270] border-[#5A6270] w-full focus:border-[#2BA69C] focus:outline-0">
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
                    <input type="search" required placeholder="Search" class="p-2 focus:border-[#2BA69C] text-base text-[#5A6270]"/>
                </label>
            </div>
            <div class="px-8 border-b border-[#5A6270] flex">
                <button @click="mudaPage('all')" class="w-full font-semibold hover:bg-[#2E3B4E] py-3 hover:cursor-pointer" :class="page == 'all' ? 'bg-[#2BA69C] text-[#0E121A]' : 'text-[#CCD6E5] bg-none'" >
                    Todos
                </button>
                <button @click="mudaPage('posts')" class="w-full font-semibold hover:bg-[#2E3B4E] py-3 hover:cursor-pointer"
                :class="page == 'posts' ? 'bg-[#2BA69C] text-[#0E121A]' : 'text-[#CCD6E5] bg-none'">
                    Posts
                </button>
                <button @click="mudaPage('users')" class="w-full font-semibold hover:bg-[#2E3B4E] py-3 hover:cursor-pointer"
                :class="page == 'users' ? 'bg-[#2BA69C] text-[#0E121A]' : 'text-[#CCD6E5] bg-none'">
                    Usuários
                </button>
            </div>

            <div class="overflow-y-auto">
                <template v-if="page == 'all'">
                    <div class="px-8 py-3 flex gap-3">
                        <div class="min-w-12 h-12 rounded-full bg-[#D9D9D9] hover:cursor-pointer"></div>
                        <div class="flex flex-col gap-2">
                            <div class="flex items-center gap-1">
                                <p class="text-[#CCD6E5] text-sm font-semibold">Nome da pessoa</p>
                                <p class="text-[#5A6270] text-sm hover:cursor-pointer">@username</p>
                            </div>
                            <p class="text-[#CCD6E5] text-sm">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce non volutpat odio. Maecenas feugiat est eget dolor volutpat, non luctus orci mattis.
                            </p>
                            <div class="w-full h-8 bg-[#D9D9D9]"></div>
                        </div>
                    </div>
                    <RouterLink :to="'/users/' + username" class="flex gap-3 items-center p-4 px-8 bg-[#0E121A] hover:bg-[#2E3B4E]">
                        <div class="w-12 h-12 rounded-full bg-[#D9D9D9]"></div>
                        <div class="flex flex-col items-start">
                            <p class="text-[#CCD6E5] text-base font-semibold">Nome da pessoa</p>
                            <p class="text-[#5A6270] text-sm">@username</p>
                        </div>
                    </RouterLink>
                    <div class="px-8 py-3 flex gap-3">
                        <div class="min-w-12 h-12 rounded-full bg-[#D9D9D9] hover:cursor-pointer"></div>
                        <div class="flex flex-col gap-2">
                            <div class="flex items-center gap-1">
                                <p class="text-[#CCD6E5] text-sm font-semibold">Nome da pessoa</p>
                                <p class="text-[#5A6270] text-sm hover:cursor-pointer">@username</p>
                            </div>
                            <p class="text-[#CCD6E5] text-sm">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce non volutpat odio. Maecenas feugiat est eget dolor volutpat, non luctus orci mattis.
                            </p>
                            <div class="w-full h-8 bg-[#D9D9D9]"></div>
                        </div>
                    </div>
                    <RouterLink :to="'/users/' + username" class="flex gap-3 items-center p-4 px-8 bg-[#0E121A] hover:bg-[#2E3B4E]">
                        <div class="w-12 h-12 rounded-full bg-[#D9D9D9]"></div>
                        <div class="flex flex-col items-start">
                            <p class="text-[#CCD6E5] text-base font-semibold">Nome da pessoa</p>
                            <p class="text-[#5A6270] text-sm">@username</p>
                        </div>
                    </RouterLink>
                    <div class="px-8 py-3 flex gap-3">
                        <div class="min-w-12 h-12 rounded-full bg-[#D9D9D9] hover:cursor-pointer"></div>
                        <div class="flex flex-col gap-2">
                            <div class="flex items-center gap-1">
                                <p class="text-[#CCD6E5] text-sm font-semibold">Nome da pessoa</p>
                                <p class="text-[#5A6270] text-sm hover:cursor-pointer">@username</p>
                            </div>
                            <p class="text-[#CCD6E5] text-sm">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce non volutpat odio. Maecenas feugiat est eget dolor volutpat, non luctus orci mattis.
                            </p>
                            <div class="w-full h-8 bg-[#D9D9D9]"></div>
                        </div>
                    </div>
                    <RouterLink :to="'/users/' + username" class="flex gap-3 items-center p-4 px-8 bg-[#0E121A] hover:bg-[#2E3B4E]">
                        <div class="w-12 h-12 rounded-full bg-[#D9D9D9]"></div>
                        <div class="flex flex-col items-start">
                            <p class="text-[#CCD6E5] text-base font-semibold">Nome da pessoa</p>
                            <p class="text-[#5A6270] text-sm">@username</p>
                        </div>
                    </RouterLink>
                    <div class="px-8 py-3 flex gap-3">
                        <div class="min-w-12 h-12 rounded-full bg-[#D9D9D9] hover:cursor-pointer"></div>
                        <div class="flex flex-col gap-2">
                            <div class="flex items-center gap-1">
                                <p class="text-[#CCD6E5] text-sm font-semibold">Nome da pessoa</p>
                                <p class="text-[#5A6270] text-sm hover:cursor-pointer">@username</p>
                            </div>
                            <p class="text-[#CCD6E5] text-sm">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce non volutpat odio. Maecenas feugiat est eget dolor volutpat, non luctus orci mattis.
                            </p>
                            <div class="w-full h-8 bg-[#D9D9D9]"></div>
                        </div>
                    </div>
                    <RouterLink :to="'/users/' + username" class="flex gap-3 items-center p-4 px-8 bg-[#0E121A] hover:bg-[#2E3B4E]">
                        <div class="w-12 h-12 rounded-full bg-[#D9D9D9]"></div>
                        <div class="flex flex-col items-start">
                            <p class="text-[#CCD6E5] text-base font-semibold">Nome da pessoa</p>
                            <p class="text-[#5A6270] text-sm">@username</p>
                        </div>
                    </RouterLink>
                    <div class="px-8 py-3 flex gap-3">
                        <div class="min-w-12 h-12 rounded-full bg-[#D9D9D9] hover:cursor-pointer"></div>
                        <div class="flex flex-col gap-2">
                            <div class="flex items-center gap-1">
                                <p class="text-[#CCD6E5] text-sm font-semibold">Nome da pessoa</p>
                                <p class="text-[#5A6270] text-sm hover:cursor-pointer">@username</p>
                            </div>
                            <p class="text-[#CCD6E5] text-sm">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce non volutpat odio. Maecenas feugiat est eget dolor volutpat, non luctus orci mattis.
                            </p>
                            <div class="w-full h-8 bg-[#D9D9D9]"></div>
                        </div>
                    </div>
                    <RouterLink :to="'/users/' + username" class="flex gap-3 items-center p-4 px-8 bg-[#0E121A] hover:bg-[#2E3B4E]">
                        <div class="w-12 h-12 rounded-full bg-[#D9D9D9]"></div>
                        <div class="flex flex-col items-start">
                            <p class="text-[#CCD6E5] text-base font-semibold">Nome da pessoa</p>
                            <p class="text-[#5A6270] text-sm">@username</p>
                        </div>
                    </RouterLink>
                    <div class="px-8 py-3 flex gap-3">
                        <div class="min-w-12 h-12 rounded-full bg-[#D9D9D9] hover:cursor-pointer"></div>
                        <div class="flex flex-col gap-2">
                            <div class="flex items-center gap-1">
                                <p class="text-[#CCD6E5] text-sm font-semibold">Nome da pessoa</p>
                                <p class="text-[#5A6270] text-sm hover:cursor-pointer">@username</p>
                            </div>
                            <p class="text-[#CCD6E5] text-sm">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce non volutpat odio. Maecenas feugiat est eget dolor volutpat, non luctus orci mattis.
                            </p>
                            <div class="w-full h-8 bg-[#D9D9D9]"></div>
                        </div>
                    </div>
                    <RouterLink :to="'/users/' + username" class="flex gap-3 items-center p-4 px-8 bg-[#0E121A] hover:bg-[#2E3B4E]">
                        <div class="w-12 h-12 rounded-full bg-[#D9D9D9]"></div>
                        <div class="flex flex-col items-start">
                            <p class="text-[#CCD6E5] text-base font-semibold">Nome da pessoa</p>
                            <p class="text-[#5A6270] text-sm">@username</p>
                        </div>
                    </RouterLink>
                    <div class="px-8 py-3 flex gap-3">
                        <div class="min-w-12 h-12 rounded-full bg-[#D9D9D9] hover:cursor-pointer"></div>
                        <div class="flex flex-col gap-2">
                            <div class="flex items-center gap-1">
                                <p class="text-[#CCD6E5] text-sm font-semibold">Nome da pessoa</p>
                                <p class="text-[#5A6270] text-sm hover:cursor-pointer">@username</p>
                            </div>
                            <p class="text-[#CCD6E5] text-sm">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce non volutpat odio. Maecenas feugiat est eget dolor volutpat, non luctus orci mattis.
                            </p>
                            <div class="w-full h-8 bg-[#D9D9D9]"></div>
                        </div>
                    </div>
                    <RouterLink :to="'/users/' + username" class="flex gap-3 items-center p-4 px-8 bg-[#0E121A] hover:bg-[#2E3B4E]">
                        <div class="w-12 h-12 rounded-full bg-[#D9D9D9]"></div>
                        <div class="flex flex-col items-start">
                            <p class="text-[#CCD6E5] text-base font-semibold">Nome da pessoa</p>
                            <p class="text-[#5A6270] text-sm">@username</p>
                        </div>
                    </RouterLink>
                </template>
                <template v-else-if="page == 'posts'">
                    <div class="px-8 py-3 flex gap-3">
                        <div class="min-w-12 h-12 rounded-full bg-[#D9D9D9] hover:cursor-pointer"></div>
                        <div class="flex flex-col gap-2">
                            <div class="flex items-center gap-1">
                                <p class="text-[#CCD6E5] text-sm font-semibold">Nome da pessoa</p>
                                <p class="text-[#5A6270] text-sm hover:cursor-pointer">@username</p>
                            </div>
                            <p class="text-[#CCD6E5] text-sm">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce non volutpat odio. Maecenas feugiat est eget dolor volutpat, non luctus orci mattis.
                            </p>
                            <div class="w-full h-8 bg-[#D9D9D9]"></div>
                        </div>
                    </div>
                    <div class="px-8 py-3 flex gap-3">
                        <div class="min-w-12 h-12 rounded-full bg-[#D9D9D9] hover:cursor-pointer"></div>
                        <div class="flex flex-col gap-2">
                            <div class="flex items-center gap-1">
                                <p class="text-[#CCD6E5] text-sm font-semibold">Nome da pessoa</p>
                                <p class="text-[#5A6270] text-sm hover:cursor-pointer">@username</p>
                            </div>
                            <p class="text-[#CCD6E5] text-sm">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce non volutpat odio. Maecenas feugiat est eget dolor volutpat, non luctus orci mattis.
                            </p>
                            <div class="w-full h-8 bg-[#D9D9D9]"></div>
                        </div>
                    </div>
                    <div class="px-8 py-3 flex gap-3">
                        <div class="min-w-12 h-12 rounded-full bg-[#D9D9D9] hover:cursor-pointer"></div>
                        <div class="flex flex-col gap-2">
                            <div class="flex items-center gap-1">
                                <p class="text-[#CCD6E5] text-sm font-semibold">Nome da pessoa</p>
                                <p class="text-[#5A6270] text-sm hover:cursor-pointer">@username</p>
                            </div>
                            <p class="text-[#CCD6E5] text-sm">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce non volutpat odio. Maecenas feugiat est eget dolor volutpat, non luctus orci mattis.
                            </p>
                            <div class="w-full h-8 bg-[#D9D9D9]"></div>
                        </div>
                    </div>
                    <div class="px-8 py-3 flex gap-3">
                        <div class="min-w-12 h-12 rounded-full bg-[#D9D9D9] hover:cursor-pointer"></div>
                        <div class="flex flex-col gap-2">
                            <div class="flex items-center gap-1">
                                <p class="text-[#CCD6E5] text-sm font-semibold">Nome da pessoa</p>
                                <p class="text-[#5A6270] text-sm hover:cursor-pointer">@username</p>
                            </div>
                            <p class="text-[#CCD6E5] text-sm">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce non volutpat odio. Maecenas feugiat est eget dolor volutpat, non luctus orci mattis.
                            </p>
                            <div class="w-full h-8 bg-[#D9D9D9]"></div>
                        </div>
                    </div>
                    <div class="px-8 py-3 flex gap-3">
                        <div class="min-w-12 h-12 rounded-full bg-[#D9D9D9] hover:cursor-pointer"></div>
                        <div class="flex flex-col gap-2">
                            <div class="flex items-center gap-1">
                                <p class="text-[#CCD6E5] text-sm font-semibold">Nome da pessoa</p>
                                <p class="text-[#5A6270] text-sm hover:cursor-pointer">@username</p>
                            </div>
                            <p class="text-[#CCD6E5] text-sm">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce non volutpat odio. Maecenas feugiat est eget dolor volutpat, non luctus orci mattis.
                            </p>
                            <div class="w-full h-8 bg-[#D9D9D9]"></div>
                        </div>
                    </div>
                    <div class="px-8 py-3 flex gap-3">
                        <div class="min-w-12 h-12 rounded-full bg-[#D9D9D9] hover:cursor-pointer"></div>
                        <div class="flex flex-col gap-2">
                            <div class="flex items-center gap-1">
                                <p class="text-[#CCD6E5] text-sm font-semibold">Nome da pessoa</p>
                                <p class="text-[#5A6270] text-sm hover:cursor-pointer">@username</p>
                            </div>
                            <p class="text-[#CCD6E5] text-sm">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce non volutpat odio. Maecenas feugiat est eget dolor volutpat, non luctus orci mattis.
                            </p>
                            <div class="w-full h-8 bg-[#D9D9D9]"></div>
                        </div>
                    </div>
                    <div class="px-8 py-3 flex gap-3">
                        <div class="min-w-12 h-12 rounded-full bg-[#D9D9D9] hover:cursor-pointer"></div>
                        <div class="flex flex-col gap-2">
                            <div class="flex items-center gap-1">
                                <p class="text-[#CCD6E5] text-sm font-semibold">Nome da pessoa</p>
                                <p class="text-[#5A6270] text-sm hover:cursor-pointer">@username</p>
                            </div>
                            <p class="text-[#CCD6E5] text-sm">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce non volutpat odio. Maecenas feugiat est eget dolor volutpat, non luctus orci mattis.
                            </p>
                            <div class="w-full h-8 bg-[#D9D9D9]"></div>
                        </div>
                    </div>
                    <div class="px-8 py-3 flex gap-3">
                        <div class="min-w-12 h-12 rounded-full bg-[#D9D9D9] hover:cursor-pointer"></div>
                        <div class="flex flex-col gap-2">
                            <div class="flex items-center gap-1">
                                <p class="text-[#CCD6E5] text-sm font-semibold">Nome da pessoa</p>
                                <p class="text-[#5A6270] text-sm hover:cursor-pointer">@username</p>
                            </div>
                            <p class="text-[#CCD6E5] text-sm">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce non volutpat odio. Maecenas feugiat est eget dolor volutpat, non luctus orci mattis.
                            </p>
                            <div class="w-full h-8 bg-[#D9D9D9]"></div>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <RouterLink :to="'/users/' + username" class="flex gap-3 items-center p-4 px-8 bg-[#0E121A] hover:bg-[#2E3B4E]">
                        <div class="w-12 h-12 rounded-full bg-[#D9D9D9]"></div>
                        <div class="flex flex-col items-start">
                            <p class="text-[#CCD6E5] text-base font-semibold">Nome da pessoa</p>
                            <p class="text-[#5A6270] text-sm">@username</p>
                        </div>
                    </RouterLink>
                    <RouterLink :to="'/users/' + username" class="flex gap-3 items-center p-4 px-8 bg-[#0E121A] hover:bg-[#2E3B4E]">
                        <div class="w-12 h-12 rounded-full bg-[#D9D9D9]"></div>
                        <div class="flex flex-col items-start">
                            <p class="text-[#CCD6E5] text-base font-semibold">Nome da pessoa</p>
                            <p class="text-[#5A6270] text-sm">@username</p>
                        </div>
                    </RouterLink>
                    <RouterLink :to="'/users/' + username" class="flex gap-3 items-center p-4 px-8 bg-[#0E121A] hover:bg-[#2E3B4E]">
                        <div class="w-12 h-12 rounded-full bg-[#D9D9D9]"></div>
                        <div class="flex flex-col items-start">
                            <p class="text-[#CCD6E5] text-base font-semibold">Nome da pessoa</p>
                            <p class="text-[#5A6270] text-sm">@username</p>
                        </div>
                    </RouterLink>
                    <RouterLink :to="'/users/' + username" class="flex gap-3 items-center p-4 px-8 bg-[#0E121A] hover:bg-[#2E3B4E]">
                        <div class="w-12 h-12 rounded-full bg-[#D9D9D9]"></div>
                        <div class="flex flex-col items-start">
                            <p class="text-[#CCD6E5] text-base font-semibold">Nome da pessoa</p>
                            <p class="text-[#5A6270] text-sm">@username</p>
                        </div>
                    </RouterLink>
                    <RouterLink :to="'/users/' + username" class="flex gap-3 items-center p-4 px-8 bg-[#0E121A] hover:bg-[#2E3B4E]">
                        <div class="w-12 h-12 rounded-full bg-[#D9D9D9]"></div>
                        <div class="flex flex-col items-start">
                            <p class="text-[#CCD6E5] text-base font-semibold">Nome da pessoa</p>
                            <p class="text-[#5A6270] text-sm">@username</p>
                        </div>
                    </RouterLink>
                    <RouterLink :to="'/users/' + username" class="flex gap-3 items-center p-4 px-8 bg-[#0E121A] hover:bg-[#2E3B4E]">
                        <div class="w-12 h-12 rounded-full bg-[#D9D9D9]"></div>
                        <div class="flex flex-col items-start">
                            <p class="text-[#CCD6E5] text-base font-semibold">Nome da pessoa</p>
                            <p class="text-[#5A6270] text-sm">@username</p>
                        </div>
                    </RouterLink>
                    <RouterLink :to="'/users/' + username" class="flex gap-3 items-center p-4 px-8 bg-[#0E121A] hover:bg-[#2E3B4E]">
                        <div class="w-12 h-12 rounded-full bg-[#D9D9D9]"></div>
                        <div class="flex flex-col items-start">
                            <p class="text-[#CCD6E5] text-base font-semibold">Nome da pessoa</p>
                            <p class="text-[#5A6270] text-sm">@username</p>
                        </div>
                    </RouterLink>
                    <RouterLink :to="'/users/' + username" class="flex gap-3 items-center p-4 px-8 bg-[#0E121A] hover:bg-[#2E3B4E]">
                        <div class="w-12 h-12 rounded-full bg-[#D9D9D9]"></div>
                        <div class="flex flex-col items-start">
                            <p class="text-[#CCD6E5] text-base font-semibold">Nome da pessoa</p>
                            <p class="text-[#5A6270] text-sm">@username</p>
                        </div>
                    </RouterLink>
                    <RouterLink :to="'/users/' + username" class="flex gap-3 items-center p-4 px-8 bg-[#0E121A] hover:bg-[#2E3B4E]">
                        <div class="w-12 h-12 rounded-full bg-[#D9D9D9]"></div>
                        <div class="flex flex-col items-start">
                            <p class="text-[#CCD6E5] text-base font-semibold">Nome da pessoa</p>
                            <p class="text-[#5A6270] text-sm">@username</p>
                        </div>
                    </RouterLink>
                    <RouterLink :to="'/users/' + username" class="flex gap-3 items-center p-4 px-8 bg-[#0E121A] hover:bg-[#2E3B4E]">
                        <div class="w-12 h-12 rounded-full bg-[#D9D9D9]"></div>
                        <div class="flex flex-col items-start">
                            <p class="text-[#CCD6E5] text-base font-semibold">Nome da pessoa</p>
                            <p class="text-[#5A6270] text-sm">@username</p>
                        </div>
                    </RouterLink>
                    <RouterLink :to="'/users/' + username" class="flex gap-3 items-center p-4 px-8 bg-[#0E121A] hover:bg-[#2E3B4E]">
                        <div class="w-12 h-12 rounded-full bg-[#D9D9D9]"></div>
                        <div class="flex flex-col items-start">
                            <p class="text-[#CCD6E5] text-base font-semibold">Nome da pessoa</p>
                            <p class="text-[#5A6270] text-sm">@username</p>
                        </div>
                    </RouterLink>
                    <RouterLink :to="'/users/' + username" class="flex gap-3 items-center p-4 px-8 bg-[#0E121A] hover:bg-[#2E3B4E]">
                        <div class="w-12 h-12 rounded-full bg-[#D9D9D9]"></div>
                        <div class="flex flex-col items-start">
                            <p class="text-[#CCD6E5] text-base font-semibold">Nome da pessoa</p>
                            <p class="text-[#5A6270] text-sm">@username</p>
                        </div>
                    </RouterLink>
                    <RouterLink :to="'/users/' + username" class="flex gap-3 items-center p-4 px-8 bg-[#0E121A] hover:bg-[#2E3B4E]">
                        <div class="w-12 h-12 rounded-full bg-[#D9D9D9]"></div>
                        <div class="flex flex-col items-start">
                            <p class="text-[#CCD6E5] text-base font-semibold">Nome da pessoa</p>
                            <p class="text-[#5A6270] text-sm">@username</p>
                        </div>
                    </RouterLink>
                    <RouterLink :to="'/users/' + username" class="flex gap-3 items-center p-4 px-8 bg-[#0E121A] hover:bg-[#2E3B4E]">
                        <div class="w-12 h-12 rounded-full bg-[#D9D9D9]"></div>
                        <div class="flex flex-col items-start">
                            <p class="text-[#CCD6E5] text-base font-semibold">Nome da pessoa</p>
                            <p class="text-[#5A6270] text-sm">@username</p>
                        </div>
                    </RouterLink>
                    <RouterLink :to="'/users/' + username" class="flex gap-3 items-center p-4 px-8 bg-[#0E121A] hover:bg-[#2E3B4E]">
                        <div class="w-12 h-12 rounded-full bg-[#D9D9D9]"></div>
                        <div class="flex flex-col items-start">
                            <p class="text-[#CCD6E5] text-base font-semibold">Nome da pessoa</p>
                            <p class="text-[#5A6270] text-sm">@username</p>
                        </div>
                    </RouterLink>
                    <RouterLink :to="'/users/' + username" class="flex gap-3 items-center p-4 px-8 bg-[#0E121A] hover:bg-[#2E3B4E]">
                        <div class="w-12 h-12 rounded-full bg-[#D9D9D9]"></div>
                        <div class="flex flex-col items-start">
                            <p class="text-[#CCD6E5] text-base font-semibold">Nome da pessoa</p>
                            <p class="text-[#5A6270] text-sm">@username</p>
                        </div>
                    </RouterLink>
                    <RouterLink :to="'/users/' + username" class="flex gap-3 items-center p-4 px-8 bg-[#0E121A] hover:bg-[#2E3B4E]">
                        <div class="w-12 h-12 rounded-full bg-[#D9D9D9]"></div>
                        <div class="flex flex-col items-start">
                            <p class="text-[#CCD6E5] text-base font-semibold">Nome da pessoa</p>
                            <p class="text-[#5A6270] text-sm">@username</p>
                        </div>
                    </RouterLink>
                    <RouterLink :to="'/users/' + username" class="flex gap-3 items-center p-4 px-8 bg-[#0E121A] hover:bg-[#2E3B4E]">
                        <div class="w-12 h-12 rounded-full bg-[#D9D9D9]"></div>
                        <div class="flex flex-col items-start">
                            <p class="text-[#CCD6E5] text-base font-semibold">Nome da pessoa</p>
                            <p class="text-[#5A6270] text-sm">@username</p>
                        </div>
                    </RouterLink>
                    <RouterLink :to="'/users/' + username" class="flex gap-3 items-center p-4 px-8 bg-[#0E121A] hover:bg-[#2E3B4E]">
                        <div class="w-12 h-12 rounded-full bg-[#D9D9D9]"></div>
                        <div class="flex flex-col items-start">
                            <p class="text-[#CCD6E5] text-base font-semibold">Nome da pessoa</p>
                            <p class="text-[#5A6270] text-sm">@username</p>
                        </div>
                    </RouterLink>
                    <RouterLink :to="'/users/' + username" class="flex gap-3 items-center p-4 px-8 bg-[#0E121A] hover:bg-[#2E3B4E]">
                        <div class="w-12 h-12 rounded-full bg-[#D9D9D9]"></div>
                        <div class="flex flex-col items-start">
                            <p class="text-[#CCD6E5] text-base font-semibold">Nome da pessoa</p>
                            <p class="text-[#5A6270] text-sm">@username</p>
                        </div>
                    </RouterLink>
                    <RouterLink :to="'/users/' + username" class="flex gap-3 items-center p-4 px-8 bg-[#0E121A] hover:bg-[#2E3B4E]">
                        <div class="w-12 h-12 rounded-full bg-[#D9D9D9]"></div>
                        <div class="flex flex-col items-start">
                            <p class="text-[#CCD6E5] text-base font-semibold">Nome da pessoa</p>
                            <p class="text-[#5A6270] text-sm">@username</p>
                        </div>
                    </RouterLink>
                    <RouterLink :to="'/users/' + username" class="flex gap-3 items-center p-4 px-8 bg-[#0E121A] hover:bg-[#2E3B4E]">
                        <div class="w-12 h-12 rounded-full bg-[#D9D9D9]"></div>
                        <div class="flex flex-col items-start">
                            <p class="text-[#CCD6E5] text-base font-semibold">Nome da pessoa</p>
                            <p class="text-[#5A6270] text-sm">@username</p>
                        </div>
                    </RouterLink>
                    <RouterLink :to="'/users/' + username" class="flex gap-3 items-center p-4 px-8 bg-[#0E121A] hover:bg-[#2E3B4E]">
                        <div class="w-12 h-12 rounded-full bg-[#D9D9D9]"></div>
                        <div class="flex flex-col items-start">
                            <p class="text-[#CCD6E5] text-base font-semibold">Nome da pessoa</p>
                            <p class="text-[#5A6270] text-sm">@username</p>
                        </div>
                    </RouterLink>
                    <RouterLink :to="'/users/' + username" class="flex gap-3 items-center p-4 px-8 bg-[#0E121A] hover:bg-[#2E3B4E]">
                        <div class="w-12 h-12 rounded-full bg-[#D9D9D9]"></div>
                        <div class="flex flex-col items-start">
                            <p class="text-[#CCD6E5] text-base font-semibold">Nome da pessoa</p>
                            <p class="text-[#5A6270] text-sm">@username</p>
                        </div>
                    </RouterLink>
                    <RouterLink :to="'/users/' + username" class="flex gap-3 items-center p-4 px-8 bg-[#0E121A] hover:bg-[#2E3B4E]">
                        <div class="w-12 h-12 rounded-full bg-[#D9D9D9]"></div>
                        <div class="flex flex-col items-start">
                            <p class="text-[#CCD6E5] text-base font-semibold">Nome da pessoa</p>
                            <p class="text-[#5A6270] text-sm">@username</p>
                        </div>
                    </RouterLink>
                    <RouterLink :to="'/users/' + username" class="flex gap-3 items-center p-4 px-8 bg-[#0E121A] hover:bg-[#2E3B4E]">
                        <div class="w-12 h-12 rounded-full bg-[#D9D9D9]"></div>
                        <div class="flex flex-col items-start">
                            <p class="text-[#CCD6E5] text-base font-semibold">Nome da pessoa</p>
                            <p class="text-[#5A6270] text-sm">@username</p>
                        </div>
                    </RouterLink>
                </template>
            </div>


        </div>
    </Template>
</template>