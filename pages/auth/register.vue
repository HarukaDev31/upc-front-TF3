<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
    <div class="max-w-md w-full space-y-8">
      <!-- Logo y título -->
      <div class="text-center">
        <div class="mx-auto h-16 w-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
          <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <h2 class="text-3xl font-bold text-white mb-2">Crear Cuenta</h2>
        <p class="text-gray-300">Únete a nuestra comunidad de cine</p>
      </div>

      <!-- Formulario -->
      <form @submit.prevent="handleRegister" class="mt-8 space-y-6">
        <!-- Nombre -->
        <div>
          <label for="nombre" class="block text-sm font-medium text-gray-300 mb-2">
            Nombre
          </label>
          <input
            id="nombre"
            v-model="form.nombre"
            type="text"
            required
            class="appearance-none relative block w-full px-3 py-3 border border-gray-600 placeholder-gray-400 text-white bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            placeholder="Tu nombre"
          />
        </div>

        <!-- Apellido -->
        <div>
          <label for="apellido" class="block text-sm font-medium text-gray-300 mb-2">
            Apellido
          </label>
          <input
            id="apellido"
            v-model="form.apellido"
            type="text"
            required
            class="appearance-none relative block w-full px-3 py-3 border border-gray-600 placeholder-gray-400 text-white bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            placeholder="Tu apellido"
          />
        </div>

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

        <!-- Teléfono -->
        <div>
          <label for="telefono" class="block text-sm font-medium text-gray-300 mb-2">
            Teléfono
          </label>
          <input
            id="telefono"
            v-model="form.telefono"
            type="tel"
            required
            class="appearance-none relative block w-full px-3 py-3 border border-gray-600 placeholder-gray-400 text-white bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            placeholder="123456789"
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

        <!-- Confirm Password -->
        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-300 mb-2">
            Confirmar Contraseña
          </label>
          <input
            id="confirmPassword"
            v-model="form.confirmPassword"
            type="password"
            required
            class="appearance-none relative block w-full px-3 py-3 border border-gray-600 placeholder-gray-400 text-white bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            placeholder="••••••••"
          />
        </div>

        <!-- Error Message -->
        <div v-if="error" class="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
          <p class="text-red-300 text-sm">{{ error }}</p>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="loading || !isFormValid"
          class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
            <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
          {{ loading ? 'Creando cuenta...' : 'Crear Cuenta' }}
        </button>

        <!-- Login Link -->
        <div class="text-center">
          <p class="text-gray-300 text-sm">
            ¿Ya tienes cuenta?
            <NuxtLink to="/auth/login" class="font-medium text-purple-400 hover:text-purple-300 transition-colors duration-200">
              Inicia sesión aquí
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

const { register, loading, error } = useAuth()
const router = useRouter()
const route = useRoute()

const form = ref({
  nombre: '',
  apellido: '',
  email: '',
  telefono: '',
  password: '',
  confirmPassword: ''
})

// Obtener el parámetro redirect de la URL
const redirectTo = computed(() => {
  return route.query.redirect?.toString() || '/'
})

// Log para debugging
onMounted(() => {
  console.log('Register page mounted')
  console.log('Redirect to:', redirectTo.value)
})

// Validación del formulario
const isFormValid = computed(() => {
  return form.value.nombre && 
         form.value.apellido && 
         form.value.email && 
         form.value.telefono && 
         form.value.password && 
         form.value.confirmPassword &&
         form.value.password === form.value.confirmPassword
})

const handleRegister = async () => {
  // Validar que las contraseñas coincidan
  if (form.value.password !== form.value.confirmPassword) {
    error.value = 'Las contraseñas no coinciden'
    return
  }

  console.log('Attempting register...')
  const success = await register({
    email: form.value.email,
    nombre: form.value.nombre,
    apellido: form.value.apellido,
    telefono: form.value.telefono,
    password: form.value.password
  })

  if (success) {
    console.log('Register successful, redirecting to:', redirectTo.value)
    // Redirigir al usuario a la página principal o a la página que intentaba acceder
    await router.push(redirectTo.value)
  } else {
    console.log('Register failed')
  }
}
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style> 