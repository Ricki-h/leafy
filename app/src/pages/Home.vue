<script setup>
    import Template from './base/Template.vue';

</script>

<template>
    <Template>
        <div class="flex border-b-1 border-[#5A6270]">
            <button class="px-2 py-6 bg-[#18202C] text-[#5A6270] hover:bg-[#2E3B4E] text-base w-full hover:cursor-pointer">
                For you
            </button>
            <button class="px-2 py-6 bg-[#18202C] text-[#5A6270] hover:bg-[#2E3B4E] text-base w-full hover:cursor-pointer">
                Seguindo
            </button>
        </div>
        <div>
            <div class="px-8 flex gap-3">
                <div class="w-12 h-12 rounded-full bg-[#D9D9D9]"></div>
                <div>
                    <div>
                        <div class="flex items-center gap-1">
                            <p class="text-[#CCD6E5] text-sm font-semibold">Nome da pessoa</p>
                            <p class="text-[#5A6270] text-sm">@username</p>
                        </div>
                        <p class="">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce non volutpat odio. Maecenas feugiat est eget dolor volutpat, non luctus orci mattis.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </Template>
</template>