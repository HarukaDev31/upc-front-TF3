<template>
  <div>
    <div class="text-center mb-8">
      <h1 class="text-2xl font-bold text-slate-900 mb-2">Iniciar Sesión</h1>
      <p class="text-slate-600">Accede a tu cuenta de CINEMAX</p>
    </div>

    <form @submit.prevent="handleLogin" class="space-y-6">
      <!-- Email -->
      <div>
        <label for="email" class="block text-sm font-medium text-slate-700 mb-2">
          Correo Electrónico
        </label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          autocomplete="email"
          required
          class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
          placeholder="tu@email.com"
        />
      </div>

      <!-- Password -->
      <div>
        <label for="password" class="block text-sm font-medium text-slate-700 mb-2">
          Contraseña
        </label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          autocomplete="current-password"
          required
          class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
          placeholder="••••••••"
        />
      </div>

      <!-- Error Message -->
      <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
        <div class="flex items-center space-x-3">
          <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span class="text-red-700 text-sm">{{ error }}</span>
        </div>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="loading"
        class="w-full bg-slate-900 text-white py-2 px-4 rounded-lg font-medium hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <div v-if="loading" class="flex items-center justify-center space-x-2">
          <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>Iniciando sesión...</span>
        </div>
        <span v-else>Iniciar Sesión</span>
      </button>

      <!-- Register Link -->
      <div class="text-center">
        <p class="text-sm text-slate-600">
          ¿No tienes una cuenta?
          <NuxtLink to="/auth/register" class="text-slate-900 font-medium hover:underline">
            Regístrate aquí
          </NuxtLink>
        </p>
      </div>
    </form>
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
  console.log('Attempting login with:', form.value)
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