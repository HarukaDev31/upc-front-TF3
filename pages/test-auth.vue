<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-white mb-8">Prueba de Autenticación</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Estado de Autenticación -->
        <div class="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-6">
          <h2 class="text-xl font-bold text-white mb-4">Estado de Autenticación</h2>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-gray-300">¿Está autenticado?</span>
              <span :class="isLoggedIn ? 'text-green-400' : 'text-red-400'">
                {{ isLoggedIn ? 'Sí' : 'No' }}
              </span>
            </div>
            
            <div class="flex items-center justify-between">
              <span class="text-gray-300">Estado de carga</span>
              <span :class="authLoading ? 'text-yellow-400' : 'text-green-400'">
                {{ authLoading ? 'Cargando...' : 'Completado' }}
              </span>
            </div>
            
            <div class="flex items-center justify-between">
              <span class="text-gray-300">Token presente</span>
              <span :class="hasToken ? 'text-green-400' : 'text-red-400'">
                {{ hasToken ? 'Sí' : 'No' }}
              </span>
            </div>
            
            <div class="flex items-center justify-between">
              <span class="text-gray-300">Datos de usuario</span>
              <span :class="hasUserData ? 'text-green-400' : 'text-red-400'">
                {{ hasUserData ? 'Sí' : 'No' }}
              </span>
            </div>
          </div>
        </div>
        
        <!-- Información del Usuario -->
        <div class="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-6">
          <h2 class="text-xl font-bold text-white mb-4">Información del Usuario</h2>
          
          <div v-if="currentUser" class="space-y-3">
            <div>
              <span class="text-gray-300">Nombre:</span>
              <span class="text-white ml-2">{{ currentUser.nombre }} {{ currentUser.apellido }}</span>
            </div>
            <div>
              <span class="text-gray-300">Email:</span>
              <span class="text-white ml-2">{{ currentUser.email }}</span>
            </div>
            <div>
              <span class="text-gray-300">ID:</span>
              <span class="text-white ml-2">{{ currentUser.id }}</span>
            </div>
            <div>
              <span class="text-gray-300">Teléfono:</span>
              <span class="text-white ml-2">{{ currentUser.telefono }}</span>
            </div>
          </div>
          
          <div v-else class="text-gray-400">
            No hay usuario autenticado
          </div>
        </div>
        
        <!-- Acciones -->
        <div class="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-6">
          <h2 class="text-xl font-bold text-white mb-4">Acciones</h2>
          
          <div class="space-y-3">
            <button
              @click="testCheckAuth"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Probar checkAuth()
            </button>
            
            <button
              @click="logout"
              class="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Cerrar Sesión
            </button>
            
            <NuxtLink
              to="/auth/login"
              class="block w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-center"
            >
              Ir a Login
            </NuxtLink>
          </div>
        </div>
        
        <!-- Logs -->
        <div class="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-6">
          <h2 class="text-xl font-bold text-white mb-4">Logs de Debug</h2>
          
          <div class="bg-gray-900 rounded-lg p-4 h-64 overflow-y-auto">
            <pre class="text-green-400 text-sm">{{ debugLogs }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { currentUser, isLoggedIn, loading: authLoading, checkAuth, logout } = useAuth()

const debugLogs = ref('')
const hasToken = ref(false)
const hasUserData = ref(false)

// Función para agregar logs
const addLog = (message) => {
  const timestamp = new Date().toLocaleTimeString()
  debugLogs.value += `[${timestamp}] ${message}\n`
}

// Verificar estado inicial
onMounted(() => {
  addLog('Página de prueba montada')
  
  // Verificar localStorage
  if (process.client) {
    const token = localStorage.getItem('auth_token')
    const userData = localStorage.getItem('user_data')
    
    hasToken.value = !!token
    hasUserData.value = !!userData
    
    addLog(`Token en localStorage: ${hasToken.value ? 'Presente' : 'No presente'}`)
    addLog(`UserData en localStorage: ${hasUserData.value ? 'Presente' : 'No presente'}`)
  }
})

// Función para probar checkAuth
const testCheckAuth = async () => {
  addLog('Probando checkAuth()...')
  try {
    const result = await checkAuth()
    addLog(`Resultado de checkAuth: ${result ? 'Éxito' : 'Falló'}`)
  } catch (error) {
    addLog(`Error en checkAuth: ${error}`)
  }
}

// Función para logout
const handleLogout = () => {
  addLog('Cerrando sesión...')
  logout()
  addLog('Sesión cerrada')
}
</script> 