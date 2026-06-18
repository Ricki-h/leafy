<script setup>
    import Template from './base/Template.vue';

</script>

<template>

    <Template>

        <div class="h-full flex flex-col">

            <div class="flex border-b-1 border-[#5A6270]">
                    <button class="px-2 py-6 bg-[#18202C] text-[#5A6270] hover:bg-[#2E3B4E] text-base w-full hover:cursor-pointer">
                        Lidas
                    </button>
                    <button class="px-2 py-6 bg-[#18202C] text-[#5A6270] hover:bg-[#2E3B4E] text-base w-full hover:cursor-pointer">
                        Não lidas
                    </button>
            </div>

            <div class="overflow-y-auto">

                <div class="flex items-start px-8 py-3 gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="26" viewBox="0 0 12 20" fill="none">
                        <path d="M4.01878 10L10.618 16.5992C10.9282 16.9095 11.0833 17.3043 11.0833 17.7837C11.0833 18.2632 10.9282 18.658 10.618 18.9682C10.3078 19.2784 9.91296 19.4335 9.43353 19.4335C8.9541 19.4335 8.55927 19.2784 8.24905 18.9682L0.465355 11.1845C0.296144 11.0153 0.176569 10.832 0.106628 10.6346C0.0366879 10.4372 0.0011541 10.2256 2.60328e-05 10C-0.00110204 9.77442 0.0344318 9.5629 0.106628 9.36549C0.178825 9.16808 0.2984 8.98477 0.465355 8.81555L8.24905 1.03186C8.55927 0.721638 8.9541 0.566528 9.43353 0.566528C9.91296 0.566528 10.3078 0.721638 10.618 1.03186C10.9282 1.34208 11.0833 1.7369 11.0833 2.21633C11.0833 2.69576 10.9282 3.09059 10.618 3.40081L4.01878 10Z" fill="#CCD6E5"/>
                    </svg>
                    <div class="flex flex-col">
                        <div class="w-9 h-9 rounded-full bg-[#D9D9D9]"></div>
                        <div class="flex gap-3">
                            <div class="flex items-center gap-1 py-2">
                                <p class="text-[#CCD6E5] text-sm font-bold">Nome da pessoa</p>
                                <p class="text-[#CCD6E5] text-sm">curtiu a sua postagem</p>
                                <p class="text-[#5A6270] text-sm">· Mês dia</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex items-start px-8 py-3 gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="26" viewBox="0 0 12 20" fill="none">
                        <path d="M4.01878 10L10.618 16.5992C10.9282 16.9095 11.0833 17.3043 11.0833 17.7837C11.0833 18.2632 10.9282 18.658 10.618 18.9682C10.3078 19.2784 9.91296 19.4335 9.43353 19.4335C8.9541 19.4335 8.55927 19.2784 8.24905 18.9682L0.465355 11.1845C0.296144 11.0153 0.176569 10.832 0.106628 10.6346C0.0366879 10.4372 0.0011541 10.2256 2.60328e-05 10C-0.00110204 9.77442 0.0344318 9.5629 0.106628 9.36549C0.178825 9.16808 0.2984 8.98477 0.465355 8.81555L8.24905 1.03186C8.55927 0.721638 8.9541 0.566528 9.43353 0.566528C9.91296 0.566528 10.3078 0.721638 10.618 1.03186C10.9282 1.34208 11.0833 1.7369 11.0833 2.21633C11.0833 2.69576 10.9282 3.09059 10.618 3.40081L4.01878 10Z" fill="#CCD6E5"/>
                    </svg>
                    <div class="flex flex-col">
                        <div class="w-9 h-9 rounded-full bg-[#D9D9D9]"></div>
                        <div class="flex gap-3">
                            <div class="flex items-center gap-1 py-2">
                                <p class="text-[#CCD6E5] text-sm font-bold">Nome da pessoa</p>
                                <p class="text-[#CCD6E5] text-sm">seguiu seu perfil!</p>
                                <p class="text-[#5A6270] text-sm">· Mês dia</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex items-start px-8 py-3 gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="26" viewBox="0 0 12 20" fill="none">
                        <path d="M4.01878 10L10.618 16.5992C10.9282 16.9095 11.0833 17.3043 11.0833 17.7837C11.0833 18.2632 10.9282 18.658 10.618 18.9682C10.3078 19.2784 9.91296 19.4335 9.43353 19.4335C8.9541 19.4335 8.55927 19.2784 8.24905 18.9682L0.465355 11.1845C0.296144 11.0153 0.176569 10.832 0.106628 10.6346C0.0366879 10.4372 0.0011541 10.2256 2.60328e-05 10C-0.00110204 9.77442 0.0344318 9.5629 0.106628 9.36549C0.178825 9.16808 0.2984 8.98477 0.465355 8.81555L8.24905 1.03186C8.55927 0.721638 8.9541 0.566528 9.43353 0.566528C9.91296 0.566528 10.3078 0.721638 10.618 1.03186C10.9282 1.34208 11.0833 1.7369 11.0833 2.21633C11.0833 2.69576 10.9282 3.09059 10.618 3.40081L4.01878 10Z" fill="#CCD6E5"/>
                    </svg>
                    <div class="flex flex-col">
                        <div class="w-9 h-9 rounded-full bg-[#D9D9D9]"></div>
                        <div class="flex gap-3">
                            <div class="flex items-center gap-1 py-2">
                                <p class="text-[#CCD6E5] text-sm font-bold">Nome da pessoa</p>
                                <p class="text-[#CCD6E5] text-sm">curtiu a sua resenha</p>
                                <p class="text-[#5A6270] text-sm">· Mês dia</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex items-start px-8 py-3 gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="26" viewBox="0 0 12 20" fill="none">
                        <path d="M4.01878 10L10.618 16.5992C10.9282 16.9095 11.0833 17.3043 11.0833 17.7837C11.0833 18.2632 10.9282 18.658 10.618 18.9682C10.3078 19.2784 9.91296 19.4335 9.43353 19.4335C8.9541 19.4335 8.55927 19.2784 8.24905 18.9682L0.465355 11.1845C0.296144 11.0153 0.176569 10.832 0.106628 10.6346C0.0366879 10.4372 0.0011541 10.2256 2.60328e-05 10C-0.00110204 9.77442 0.0344318 9.5629 0.106628 9.36549C0.178825 9.16808 0.2984 8.98477 0.465355 8.81555L8.24905 1.03186C8.55927 0.721638 8.9541 0.566528 9.43353 0.566528C9.91296 0.566528 10.3078 0.721638 10.618 1.03186C10.9282 1.34208 11.0833 1.7369 11.0833 2.21633C11.0833 2.69576 10.9282 3.09059 10.618 3.40081L4.01878 10Z" fill="#CCD6E5"/>
                    </svg>
                    <div class="flex flex-col">
                        <div class="w-9 h-9 rounded-full bg-[#D9D9D9]"></div>
                        <div class="flex gap-3">
                            <div class="flex items-center gap-1 py-2">
                                <p class="text-[#CCD6E5] text-sm font-bold">Nome da pessoa</p>
                                <p class="text-[#CCD6E5] text-sm">curtiu a sua postagem</p>
                                <p class="text-[#5A6270] text-sm">· Mês dia</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex items-start px-8 py-3 gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="26" viewBox="0 0 12 20" fill="none">
                        <path d="M4.01878 10L10.618 16.5992C10.9282 16.9095 11.0833 17.3043 11.0833 17.7837C11.0833 18.2632 10.9282 18.658 10.618 18.9682C10.3078 19.2784 9.91296 19.4335 9.43353 19.4335C8.9541 19.4335 8.55927 19.2784 8.24905 18.9682L0.465355 11.1845C0.296144 11.0153 0.176569 10.832 0.106628 10.6346C0.0366879 10.4372 0.0011541 10.2256 2.60328e-05 10C-0.00110204 9.77442 0.0344318 9.5629 0.106628 9.36549C0.178825 9.16808 0.2984 8.98477 0.465355 8.81555L8.24905 1.03186C8.55927 0.721638 8.9541 0.566528 9.43353 0.566528C9.91296 0.566528 10.3078 0.721638 10.618 1.03186C10.9282 1.34208 11.0833 1.7369 11.0833 2.21633C11.0833 2.69576 10.9282 3.09059 10.618 3.40081L4.01878 10Z" fill="#CCD6E5"/>
                    </svg>
                    <div class="flex flex-col">
                        <div class="w-9 h-9 rounded-full bg-[#D9D9D9]"></div>
                        <div class="flex gap-3">
                            <div class="flex items-center gap-1 py-2">
                                <p class="text-[#CCD6E5] text-sm font-bold">Nome da pessoa</p>
                                <p class="text-[#CCD6E5] text-sm">seguiu seu perfil!</p>
                                <p class="text-[#5A6270] text-sm">· Mês dia</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex items-start px-8 py-3 gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="26" viewBox="0 0 12 20" fill="none">
                        <path d="M4.01878 10L10.618 16.5992C10.9282 16.9095 11.0833 17.3043 11.0833 17.7837C11.0833 18.2632 10.9282 18.658 10.618 18.9682C10.3078 19.2784 9.91296 19.4335 9.43353 19.4335C8.9541 19.4335 8.55927 19.2784 8.24905 18.9682L0.465355 11.1845C0.296144 11.0153 0.176569 10.832 0.106628 10.6346C0.0366879 10.4372 0.0011541 10.2256 2.60328e-05 10C-0.00110204 9.77442 0.0344318 9.5629 0.106628 9.36549C0.178825 9.16808 0.2984 8.98477 0.465355 8.81555L8.24905 1.03186C8.55927 0.721638 8.9541 0.566528 9.43353 0.566528C9.91296 0.566528 10.3078 0.721638 10.618 1.03186C10.9282 1.34208 11.0833 1.7369 11.0833 2.21633C11.0833 2.69576 10.9282 3.09059 10.618 3.40081L4.01878 10Z" fill="#CCD6E5"/>
                    </svg>
                    <div class="flex flex-col">
                        <div class="w-9 h-9 rounded-full bg-[#D9D9D9]"></div>
                        <div class="flex gap-3">
                            <div class="flex items-center gap-1 py-2">
                                <p class="text-[#CCD6E5] text-sm font-bold">Nome da pessoa</p>
                                <p class="text-[#CCD6E5] text-sm">curtiu a sua resenha</p>
                                <p class="text-[#5A6270] text-sm">· Mês dia</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="flex items-start px-8 py-3 gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="26" viewBox="0 0 12 20" fill="none">
                        <path d="M4.01878 10L10.618 16.5992C10.9282 16.9095 11.0833 17.3043 11.0833 17.7837C11.0833 18.2632 10.9282 18.658 10.618 18.9682C10.3078 19.2784 9.91296 19.4335 9.43353 19.4335C8.9541 19.4335 8.55927 19.2784 8.24905 18.9682L0.465355 11.1845C0.296144 11.0153 0.176569 10.832 0.106628 10.6346C0.0366879 10.4372 0.0011541 10.2256 2.60328e-05 10C-0.00110204 9.77442 0.0344318 9.5629 0.106628 9.36549C0.178825 9.16808 0.2984 8.98477 0.465355 8.81555L8.24905 1.03186C8.55927 0.721638 8.9541 0.566528 9.43353 0.566528C9.91296 0.566528 10.3078 0.721638 10.618 1.03186C10.9282 1.34208 11.0833 1.7369 11.0833 2.21633C11.0833 2.69576 10.9282 3.09059 10.618 3.40081L4.01878 10Z" fill="#CCD6E5"/>
                    </svg>
                    <div class="flex flex-col">
                        <div class="w-9 h-9 rounded-full bg-[#D9D9D9]"></div>
                        <div class="flex gap-3">
                            <div class="flex items-center gap-1 py-2">
                                <p class="text-[#CCD6E5] text-sm font-bold">Nome da pessoa</p>
                                <p class="text-[#CCD6E5] text-sm">curtiu a sua postagem</p>
                                <p class="text-[#5A6270] text-sm">· Mês dia</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex items-start px-8 py-3 gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="26" viewBox="0 0 12 20" fill="none">
                        <path d="M4.01878 10L10.618 16.5992C10.9282 16.9095 11.0833 17.3043 11.0833 17.7837C11.0833 18.2632 10.9282 18.658 10.618 18.9682C10.3078 19.2784 9.91296 19.4335 9.43353 19.4335C8.9541 19.4335 8.55927 19.2784 8.24905 18.9682L0.465355 11.1845C0.296144 11.0153 0.176569 10.832 0.106628 10.6346C0.0366879 10.4372 0.0011541 10.2256 2.60328e-05 10C-0.00110204 9.77442 0.0344318 9.5629 0.106628 9.36549C0.178825 9.16808 0.2984 8.98477 0.465355 8.81555L8.24905 1.03186C8.55927 0.721638 8.9541 0.566528 9.43353 0.566528C9.91296 0.566528 10.3078 0.721638 10.618 1.03186C10.9282 1.34208 11.0833 1.7369 11.0833 2.21633C11.0833 2.69576 10.9282 3.09059 10.618 3.40081L4.01878 10Z" fill="#CCD6E5"/>
                    </svg>
                    <div class="flex flex-col">
                        <div class="w-9 h-9 rounded-full bg-[#D9D9D9]"></div>
                        <div class="flex gap-3">
                            <div class="flex items-center gap-1 py-2">
                                <p class="text-[#CCD6E5] text-sm font-bold">Nome da pessoa</p>
                                <p class="text-[#CCD6E5] text-sm">seguiu seu perfil!</p>
                                <p class="text-[#5A6270] text-sm">· Mês dia</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex items-start px-8 py-3 gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="26" viewBox="0 0 12 20" fill="none">
                        <path d="M4.01878 10L10.618 16.5992C10.9282 16.9095 11.0833 17.3043 11.0833 17.7837C11.0833 18.2632 10.9282 18.658 10.618 18.9682C10.3078 19.2784 9.91296 19.4335 9.43353 19.4335C8.9541 19.4335 8.55927 19.2784 8.24905 18.9682L0.465355 11.1845C0.296144 11.0153 0.176569 10.832 0.106628 10.6346C0.0366879 10.4372 0.0011541 10.2256 2.60328e-05 10C-0.00110204 9.77442 0.0344318 9.5629 0.106628 9.36549C0.178825 9.16808 0.2984 8.98477 0.465355 8.81555L8.24905 1.03186C8.55927 0.721638 8.9541 0.566528 9.43353 0.566528C9.91296 0.566528 10.3078 0.721638 10.618 1.03186C10.9282 1.34208 11.0833 1.7369 11.0833 2.21633C11.0833 2.69576 10.9282 3.09059 10.618 3.40081L4.01878 10Z" fill="#CCD6E5"/>
                    </svg>
                    <div class="flex flex-col">
                        <div class="w-9 h-9 rounded-full bg-[#D9D9D9]"></div>
                        <div class="flex gap-3">
                            <div class="flex items-center gap-1 py-2">
                                <p class="text-[#CCD6E5] text-sm font-bold">Nome da pessoa</p>
                                <p class="text-[#CCD6E5] text-sm">curtiu a sua resenha</p>
                                <p class="text-[#5A6270] text-sm">· Mês dia</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="flex items-start px-8 py-3 gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="26" viewBox="0 0 12 20" fill="none">
                        <path d="M4.01878 10L10.618 16.5992C10.9282 16.9095 11.0833 17.3043 11.0833 17.7837C11.0833 18.2632 10.9282 18.658 10.618 18.9682C10.3078 19.2784 9.91296 19.4335 9.43353 19.4335C8.9541 19.4335 8.55927 19.2784 8.24905 18.9682L0.465355 11.1845C0.296144 11.0153 0.176569 10.832 0.106628 10.6346C0.0366879 10.4372 0.0011541 10.2256 2.60328e-05 10C-0.00110204 9.77442 0.0344318 9.5629 0.106628 9.36549C0.178825 9.16808 0.2984 8.98477 0.465355 8.81555L8.24905 1.03186C8.55927 0.721638 8.9541 0.566528 9.43353 0.566528C9.91296 0.566528 10.3078 0.721638 10.618 1.03186C10.9282 1.34208 11.0833 1.7369 11.0833 2.21633C11.0833 2.69576 10.9282 3.09059 10.618 3.40081L4.01878 10Z" fill="#CCD6E5"/>
                    </svg>
                    <div class="flex flex-col">
                        <div class="w-9 h-9 rounded-full bg-[#D9D9D9]"></div>
                        <div class="flex gap-3">
                            <div class="flex items-center gap-1 py-2">
                                <p class="text-[#CCD6E5] text-sm font-bold">Nome da pessoa</p>
                                <p class="text-[#CCD6E5] text-sm">curtiu a sua postagem</p>
                                <p class="text-[#5A6270] text-sm">· Mês dia</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex items-start px-8 py-3 gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="26" viewBox="0 0 12 20" fill="none">
                        <path d="M4.01878 10L10.618 16.5992C10.9282 16.9095 11.0833 17.3043 11.0833 17.7837C11.0833 18.2632 10.9282 18.658 10.618 18.9682C10.3078 19.2784 9.91296 19.4335 9.43353 19.4335C8.9541 19.4335 8.55927 19.2784 8.24905 18.9682L0.465355 11.1845C0.296144 11.0153 0.176569 10.832 0.106628 10.6346C0.0366879 10.4372 0.0011541 10.2256 2.60328e-05 10C-0.00110204 9.77442 0.0344318 9.5629 0.106628 9.36549C0.178825 9.16808 0.2984 8.98477 0.465355 8.81555L8.24905 1.03186C8.55927 0.721638 8.9541 0.566528 9.43353 0.566528C9.91296 0.566528 10.3078 0.721638 10.618 1.03186C10.9282 1.34208 11.0833 1.7369 11.0833 2.21633C11.0833 2.69576 10.9282 3.09059 10.618 3.40081L4.01878 10Z" fill="#CCD6E5"/>
                    </svg>
                    <div class="flex flex-col">
                        <div class="w-9 h-9 rounded-full bg-[#D9D9D9]"></div>
                        <div class="flex gap-3">
                            <div class="flex items-center gap-1 py-2">
                                <p class="text-[#CCD6E5] text-sm font-bold">Nome da pessoa</p>
                                <p class="text-[#CCD6E5] text-sm">seguiu seu perfil!</p>
                                <p class="text-[#5A6270] text-sm">· Mês dia</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex items-start px-8 py-3 gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="26" viewBox="0 0 12 20" fill="none">
                        <path d="M4.01878 10L10.618 16.5992C10.9282 16.9095 11.0833 17.3043 11.0833 17.7837C11.0833 18.2632 10.9282 18.658 10.618 18.9682C10.3078 19.2784 9.91296 19.4335 9.43353 19.4335C8.9541 19.4335 8.55927 19.2784 8.24905 18.9682L0.465355 11.1845C0.296144 11.0153 0.176569 10.832 0.106628 10.6346C0.0366879 10.4372 0.0011541 10.2256 2.60328e-05 10C-0.00110204 9.77442 0.0344318 9.5629 0.106628 9.36549C0.178825 9.16808 0.2984 8.98477 0.465355 8.81555L8.24905 1.03186C8.55927 0.721638 8.9541 0.566528 9.43353 0.566528C9.91296 0.566528 10.3078 0.721638 10.618 1.03186C10.9282 1.34208 11.0833 1.7369 11.0833 2.21633C11.0833 2.69576 10.9282 3.09059 10.618 3.40081L4.01878 10Z" fill="#CCD6E5"/>
                    </svg>
                    <div class="flex flex-col">
                        <div class="w-9 h-9 rounded-full bg-[#D9D9D9]"></div>
                        <div class="flex gap-3">
                            <div class="flex items-center gap-1 py-2">
                                <p class="text-[#CCD6E5] text-sm font-bold">Nome da pessoa</p>
                                <p class="text-[#CCD6E5] text-sm">curtiu a sua resenha</p>
                                <p class="text-[#5A6270] text-sm">· Mês dia</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Template>
</template>