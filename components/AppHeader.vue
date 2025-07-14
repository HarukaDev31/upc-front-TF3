<template>
  <header class="bg-white shadow-sm border-b">
    <div class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <!-- Logo y navegación -->
        <div class="flex items-center space-x-8">
          <NuxtLink to="/" class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
              <UIcon name="heroicons:film" class="w-5 h-5 text-white" />
            </div>
            <span class="text-xl font-bold text-gray-900">Cinemax</span>
          </NuxtLink>
          
          <nav class="hidden md:flex space-x-6">
            <NuxtLink 
              to="/peliculas" 
              class="text-gray-600 hover:text-purple-600 transition-colors"
            >
              Películas
            </NuxtLink>
            <NuxtLink 
              to="/metricas" 
              class="text-gray-600 hover:text-purple-600 transition-colors"
            >
              Métricas
            </NuxtLink>
          </nav>
        </div>

        <!-- Usuario y acciones -->
        <div class="flex items-center space-x-4">
          <!-- Estado de autenticación -->
          <div v-if="isLoggedIn" class="flex items-center space-x-3">
            <div class="text-right">
              <p class="text-sm font-medium text-gray-900">{{ getUserFullName() }}</p>
              <p class="text-xs text-gray-500">{{ currentUser?.email }}</p>
            </div>
            
            <!-- Menú de usuario -->
            <div class="relative">
              <button
                @click="showUserMenu = !showUserMenu"
                class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div class="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <span class="text-sm font-medium text-white">
                    {{ currentUser?.nombre?.charAt(0).toUpperCase() }}
                  </span>
                </div>
                <UIcon name="heroicons:chevron-down" class="w-4 h-4 text-gray-500" />
              </button>
              
              <!-- Dropdown menu -->
              <div 
                v-if="showUserMenu"
                class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
              >
                <div class="px-4 py-2 border-b border-gray-200">
                  <p class="text-sm font-medium text-gray-900">{{ getUserFullName() }}</p>
                  <p class="text-xs text-gray-500">{{ currentUser?.email }}</p>
                </div>
                <NuxtLink 
                  to="/profile" 
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Mi Perfil
                </NuxtLink>
                <NuxtLink 
                  to="/transacciones" 
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Mis Transacciones
                </NuxtLink>
                <div class="border-t border-gray-200 my-1"></div>
                <button
                  @click="handleLogout"
                  class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
          
          <!-- Botones de auth si no está autenticado -->
          <div v-else class="flex items-center space-x-3">
            <NuxtLink 
              to="/auth/login"
              class="text-gray-600 hover:text-purple-600 transition-colors"
            >
              Iniciar Sesión
            </NuxtLink>
            <NuxtLink 
              to="/auth/register"
              class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Registrarse
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
// Auth composable
const { isLoggedIn, currentUser, logout, getUserFullName } = useAuth()

// Estado del menú
const showUserMenu = ref(false)

// Manejar logout
const handleLogout = async () => {
  logout()
  showUserMenu.value = false
  await navigateTo('/auth/login')
}

// Cerrar menú al hacer click fuera
onMounted(() => {
  document.addEventListener('click', (event) => {
    const target = event.target as Element
    if (!target.closest('.relative')) {
      showUserMenu.value = false
    }
  })
})
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style> 