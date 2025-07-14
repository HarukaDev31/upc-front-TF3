<template>
  <header class="bg-white border-b border-slate-200 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex items-center justify-between">
        <!-- Logo y navegación -->
        <div class="flex items-center space-x-8">
          <NuxtLink to="/" class="flex items-center space-x-3 group">
            <div class="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center group-hover:bg-slate-800 transition-colors">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M6 20h12M4 12h16"></path>
              </svg>
            </div>
            <span class="text-2xl font-bold text-slate-900">CINEMAX</span>
          </NuxtLink>
          
          <nav class="hidden md:flex space-x-8">
            <NuxtLink 
              to="/peliculas" 
              class="text-slate-700 hover:text-slate-900 transition-colors font-medium relative group"
            >
              <span class="flex items-center space-x-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M6 20h12M4 12h16"></path>
                </svg>
                <span>Películas</span>
              </span>
              <div class="absolute -bottom-1 left-0 w-0 h-0.5 bg-slate-900 transition-all duration-200 group-hover:w-full"></div>
            </NuxtLink>
            <NuxtLink 
              to="/metricas" 
              class="text-slate-700 hover:text-slate-900 transition-colors font-medium relative group"
            >
              <span class="flex items-center space-x-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
                <span>Métricas</span>
              </span>
              <div class="absolute -bottom-1 left-0 w-0 h-0.5 bg-slate-900 transition-all duration-200 group-hover:w-full"></div>
            </NuxtLink>
          </nav>
        </div>

        <!-- Usuario y acciones -->
        <div class="flex items-center space-x-4">
          <!-- Debug info -->
          <div class="text-xs text-slate-500 hidden">
            Debug: isLoggedIn={{ isLoggedIn }}, currentUser={{ currentUser?.nombre }}
          </div>
          
          <!-- Estado de autenticación -->
          <div v-if="isLoggedIn" class="flex items-center space-x-4">
            <div class="text-right hidden sm:block">
              <p class="text-sm font-semibold text-slate-900">{{ getUserFullName() }}</p>
              <p class="text-xs text-slate-500">{{ currentUser?.email }}</p>
            </div>
            
            <!-- Menú de usuario -->
            <div class="relative">
              <button
                @click="showUserMenu = !showUserMenu"
                class="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors border border-slate-200"
              >
                <div class="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
                  <span class="text-sm font-bold text-white">
                    {{ currentUser?.nombre?.charAt(0).toUpperCase() }}
                  </span>
                </div>
                <svg class="w-4 h-4 text-slate-500 transition-transform duration-200" :class="{ 'rotate-180': showUserMenu }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              
              <!-- Dropdown menu -->
              <div 
                v-if="showUserMenu"
                class="absolute right-0 mt-3 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-3 z-50"
              >
                <div class="px-4 py-3 border-b border-slate-200">
                  <p class="text-sm font-semibold text-slate-900">{{ getUserFullName() }}</p>
                  <p class="text-xs text-slate-500">{{ currentUser?.email }}</p>
                </div>
                <div class="py-2">
                  <NuxtLink 
                    to="/profile" 
                    class="flex items-center space-x-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    <span>Mi Perfil</span>
                  </NuxtLink>
                  <NuxtLink 
                    to="/transacciones" 
                    class="flex items-center space-x-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <span>Mis Transacciones</span>
                  </NuxtLink>
                </div>
                <div class="border-t border-slate-200 my-2"></div>
                <button
                  @click="handleLogout"
                  class="flex items-center space-x-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                  </svg>
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </div>
          </div>
          
          <!-- Botones de auth si no está autenticado -->
          <div v-else class="flex items-center space-x-4">
            <NuxtLink 
              to="/auth/login"
              class="text-slate-700 hover:text-slate-900 transition-colors font-medium"
            >
              Iniciar Sesión
            </NuxtLink>
            <NuxtLink 
              to="/auth/register"
              class="bg-slate-900 text-white px-6 py-3 rounded-lg hover:bg-slate-800 transition-colors font-medium"
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
const { isLoggedIn, currentUser, logout, getUserFullName, checkAuth } = useAuth()

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

// Verificar autenticación al montar el componente
onMounted(async () => {
  console.log('AppHeader: Componente montado')
  await checkAuth()
  console.log('AppHeader: Estado de autenticación después de checkAuth:', {
    isLoggedIn: isLoggedIn.value,
    currentUser: currentUser.value?.nombre
  })
})

// Watch para cambios en el estado de autenticación
watch(isLoggedIn, (newValue, oldValue) => {
  console.log('AppHeader: Cambio en isLoggedIn:', { oldValue, newValue })
})

watch(currentUser, (newValue, oldValue) => {
  console.log('AppHeader: Cambio en currentUser:', { 
    oldValue: oldValue?.nombre, 
    newValue: newValue?.nombre 
  })
})
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style> 