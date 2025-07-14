<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Header con información de la función -->
    <div class="bg-white border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-slate-900">{{ pelicula?.titulo || 'Selección de Asientos' }}</h1>
            <p class="text-slate-600 mt-1">{{ funcion?.fecha }} - {{ funcion?.hora }}</p>
            <p class="text-slate-500 text-sm">Sala {{ funcion?.sala_id }}</p>
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
              <span class="text-sm text-slate-600">
                {{ 
                  connectionStatus === 'connected' ? 'Conectado' :
                  connectionStatus === 'connecting' ? 'Conectando...' : 'Desconectado'
                }}
              </span>
            </div>
            
            <!-- Usuario actual -->
            <div v-if="currentUser" class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center">
                <span class="text-white text-sm font-medium">
                  {{ currentUser.nombre.charAt(0) }}{{ currentUser.apellido.charAt(0) }}
                </span>
              </div>
              <span class="text-slate-700 text-sm">{{ currentUser.nombre }} {{ currentUser.apellido }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Panel de selección de asientos -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg border border-slate-200 p-6">
            <h2 class="text-2xl font-bold text-slate-900 mb-6">Selecciona tus asientos</h2>
            
            <!-- Grid de asientos -->
            <div class="space-y-4">
              <!-- Pantalla -->
              <div class="text-center mb-8">
                <div class="w-full h-2 bg-slate-300 rounded-full mx-auto max-w-md"></div>
                <p class="text-slate-500 text-sm mt-2">PANTALLA</p>
              </div>

              <!-- Asientos -->
              <div class="grid grid-cols-10 gap-2 max-w-4xl mx-auto">
                <template v-for="fila in filas" :key="fila">
                  <div class="text-center text-slate-500 text-sm font-medium py-2">{{ fila }}</div>
                  <template v-for="columna in columnas" :key="`${fila}${columna}`">
                    <button
                      @click="toggleSeat(`${fila}${columna}`)"
                      :disabled="!isSeatAvailable(`${fila}${columna}`) && !isSeatSelectedByMe(`${fila}${columna}`)"
                      :class="[
                        'w-12 h-12 rounded-lg border-2 transition-all duration-200 font-medium text-sm flex items-center justify-center',
                        getSeatClasses(`${fila}${columna}`)
                      ]"
                    >
                      <svg v-if="getSeatStatus(`${fila}${columna}`) === 'selected'" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      <svg v-else-if="getSeatStatus(`${fila}${columna}`) === 'confirmed'" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      <svg v-else-if="getSeatStatus(`${fila}${columna}`) === 'occupied'" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/>
                      </svg>
                      <svg v-else-if="getSeatStatus(`${fila}${columna}`) === 'taken'" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                        <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
                      </svg>
                      <span v-else>{{ columna }}</span>
                    </button>
                  </template>
                </template>
              </div>

              <!-- Leyenda -->
              <div class="flex flex-wrap justify-center gap-4 mt-8">
                <div class="flex items-center space-x-2">
                  <div class="w-6 h-6 bg-slate-200 rounded border-2 border-slate-300 flex items-center justify-center">
                    <span class="text-slate-600 text-xs">1</span>
                  </div>
                  <span class="text-slate-600 text-sm">Disponible</span>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="w-6 h-6 bg-slate-900 rounded border-2 border-slate-700 flex items-center justify-center">
                    <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <span class="text-slate-600 text-sm">Seleccionado</span>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="w-6 h-6 bg-orange-500 rounded border-2 border-orange-600 flex items-center justify-center">
                    <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                      <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <span class="text-slate-600 text-sm">Temporal</span>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="w-6 h-6 bg-red-500 rounded border-2 border-red-600 flex items-center justify-center">
                    <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/>
                    </svg>
                  </div>
                  <span class="text-slate-600 text-sm">Ocupado</span>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="w-6 h-6 bg-green-500 rounded border-2 border-green-600 flex items-center justify-center">
                    <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <span class="text-slate-600 text-sm">Confirmado</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Panel lateral -->
        <div class="space-y-6">
          <!-- Resumen de selección -->
          <div class="bg-white rounded-lg border border-slate-200 p-6">
            <h3 class="text-xl font-bold text-slate-900 mb-4">Mis Asientos Seleccionados</h3>
            
            <div v-if="selectedSeatsArray.length === 0" class="text-center py-8">
              <svg class="w-12 h-12 mx-auto mb-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <p class="text-slate-500">No has seleccionado asientos aún</p>
            </div>
            
            <div v-else class="space-y-3">
              <div 
                v-for="asiento in selectedSeatsArray" 
                :key="asiento"
                class="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
              >
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-slate-900 rounded flex items-center justify-center">
                    <span class="text-white text-sm font-medium">{{ asiento }}</span>
                  </div>
                  <div>
                    <p class="text-slate-900 font-medium">Asiento {{ asiento }}</p>
                    <p class="text-slate-500 text-sm">Temporal</p>
                  </div>
                </div>
                <button
                  @click="deselectSeat(asiento)"
                  class="text-red-500 hover:text-red-600 transition-colors"
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
              class="w-full mt-6 bg-slate-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-slate-800 transition-colors"
            >
              Continuar con la compra
            </button>
          </div>

          <!-- Información de la función -->
          <div class="bg-white rounded-lg border border-slate-200 p-6">
            <h3 class="text-xl font-bold text-slate-900 mb-4">Información</h3>
            
            <div class="space-y-4">
              <div>
                <p class="text-slate-500 text-sm">Película</p>
                <p class="text-slate-900 font-medium">{{ pelicula?.titulo }}</p>
              </div>
              
              <div>
                <p class="text-slate-500 text-sm">Fecha y Hora</p>
                <p class="text-slate-900 font-medium">{{ funcion?.fecha }} - {{ funcion?.hora }}</p>
              </div>
              
              <div>
                <p class="text-slate-500 text-sm">Sala</p>
                <p class="text-slate-900 font-medium">{{ funcion?.sala_id }}</p>
              </div>
              
              <div>
                <p class="text-slate-500 text-sm">Precio por asiento</p>
                <p class="text-slate-900 font-medium">${{ funcion?.precio || '15.000' }}</p>
              </div>
            </div>
          </div>

          <!-- Usuarios activos -->
          <div class="bg-white rounded-lg border border-slate-200 p-6">
            <h3 class="text-xl font-bold text-slate-900 mb-4">Usuarios Activos</h3>
            
            <div class="space-y-2">
              <div class="flex items-center space-x-2">
                <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                <span class="text-slate-600 text-sm">{{ currentUser?.nombre }} {{ currentUser?.apellido }} (Tú)</span>
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
  isSeatConfirmed,
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
  console.log('¿Está confirmado?', isSeatConfirmed(asientoId))
  
  // No permitir interactuar con asientos confirmados
  if (isSeatConfirmed(asientoId)) {
    console.log('Asiento confirmado, no se puede interactuar:', asientoId)
    return
  }
  
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
      return 'bg-slate-900 border-slate-700 text-white hover:bg-slate-800 cursor-pointer'
    case 'confirmed':
      return 'bg-green-500 border-green-600 text-white cursor-not-allowed opacity-75'
    case 'occupied':
      return 'bg-red-500 border-red-600 text-white cursor-not-allowed opacity-50'
    case 'taken':
      return 'bg-orange-500 border-orange-600 text-white cursor-not-allowed opacity-60'
    default:
      return 'bg-slate-200 border-slate-300 text-slate-700 hover:bg-slate-300 hover:border-slate-400 cursor-pointer'
  }
}

// Función para continuar con la compra
const continuarCompra = () => {
  console.log('=== CONTINUAR COMPRA ===')
  console.log('Asientos seleccionados:', selectedSeatsArray.value)
  console.log('Cantidad de asientos:', selectedSeatsArray.value.length)
  
  if (selectedSeatsArray.value.length > 0) {
    // Guardar datos completos en localStorage para la página de compra
    if (process.client) {
      const datosCompra = {
        asientos: selectedSeatsArray.value,
        funcion: funcion.value,
        pelicula: pelicula.value,
        precioPorAsiento: funcion.value.precio
      }
      
      console.log('Datos a guardar en localStorage:', datosCompra)
      localStorage.setItem(`datos_compra_${funcionId}`, JSON.stringify(datosCompra))
      
      // Verificar que se guardó correctamente
      const datosGuardados = localStorage.getItem(`datos_compra_${funcionId}`)
      console.log('Datos guardados en localStorage:', datosGuardados)
    }
    
    // Redirigir a la página de compra
    console.log('Redirigiendo a compra con función:', funcionId)
    router.push(`/comprar?funcion=${funcionId}`)
  } else {
    console.log('No hay asientos seleccionados para continuar')
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