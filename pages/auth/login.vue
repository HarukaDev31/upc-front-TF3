<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
    <div class="max-w-md w-full space-y-8">
      <!-- Logo y título -->
      <div class="text-center">
        <div class="mx-auto h-16 w-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
          <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h2 class="text-3xl font-bold text-white mb-2">Iniciar Sesión</h2>
        <p class="text-gray-300">Accede a tu cuenta para continuar</p>
      </div>

      <!-- Formulario -->
      <form @submit.prevent="handleLogin" class="mt-8 space-y-6">
        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-300 mb-2">
            Correo Electrónico
          </label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            class="appearance-none relative block w-full px-3 py-3 border border-gray-600 placeholder-gray-400 text-white bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            placeholder="tu@email.com"
          />
        </div>

        <!-- Password -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-300 mb-2">
            Contraseña
          </label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            class="appearance-none relative block w-full px-3 py-3 border border-gray-600 placeholder-gray-400 text-white bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            placeholder="••••••••"
          />
        </div>

        <!-- Remember Me -->
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              v-model="form.rememberMe"
              type="checkbox"
              class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-600 rounded bg-gray-800"
            />
            <label for="remember-me" class="ml-2 block text-sm text-gray-300">
              Recordarme
            </label>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
          <p class="text-red-300 text-sm">{{ error }}</p>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="loading"
          class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
            <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
          {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
        </button>

        <!-- Register Link -->
        <div class="text-center">
          <p class="text-gray-300 text-sm">
            ¿No tienes cuenta?
            <NuxtLink to="/auth/register" class="font-medium text-purple-400 hover:text-purple-300 transition-colors duration-200">
              Regístrate aquí
            </NuxtLink>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'auth',
  middleware: 'guest'
})

const { login, loading, error } = useAuth()
const router = useRouter()
const route = useRoute()

const form = ref({
  email: '',
  password: '',
  rememberMe: false
})

// Obtener el parámetro redirect de la URL
const redirectTo = computed(() => {
  return route.query.redirect?.toString() || '/'
})

// Log para debugging
onMounted(() => {
  console.log('Login page mounted')
  console.log('Redirect to:', redirectTo.value)
  console.log('Current route:', route.fullPath)
})

const handleLogin = async () => {
  console.log('Attempting login...')
  const success = await login({
    email: form.value.email,
    password: form.value.password,
    rememberMe: form.value.rememberMe
  })

  if (success) {
    console.log('Login successful, redirecting to:', redirectTo.value)
    // Redirigir al usuario a la página principal o a la página que intentaba acceder
    await router.push(redirectTo.value)
  } else {
    console.log('Login failed')
  }
}
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style> 