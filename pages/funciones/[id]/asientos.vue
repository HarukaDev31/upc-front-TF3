<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
    <!-- Header con información de la función -->
    <div class="bg-black/20 backdrop-blur-sm border-b border-white/10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-white">{{ pelicula?.titulo || 'Selección de Asientos' }}</h1>
            <p class="text-gray-300 mt-1">{{ funcion?.fecha }} - {{ funcion?.hora }}</p>
            <p class="text-gray-400 text-sm">Sala {{ funcion?.sala_id }}</p>
          </div>
          
          <!-- Estado de conexión WebSocket -->
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2">
              <div 
                :class="[
                  'w-3 h-3 rounded-full',
                  connectionStatus === 'connected' ? 'bg-green-500' : 
                  connectionStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
                ]"
              ></div>
              <span class="text-sm text-gray-300">
                {{ 
                  connectionStatus === 'connected' ? 'Conectado' :
                  connectionStatus === 'connecting' ? 'Conectando...' : 'Desconectado'
                }}
              </span>
            </div>
            
            <!-- Usuario actual -->
            <div v-if="currentUser" class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span class="text-white text-sm font-medium">
                  {{ currentUser.nombre.charAt(0) }}{{ currentUser.apellido.charAt(0) }}
                </span>
              </div>
              <span class="text-gray-300 text-sm">{{ currentUser.nombre }} {{ currentUser.apellido }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Panel de selección de asientos -->
        <div class="lg:col-span-2">
          <div class="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <h2 class="text-2xl font-bold text-white mb-6">Selecciona tus asientos</h2>
            
            <!-- Grid de asientos -->
            <div class="space-y-4">
              <!-- Pantalla -->
              <div class="text-center mb-8">
                <div class="w-full h-2 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full mx-auto max-w-md"></div>
                <p class="text-gray-400 text-sm mt-2">PANTALLA</p>
              </div>

                             <!-- Asientos -->
               <div class="grid grid-cols-10 gap-2 max-w-4xl mx-auto">
                 <template v-for="fila in filas" :key="fila">
                   <div class="text-center text-gray-400 text-sm font-medium py-2">{{ fila }}</div>
                   <template v-for="columna in columnas" :key="`${fila}${columna}`">
                     <button
                       @click="toggleSeat(`${fila}${columna}`)"
                       :disabled="!isSeatAvailable(`${fila}${columna}`) && !isSeatSelectedByMe(`${fila}${columna}`)"
                       :class="[
                         'w-12 h-12 rounded-lg border-2 transition-all duration-200 font-medium text-sm',
                         getSeatClasses(`${fila}${columna}`)
                       ]"
                     >
                       {{ columna }}
                     </button>
                   </template>
                 </template>
               </div>

              <!-- Leyenda -->
              <div class="flex flex-wrap justify-center gap-4 mt-8">
                <div class="flex items-center space-x-2">
                  <div class="w-6 h-6 bg-gray-600 rounded border-2 border-gray-500"></div>
                  <span class="text-gray-300 text-sm">Disponible</span>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="w-6 h-6 bg-purple-600 rounded border-2 border-purple-500"></div>
                  <span class="text-gray-300 text-sm">Seleccionado</span>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="w-6 h-6 bg-red-600 rounded border-2 border-red-500"></div>
                  <span class="text-gray-300 text-sm">Ocupado</span>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="w-6 h-6 bg-green-600 rounded border-2 border-green-500"></div>
                  <span class="text-gray-300 text-sm">Confirmado</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Panel lateral -->
        <div class="space-y-6">
          <!-- Resumen de selección -->
          <div class="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <h3 class="text-xl font-bold text-white mb-4">Mis Asientos Seleccionados</h3>
            
            <div v-if="selectedSeatsArray.length === 0" class="text-gray-400 text-center py-8">
              <svg class="w-12 h-12 mx-auto mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <p>No has seleccionado asientos aún</p>
            </div>
            
            <div v-else class="space-y-3">
              <div 
                v-for="asiento in selectedSeatsArray" 
                :key="asiento"
                class="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
              >
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-purple-600 rounded flex items-center justify-center">
                    <span class="text-white text-sm font-medium">{{ asiento }}</span>
                  </div>
                  <div>
                    <p class="text-white font-medium">Asiento {{ asiento }}</p>
                    <p class="text-gray-400 text-sm">Temporal</p>
                  </div>
                </div>
                <button
                  @click="deselectSeat(asiento)"
                  class="text-red-400 hover:text-red-300 transition-colors"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Botón de continuar -->
            <button
              v-if="selectedSeatsArray.length > 0"
              @click="continuarCompra"
              class="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200"
            >
              Continuar con la compra
            </button>
          </div>

          <!-- Información de la función -->
          <div class="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <h3 class="text-xl font-bold text-white mb-4">Información</h3>
            
            <div class="space-y-4">
              <div>
                <p class="text-gray-400 text-sm">Película</p>
                <p class="text-white font-medium">{{ pelicula?.titulo }}</p>
              </div>
              
              <div>
                <p class="text-gray-400 text-sm">Fecha y Hora</p>
                <p class="text-white font-medium">{{ funcion?.fecha }} - {{ funcion?.hora }}</p>
              </div>
              
              <div>
                <p class="text-gray-400 text-sm">Sala</p>
                <p class="text-white font-medium">{{ funcion?.sala_id }}</p>
              </div>
              
              <div>
                <p class="text-gray-400 text-sm">Precio por asiento</p>
                <p class="text-white font-medium">${{ funcion?.precio || '15.000' }}</p>
              </div>
            </div>
          </div>

          <!-- Usuarios activos -->
          <div class="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <h3 class="text-xl font-bold text-white mb-4">Usuarios Activos</h3>
            
            <div class="space-y-2">
              <div class="flex items-center space-x-2">
                <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                <span class="text-gray-300 text-sm">{{ currentUser?.nombre }} {{ currentUser?.apellido }} (Tú)</span>
              </div>
              <!-- Aquí se mostrarían otros usuarios activos -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const router = useRouter()
const funcionId = route.params.id

// Composable de autenticación
const { currentUser, isLoggedIn, loading: authLoading, checkAuth } = useAuth()

// Composable de WebSocket
const {
  isConnected,
  connectionStatus,
  selectedSeats,
  selectSeat,
  deselectSeat,
  getSeatStatus,
  isSeatAvailable,
  isSeatSelectedByMe,
  onConnectionStatusChanged,
  connect
} = useWebSocket(funcionId)

// Datos de la función (simulados por ahora)
const funcion = ref({
  id: funcionId,
  fecha: '2024-12-25',
  hora: '20:00',
  sala_id: 'Sala 1',
  precio: '15.000'
})

const pelicula = ref({
  titulo: 'Avengers: Endgame',
  duracion: '181 min',
  genero: 'Acción, Aventura'
})

// Configuración del grid de asientos
const filas = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
const columnas = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']

// Computed para obtener array de asientos seleccionados
const selectedSeatsArray = computed(() => {
  return Array.from(selectedSeats.value)
})

// Función para alternar selección de asiento
const toggleSeat = async (asientoId) => {
  console.log('=== TOGGLE SEAT ===')
  console.log('Asiento ID:', asientoId)
  console.log('¿Está seleccionado por mí?', isSeatSelectedByMe(asientoId))
  console.log('¿Está disponible?', isSeatAvailable(asientoId))
  
  if (isSeatSelectedByMe(asientoId)) {
    console.log('Deseleccionando asiento:', asientoId)
    await deselectSeat(asientoId)
  } else if (isSeatAvailable(asientoId)) {
    console.log('Seleccionando asiento:', asientoId)
    await selectSeat(asientoId)
  } else {
    console.log('Asiento no disponible:', asientoId)
  }
}

// Función para obtener clases CSS del asiento
const getSeatClasses = (asientoId) => {
  const status = getSeatStatus(asientoId)
  
  switch (status) {
    case 'selected':
      return 'bg-purple-600 border-purple-500 text-white hover:bg-purple-700'
    case 'confirmed':
      return 'bg-green-600 border-green-500 text-white'
    case 'occupied':
    case 'taken':
      return 'bg-red-600 border-red-500 text-white cursor-not-allowed opacity-50'
    default:
      return 'bg-gray-600 border-gray-500 text-white hover:bg-gray-700 hover:border-gray-400'
  }
}

// Función para continuar con la compra
const continuarCompra = () => {
  if (selectedSeatsArray.value.length > 0) {
    // Guardar selecciones en localStorage para la página de compra
    if (process.client) {
      localStorage.setItem(`selecciones_${funcionId}`, JSON.stringify(selectedSeatsArray.value))
    }
    
    // Redirigir a la página de compra
    router.push(`/comprar?funcion=${funcionId}`)
  }
}

// Verificar autenticación
onMounted(async () => {
  console.log('Página de asientos montada')
  console.log('Estado de autenticación inicial:', isLoggedIn.value)
  console.log('Usuario actual:', currentUser.value)
  
  // Verificar autenticación manualmente
  const isAuthenticated = await checkAuth()
  console.log('Resultado de checkAuth:', isAuthenticated)
  
  if (!isAuthenticated) {
    console.log('Usuario no autenticado, redirigiendo a login')
    router.push(`/auth/login?redirect=${route.fullPath}`)
  } else {
    console.log('Usuario autenticado correctamente')
    // Conectar al WebSocket después de verificar autenticación
    await connect()
  }
})

// Escuchar cambios en el estado de conexión
onConnectionStatusChanged.value = (status) => {
  console.log('Estado de conexión WebSocket:', status)
}
</script> 