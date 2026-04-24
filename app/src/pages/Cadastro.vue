<script setup>

</script>

<template>
    <main class="mx-auto container">
        <div class="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
    
            <div class="text-center mb-6">
                <h2 class="text-3xl font-bold text-gray-700">Bem-vindo</h2>
                <p class="text-gray-500 text-sm mt-1">Faça sua conta</p>
            </div>

            <form action="#">
            
                <div class="mb-4">
                    <label for="email" class="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
                    <input 
                    type="email"
                    id="email" 
                    name="email" 
                    placeholder="seu@email.com" 
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                    >
                </div>

                <div class="mb-6">
                    <div class="flex items-center justify-between mb-2">
                    <label class="block text-sm font-medium text-gray-700">Senha</label>
                    
                    </div>
                    <input 
                    type="password" 
                    id="password" 
                    name="password" 
                    placeholder="******" 
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                    >
                </div>

                <button 
                    type="submit" 
                    class="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 "
                >
                    Entrar
                </button>

            </form>

            <p class="mt-6 text-center text-sm text-gray-600">
                Já tem uma conta? 
                <a href="#" class="text-blue-600 font-semibold hover:underline">Entrar</a>
            </p>

        </div>
    </main>
    
</template>