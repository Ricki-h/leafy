<script setup>
import { RouterLink, useRouter } from 'vue-router'
import api from '../services/api'
import { onMounted, ref, computed } from 'vue'
import Botao from './Button.vue'

const router = useRouter()

const content = ref('')

const counterColor = computed(() => {
    if (content.value.length >= 280) return 'text-[#FF82BD]'
    if (content.value.length > 200) return 'text-[#974EFD]'
    return 'text-[#5A6270]'
})

const postando = ref(false)

const me = ref(null)
async function loadMe() {
    try {
        const user = JSON.parse(localStorage.getItem('user'))
        if (!user?.username) return

        const { data } = await api.get(`/users/${user.username}`)
        me.value = { ...user, ...data }
    }
    catch (err) {
        console.error(err)
    }
}

const loadingPost = ref(false)
async function postar() {
    try {
        loadingPost.value = true
        await api.post('/posts/', {
            content: content.value
        })

        content.value = ''
        postando.value = false
    }
    catch (err) {
        console.error(err)
    }
    loadingPost.value = false
}

// ---------- menu do perfil + logout ----------
const menuAberto = ref(false)
const saindo = ref(false)

async function logout() {
    try {
        saindo.value = true
        await api.post('/auth/logout')
    } catch (err) {
        console.error(err)
    } finally {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        saindo.value = false
        menuAberto.value = false
        router.push('/login')
    }
}

// ---------- links de navegação ----------
const navItems = computed(() => {
    const items = [
        { label: 'Home', to: '/', icon: 'home' },
        { label: 'Explorar', to: '/explorer', icon: 'search' },
        { label: 'Livros', to: '/books', icon: 'books' },
        { label: 'Listas', to: `/users/${me.value.username}/lists`, icon: 'lists' },
        { label: 'Profile', to: `/users/${me.value.username}`, icon: 'profile' },
    ]

    if (me.value?.role === 'admin') {
        items.push({ label: 'Logs', to: '/logs', icon: 'logs' })
    }

    return items
})

const displayName = computed(() => {
    const name = me.value?.name || ''
    return name.length > 10 ? `${name.slice(0, 10)}...` : name
})

onMounted(async () => {
    await loadMe()
    console.log(me.value.role)
})
</script>

<template>
    <aside v-if="me" class="min-h-screen w-full max-w-70 flex flex-col justify-between px-6 py-4 border-r border-r-[#5A6270]">
        <div class="flex flex-col gap-6">
            <RouterLink to="/" class="p-4 text-[#CCD6E5] font-bold rounded-full bg-[#0E121A] hover:bg-[#2E3B4E] flex items-center w-fit gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="23" viewBox="0 0 40 23" fill="none">
                    <path d="M29.9893 16.75C27.7223 20.461 23.127 23 17.8271 23C10.2798 22.9998 4.16121 17.8511 4.16113 11.5C4.16113 5.1489 10.2797 0.000171828 17.8271 1.21683e-06C23.1258 1.44844e-06 27.7208 2.53738 29.9883 6.24707C27.9457 3.55158 24.3796 1.76468 20.3193 1.76465C13.9759 1.76465 8.83301 6.12312 8.83301 11.5C8.83305 16.8769 13.9759 21.2354 20.3193 21.2354C24.3807 21.2353 27.947 19.4468 29.9893 16.75Z" fill="#2BA69C"/>
                    <path d="M30.0896 7.25276C29.724 7.25276 29.4277 7.0041 29.4277 6.69737C29.4277 6.39064 29.724 6.14198 30.0896 6.14198C30.4551 6.14198 30.7515 6.39064 30.7515 6.69737C30.7515 7.0041 30.4551 7.25276 30.0896 7.25276Z" fill="#2BA69C"/>
                    <path d="M25.6899 2.09088C27.1894 2.99392 28.311 3.74532 30.44 6.22611L29.4277 6.69737C29.1162 5.42324 27.9092 4.08376 25.3784 2.74429L25.6899 2.09088Z" fill="#2BA69C"/>
                    <path d="M30.0896 15.7469C29.724 15.7469 29.4277 15.9955 29.4277 16.3023C29.4277 16.609 29.724 16.8577 30.0896 16.8577C30.4551 16.8577 30.7515 16.609 30.7515 16.3023C30.7515 15.9955 30.4551 15.7469 30.0896 15.7469Z" fill="#2BA69C"/>
                    <path d="M25.6899 20.9088C27.1894 20.0057 28.311 19.2543 30.44 16.7735L29.4277 16.3023C29.1162 17.5764 27.9092 18.9159 25.3784 20.2554L25.6899 20.9088Z" fill="#2BA69C"/>
                    <path d="M32.7355 10.3872C33.3391 10.3759 33.8345 10.862 33.8345 11.4656C33.8345 12.07 33.338 12.5564 32.7339 12.544L3.38364 11.9448L2.07495 12.0643L0.813542 12.1952C0.378606 12.2403 0.000206932 11.8991 0.000206951 11.4618C0.00020697 11.0279 0.373086 10.6879 0.805165 10.7277L2.07495 10.8448L3.38364 10.9404L32.7355 10.3872Z" fill="#2BA69C"/>
                    <path d="M26.9497 14.7873C25.5333 17.0906 22.6779 18.6662 19.3833 18.6662C14.68 18.666 10.8669 15.4579 10.8667 11.5002C10.8667 7.54229 14.6799 4.33336 19.3833 4.33319C22.6762 4.33319 25.5316 5.90678 26.9487 8.20819C25.6736 6.53839 23.4573 5.4328 20.936 5.4328C16.9831 5.43301 13.7788 8.14951 13.7788 11.5002C13.7791 14.8507 16.9832 17.5664 20.936 17.5666C23.4589 17.5666 25.675 16.4588 26.9497 14.7873Z" fill="#FF82BD"/>
                    <path d="M27.025 8.85312C26.7972 8.85312 26.6125 8.69816 26.6125 8.507C26.6125 8.31585 26.7972 8.16089 27.025 8.16089C27.2528 8.16089 27.4375 8.31585 27.4375 8.507C27.4375 8.69816 27.2528 8.85312 27.025 8.85312Z" fill="#FF82BD"/>
                    <path d="M24.2832 5.63629C25.2177 6.19906 25.9166 6.66732 27.2434 8.21332L26.6125 8.507C26.4184 7.71298 25.6662 6.87823 24.0891 6.04349L24.2832 5.63629Z" fill="#FF82BD"/>
                    <path d="M27.025 14.1466C26.7972 14.1466 26.6125 14.3015 26.6125 14.4927C26.6125 14.6838 26.7972 14.8388 27.025 14.8388C27.2528 14.8388 27.4375 14.6838 27.4375 14.4927C27.4375 14.3015 27.2528 14.1466 27.025 14.1466Z" fill="#FF82BD"/>
                    <path d="M24.2832 17.3634C25.2177 16.8006 25.9166 16.3324 27.2434 14.7864L26.6125 14.4927C26.4184 15.2867 25.6662 16.1215 24.0891 16.9562L24.2832 17.3634Z" fill="#FF82BD"/>
                    <ellipse cx="37.6879" cy="11.4666" rx="1.99998" ry="2.31214" transform="rotate(90 37.6879 11.4666)" fill="#FF82BD"/>
                    <path d="M20.7318 8.49191C20.5068 8.69336 20.2364 8.85467 19.9391 8.91628C19.642 8.97801 19.3453 8.93676 19.1014 8.79406C18.8576 8.65137 18.6804 8.41536 18.596 8.13044C18.5115 7.8454 18.5297 7.53654 18.6055 7.24774C18.6055 7.24774 18.6055 7.24774 18.6055 7.24774C18.7068 6.90314 18.865 6.58193 19.0736 6.29506C19.0775 6.28964 19.0814 6.28427 19.0854 6.27887C20.4421 4.40447 22.6583 3.09261 24.9001 2.69892C25.4013 2.6057 25.9015 2.55249 26.397 2.53007C28.3218 2.43933 30.1185 2.96486 31.7402 3.64701C31.7973 3.67085 31.8538 3.69477 31.9098 3.7187C32.7387 4.07886 33.463 4.55328 34.2065 4.99441C34.6182 5.24104 35.0813 5.4089 35.5043 5.64217C35.5602 5.67315 35.6139 5.70326 35.668 5.73409C35.9463 5.89328 36.2147 6.05744 36.4898 6.22904C36.6007 6.29846 36.6749 6.40832 36.693 6.53838C36.7112 6.66821 36.672 6.80759 36.5868 6.92194C36.5016 7.03629 36.3783 7.11511 36.2468 7.13713C36.1152 7.15938 35.9863 7.12302 35.8856 7.03998C35.8856 7.03998 35.8856 7.03998 35.8856 7.03998C35.6535 6.84963 35.4033 6.65941 35.1581 6.46874C35.1102 6.43152 35.0629 6.39456 35.0138 6.35619C34.6439 6.06612 34.3043 5.72553 33.8999 5.48328C33.174 5.05133 32.3949 4.68586 31.6196 4.43538C31.5626 4.41724 31.5053 4.39901 31.4475 4.38072C29.814 3.85429 28.1132 3.49847 26.4968 3.80055C26.0812 3.87652 25.678 4.00185 25.2942 4.16811C23.5512 4.92544 22.3861 6.40217 21.3268 7.85617C21.3237 7.86042 21.3207 7.86464 21.3176 7.8689C21.1538 8.0943 20.9599 8.29969 20.7318 8.49191Z" fill="#2BA69C"/>
                    <path d="M20.7318 14.4374C20.5068 14.2359 20.2364 14.0746 19.9391 14.013C19.642 13.9513 19.3453 13.9925 19.1014 14.1352C18.8576 14.2779 18.6804 14.5139 18.596 14.7988C18.5115 15.0839 18.5297 15.3927 18.6055 15.6815C18.6055 15.6815 18.6055 15.6815 18.6055 15.6815C18.7068 16.0261 18.865 16.3473 19.0736 16.6342C19.0775 16.6396 19.0814 16.645 19.0854 16.6504C20.4421 18.5248 22.6583 19.8367 24.9001 20.2303C25.4013 20.3236 25.9015 20.3768 26.397 20.3992C28.3218 20.4899 30.1185 19.9644 31.7402 19.2823C31.7973 19.2584 31.8538 19.2345 31.9098 19.2106C32.7387 18.8504 33.463 18.376 34.2065 17.9349C34.6182 17.6882 35.0813 17.5204 35.5043 17.2871C35.5602 17.2561 35.6139 17.226 35.668 17.1952C35.9463 17.036 36.2147 16.8718 36.4898 16.7002C36.6007 16.6308 36.6749 16.5209 36.693 16.3909C36.7112 16.2611 36.672 16.1217 36.5868 16.0073C36.5016 15.893 36.3783 15.8142 36.2468 15.7921C36.1152 15.7699 35.9863 15.8062 35.8856 15.8893C35.8856 15.8893 35.8856 15.8893 35.8856 15.8893C35.6535 16.0796 35.4033 16.2698 35.1581 16.4605C35.1102 16.4977 35.0629 16.5347 35.0138 16.5731C34.6439 16.8631 34.3043 17.2037 33.8999 17.446C33.174 17.8779 32.3949 18.2434 31.6196 18.4939C31.5626 18.512 31.5053 18.5303 31.4475 18.5485C29.814 19.075 28.1132 19.4308 26.4968 19.1287C26.0812 19.0527 25.678 18.9274 25.2942 18.7612C23.5512 18.0038 22.3861 16.5271 21.3268 15.0731C21.3237 15.0688 21.3207 15.0646 21.3176 15.0604C21.1538 14.835 20.9599 14.6296 20.7318 14.4374Z" fill="#2BA69C"/>
                </svg>
            </RouterLink>

            <div class="flex flex-col gap-6">
                <RouterLink
                    v-for="item in navItems"
                    :key="item.label"
                    :to="item.to"
                    class="p-4 text-[#CCD6E5] font-bold rounded-full bg-[#0E121A] hover:bg-[#2E3B4E] flex items-center w-fit gap-3"
                >
                    <span class="w-7 h-5 flex items-center justify-center shrink-0">
                        <svg v-if="item.icon === 'home'" class="h-5 w-auto shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13 12" fill="none">
                            <path d="M11.8902 5.63805L6.37366 0.125547C6.33394 0.0857489 6.28676 0.0541748 6.23482 0.0326318C6.18289 0.0110888 6.12721 0 6.07098 0C6.01475 0 5.95908 0.0110888 5.90714 0.0326318C5.8552 0.0541748 5.80802 0.0857489 5.7683 0.125547L0.251786 5.63805C0.0910714 5.79876 0 6.01707 0 6.24474C0 6.71751 0.384375 7.10189 0.857143 7.10189H1.43839V11.0354C1.43839 11.2724 1.62991 11.4639 1.86696 11.4639H5.21384V8.46394H6.71384V11.4639H10.275C10.5121 11.4639 10.7036 11.2724 10.7036 11.0354V7.10189H11.2848C11.5125 7.10189 11.7308 7.01215 11.8915 6.8501C12.225 6.51528 12.225 5.97287 11.8902 5.63805Z" fill="#CCD6E5"/>
                        </svg>

                        <svg v-else-if="item.icon === 'search'" class="h-5 w-auto shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13 13" fill="none">
                            <path d="M11.8571 11.8571L9.29371 9.28914M10.7143 5.85714C10.7143 7.14534 10.2026 8.38077 9.29166 9.29166C8.38077 10.2026 7.14534 10.7143 5.85714 10.7143C4.56895 10.7143 3.33352 10.2026 2.42262 9.29166C1.51173 8.38077 1 7.14534 1 5.85714C1 4.56895 1.51173 3.33352 2.42262 2.42262C3.33352 1.51173 4.56895 1 5.85714 1C7.14534 1 8.38077 1.51173 9.29166 2.42262C10.2026 3.33352 10.7143 4.56895 10.7143 5.85714Z" stroke-width="2" stroke-linecap="round" stroke="#CCD6E5"/>
                        </svg>

                        <svg v-else-if="item.icon === 'books'" class="h-5 w-auto shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 9" fill="none">
                            <path d="M5.44964 0.818801C4.69586 0.362855 3.84771 0.0888706 2.9715 0.0182658C2.09529 -0.0523389 1.21475 0.082349 0.398728 0.411801C0.280876 0.459103 0.179843 0.541031 0.108743 0.646952C0.037642 0.752874 -0.000244053 0.877898 1.18307e-06 1.0058V7.4188C1.18307e-06 7.8478 0.430365 8.1415 0.825819 7.982C1.49409 7.71257 2.21509 7.60257 2.9325 7.66057C3.64991 7.71858 4.3443 7.94304 4.96146 8.3164L5.58055 8.6904C5.628 8.71955 5.67873 8.73165 5.72727 8.7311C5.77915 8.73212 5.83024 8.71819 5.87455 8.69095L6.49309 8.3164C7.11024 7.94304 7.80464 7.71858 8.52205 7.66057C9.23946 7.60257 9.96045 7.71257 10.6287 7.982C10.7201 8.01885 10.819 8.03256 10.9169 8.02193C11.0147 8.0113 11.1085 7.97666 11.19 7.92103C11.2714 7.86541 11.3382 7.79049 11.3843 7.70284C11.4304 7.61519 11.4545 7.51748 11.4545 7.41825V1.0058C11.4545 0.744001 11.2964 0.509151 11.0558 0.411801C10.2398 0.0826017 9.35931 -0.0518547 8.4832 0.0189403C7.60709 0.0897354 6.75908 0.363864 6.00546 0.819901L5.72727 0.988201L5.44964 0.818801ZM6.13691 2.1333C6.13691 2.0239 6.09381 1.91898 6.01709 1.84162C5.94037 1.76426 5.83632 1.7208 5.72782 1.7208C5.61932 1.7208 5.51527 1.76426 5.43855 1.84162C5.36183 1.91898 5.31873 2.0239 5.31873 2.1333V7.3583C5.31873 7.4677 5.36183 7.57262 5.43855 7.64998C5.51527 7.72734 5.61932 7.7708 5.72782 7.7708C5.83632 7.7708 5.94037 7.72734 6.01709 7.64998C6.09381 7.57262 6.13691 7.4677 6.13691 7.3583V2.1333Z" fill-rule="evenodd" clip-rule="evenodd" fill="#CCD6E5"/>
                        </svg>

                        <svg v-else-if="item.icon === 'lists'" class="h-5 w-auto shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 12" fill="none">
                            <path d="M8.33333 0C8.77536 0 9.19928 0.176898 9.51184 0.491779C9.8244 0.80666 10 1.23373 10 1.67904V11.5795C10.0001 11.6626 9.97579 11.7439 9.93002 11.8131C9.88424 11.8823 9.81911 11.9362 9.74289 11.968C9.66666 11.9998 9.58276 12.0082 9.50184 11.9919C9.42092 11.9756 9.34661 11.9355 9.28833 11.8767L5.295 7.85286C5.2563 7.81377 5.21032 7.78276 5.15969 7.7616C5.10907 7.74044 5.05481 7.72954 5 7.72954C4.94519 7.72954 4.89093 7.74044 4.84031 7.7616C4.78968 7.78276 4.7437 7.81377 4.705 7.85286L0.711667 11.8767C0.653393 11.9355 0.579083 11.9756 0.498159 11.9919C0.417236 12.0082 0.333342 11.9998 0.257115 11.968C0.180887 11.9362 0.115758 11.8823 0.0699839 11.8131C0.0242101 11.7439 -0.00014697 11.6626 6.67208e-07 11.5795V1.67904C6.67208e-07 1.23373 0.175595 0.80666 0.488156 0.491779C0.800716 0.176898 1.22464 0 1.66667 0H8.33333Z" fill="#CCD6E5"/>
                        </svg>

                        <svg v-else-if="item.icon === 'profile'" class="h-5 w-auto shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 14" fill="none">
                            <path d="M8 9C9.06087 9 10.0783 9.42143 10.8284 10.1716C11.5786 10.9217 12 11.9391 12 13V14H0V13C0 11.9391 0.421427 10.9217 1.17157 10.1716C1.92172 9.42143 2.93913 9 4 9H8ZM7 0C7.79565 0 8.55871 0.31607 9.12132 0.87868C9.68393 1.44129 10 2.20435 10 3V5C10 5.79565 9.68393 6.55871 9.12132 7.12132C8.55871 7.68393 7.79565 8 7 8H5C4.20435 8 3.44129 7.68393 2.87868 7.12132C2.31607 6.55871 2 5.79565 2 5V3C2 2.20435 2.31607 1.44129 2.87868 0.87868C3.44129 0.31607 4.20435 0 5 0H7Z" fill="#CCD6E5"/>
                        </svg>

                        <svg v-else-if="item.icon === 'logs'" class="h-5 w-auto shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" fill="none">
                            <path d="M2 0C0.89543 0 0 0.89543 0 2V12C0 13.1046 0.89543 14 2 14H12C13.1046 14 14 13.1046 14 12V2C14 0.89543 13.1046 0 12 0H2ZM3.5 3.5H10.5V5H3.5V3.5ZM3.5 6.25H10.5V7.75H3.5V6.25ZM3.5 9H8V10.5H3.5V9Z" fill="#CCD6E5"/>
                        </svg>
                    </span>
                    <span>{{ item.label }}</span>
                </RouterLink>
            </div>

            <button @click="postando = true" class="rounded-full bg-[#CCD6E5] hover:bg-[#2BA69C] px-4 py-3 text-center flex items-center hover:cursor-pointer w-full text-xl text-[#0E121A] font-bold justify-center">
                POSTAR
            </button>
        </div>

        <!-- perfil + menu -->
        <div class="relative w-full">
            <div v-if="menuAberto" class="fixed inset-0 z-10" @click="menuAberto = false"></div>

            <div
                v-if="menuAberto"
                class="absolute bottom-full left-0 mb-2 w-full z-20 flex flex-col gap-4 p-4 rounded-2xl bg-[#0E121A] border border-[#5A6270] shadow-lg"
            >
                <Botao to="/settings" color="green" variant="outline" size="lg" class="w-full" @click="menuAberto = false">
                    Configurações
                </Botao>
                <Botao color="pink" variant="outline" size="lg" class="w-full" :disabled="saindo" @click="logout">
                    {{ saindo ? 'Saindo...' : 'Sair da conta' }}
                </Botao>
            </div>

            <button
                @click="menuAberto = !menuAberto"
                class="rounded-full bg-[#0E121A] hover:bg-[#2E3B4E] p-4 flex items-center gap-4 hover:cursor-pointer w-full justify-between"
            >
                <div class="flex gap-3 items-center min-w-0">
                    <div class="w-12 h-12 rounded-full overflow-hidden shrink-0">
                        <img :src="me.avatarUrl" alt="" class="rounded-full">
                    </div>
                    <div class="flex flex-col items-start min-w-0">
                        <p :title="me.name" class="text-[#CCD6E5] text-base font-semibold whitespace-nowrap">
                            {{ displayName }}
                        </p>
                        <p class="text-[#5A6270] text-sm truncate w-full">{{ '@' + me.username }}</p>
                    </div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="4" viewBox="0 0 18 4" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M3.75 2C3.75 2.22981 3.70474 2.45738 3.61679 2.6697C3.52884 2.88202 3.39994 3.07493 3.23744 3.23744C3.07493 3.39994 2.88202 3.52884 2.6697 3.61679C2.45738 3.70473 2.22981 3.75 2 3.75C1.77019 3.75 1.54262 3.70473 1.3303 3.61679C1.11798 3.52884 0.925066 3.39994 0.762563 3.23744C0.600061 3.07493 0.471157 2.88202 0.383211 2.6697C0.295265 2.45738 0.25 2.22981 0.25 2C0.25 1.53587 0.434375 1.09075 0.762563 0.762563C1.09075 0.434374 1.53587 0.25 2 0.25C2.46413 0.25 2.90925 0.434374 3.23744 0.762563C3.56563 1.09075 3.75 1.53587 3.75 2ZM9 0.25C9.46413 0.25 9.90925 0.434374 10.2374 0.762563C10.5656 1.09075 10.75 1.53587 10.75 2C10.75 2.46413 10.5656 2.90925 10.2374 3.23744C9.90925 3.56563 9.46413 3.75 9 3.75C8.53587 3.75 8.09075 3.56563 7.76256 3.23744C7.43437 2.90925 7.25 2.46413 7.25 2C7.25 1.53587 7.43437 1.09075 7.76256 0.762563C8.09075 0.434374 8.53587 0.25 9 0.25ZM16 0.25C16.4641 0.25 16.9092 0.434374 17.2374 0.762563C17.5656 1.09075 17.75 1.53587 17.75 2C17.75 2.46413 17.5656 2.90925 17.2374 3.23744C16.9092 3.56563 16.4641 3.75 16 3.75C15.5359 3.75 15.0908 3.56563 14.7626 3.23744C14.4344 2.90925 14.25 2.46413 14.25 2C14.25 1.53587 14.4344 1.09075 14.7626 0.762563C15.0908 0.434374 15.5359 0.25 16 0.25Z" fill="#CCD6E5"/>
                </svg>
            </button>
        </div>
    </aside>

    <div v-if="postando == true" class="absolute flex w-full h-full bg-[#110B2A]/40 top-0 right-0 z-2 justify-center">
        <div class="flex flex-col gap-3 items-start bg-[#18202C] p-8 rounded-lg w-150 mt-8 h-fit">
            <button @click="postando = false" class="p-2 rounded-full hover:bg-[#202b3a] hover:cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M1 15L8 8M8 8L15 1M8 8L1 1M8 8L15 15" stroke="#FF82BD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
            <div class="flex gap-4 w-full">
                <div class="min-w-12 h-12 overflow-hidden rounded-full">
                    <img :src="me.avatarUrl" alt="" class="rounded-full w-12">
                </div>
                <textarea
                    name="content"
                    v-model="content"
                    placeholder="O que você está lendo hoje?"
                    rows="3"
                    maxlength="280"
                    class="resize-none field-sizing-content border-none focus:outline-none focus:ring-0 text-[#CCD6E5] text-lg placeholder-[#5A6270] w-full bg-transparent min-h-10"
                ></textarea>
            </div>

            <div class="flex items-center justify-between w-full mt-4">
                <button @click="postar" class="rounded-full bg-[#CCD6E5] hover:bg-[#2BA69C] px-3 py-2 text-center flex items-center hover:cursor-pointer w-30 text-[#0E121A] font-bold justify-center" :disabled="loadingPost">
                    {{ loadingPost ? 'Postando' : 'Postar' }}
                </button>

                <span class="text-sm" :class="counterColor">{{ content.length }}
                    <span class="text-[#5A6270]"> / 280</span></span>
            </div>
        </div>
    </div>
</template>