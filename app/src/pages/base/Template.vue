<script setup>
    import AsideRight from '../../components/AsideRight.vue';
    import MenuLeft from '../../components/MenuLeft.vue';

    const props = defineProps({
        variant: {
            type: String,
            default: 'full'
        }
    })
</script>

<template>
    <div class="flex w-full justify-center h-screen">
        <div class="flex container-app">
            <template v-if="props.variant == 'full'">
                <MenuLeft></MenuLeft>
                <main class="text-[#CCD6E5] w-full"><slot></slot></main>
                <AsideRight></AsideRight>
            </template>
            <template v-else-if="props.variant == 'left'">
                <MenuLeft></MenuLeft>
                <main class="text-[#CCD6E5] w-full"><slot></slot></main>
            </template>
            <template v-else-if="props.variant == 'right'">
                <main class="text-[#CCD6E5] w-full"><slot></slot></main>
                <AsideRight></AsideRight>
            </template>
            <template v-else>
                <main class="text-[#CCD6E5] w-full"><slot></slot></main>
            </template>
        </div>
    </div>
</template>