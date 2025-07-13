<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <UButton 
              to="/peliculas" 
              variant="ghost" 
              color="gray"
              icon="heroicons:arrow-left"
            >
              Volver
            </UButton>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Seleccionar Asientos</h1>
              <p class="text-gray-600">{{ pelicula?.titulo }}</p>
            </div>
          </div>
          
          <div class="text-right">
            <div class="text-sm text-gray-600">Función</div>
            <div class="font-semibold">{{ formatDateTime(funcion?.fecha_hora_inicio) }}</div>
          </div>
        </div>
      </div>
    </header>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center items-center min-h-96">
      <UIcon name="heroicons:arrow-path" class="w-8 h-8 animate-spin text-purple-500" />
    </div>

    <!-- Error -->
    <div v-else-if="error" class="container mx-auto px-4 py-12 text-center">
      <UIcon name="heroicons:exclamation-triangle" class="w-12 h-12 text-red-500 mx-auto mb-4" />
      <p class="text-red-600 text-xl mb-4">{{ error }}</p>
      <UButton @click="cargarAsientos" color="purple">
        Reintentar
      </UButton>
    </div>

    <!-- Contenido principal -->
    <div v-else class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Mapa de asientos -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-xl shadow-lg p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-bold text-gray-900">Sala {{ funcion?.sala?.nombre }}</h2>
              <div class="flex items-center space-x-4">
                <div class="text-sm text-gray-600">
                  {{ estadisticas?.disponibles }} de {{ estadisticas?.total }} asientos disponibles
                </div>
                <!-- Indicador de WebSocket (deshabilitado temporalmente) -->
                <!-- <div class="flex items-center space-x-2">
                  <div 
                    :class="{
                      'bg-green-500': ws.isConnected.value,
                      'bg-yellow-500': ws.isConnecting.value,
                      'bg-red-500': !ws.isConnected.value && !ws.isConnecting.value
                    }"
                    class="w-2 h-2 rounded-full"
                  ></div>
                  <span class="text-xs text-gray-500">
                    {{ ws.isConnected.value ? 'Conectado' : ws.isConnecting.value ? 'Conectando...' : 'Desconectado' }}
                  </span>
                </div> -->
              </div>
            </div>

            <!-- Pantalla -->
            <div class="mb-8 text-center">
              <div class="bg-gray-200 rounded-lg py-4 px-8 mx-auto max-w-md">
                <UIcon name="heroicons:tv" class="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <p class="text-gray-600 font-medium">PANTALLA</p>
              </div>
            </div>

            <!-- Mapa de asientos -->
            <div class="space-y-4">
              <div 
                v-for="(fila, letraFila) in mapaAsientos" 
                :key="letraFila"
                class="flex items-center space-x-2"
              >
                <!-- Letra de fila -->
                <div class="w-8 h-8 flex items-center justify-center text-sm font-semibold text-gray-600">
                  {{ letraFila }}
                </div>
                
                <!-- Asientos de la fila -->
                <div class="flex space-x-1">
                  <button
                    v-for="asiento in fila"
                    :key="asiento.codigo"
                    @click="seleccionarAsiento(asiento)"
                    :disabled="!asiento.disponible"
                    :class="{
                      'bg-green-500 hover:bg-green-600 text-white': asiento.seleccionado,
                      'bg-gray-300 text-gray-500 cursor-not-allowed': !asiento.disponible,
                      'bg-white hover:bg-purple-50 border-2 border-gray-200 hover:border-purple-300': asiento.disponible && !asiento.seleccionado,
                      'border-purple-500': asiento.tipo === 'vip' && asiento.disponible && !asiento.seleccionado,
                      'border-green-500': asiento.tipo === 'estandar' && asiento.disponible && !asiento.seleccionado
                    }"
                    class="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-medium transition-all duration-200 relative"
                  >
                    {{ asiento.codigo.replace(letraFila, '') }}
                    
                    <!-- Badge VIP -->
                    <span 
                      v-if="asiento.tipo === 'vip' && asiento.disponible"
                      class="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full text-xs text-white flex items-center justify-center"
                    >
                      V
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Leyenda -->
            <div class="mt-8 pt-6 border-t border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Leyenda</h3>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="flex items-center space-x-2">
                  <div class="w-6 h-6 bg-white border-2 border-gray-200 rounded"></div>
                  <span class="text-sm text-gray-600">Disponible</span>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="w-6 h-6 bg-green-500 rounded"></div>
                  <span class="text-sm text-gray-600">Seleccionado</span>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="w-6 h-6 bg-gray-300 rounded"></div>
                  <span class="text-sm text-gray-600">Ocupado</span>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="w-6 h-6 bg-white border-2 border-purple-500 rounded relative">
                    <span class="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full"></span>
                  </div>
                  <span class="text-sm text-gray-600">VIP</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Panel de resumen -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-xl shadow-lg p-6 sticky top-8">
            <h3 class="text-lg font-bold text-gray-900 mb-4">Resumen de Compra</h3>
            
            <!-- Asientos seleccionados -->
            <div v-if="asientosSeleccionados.length > 0" class="mb-6">
              <h4 class="font-semibold text-gray-900 mb-3">Asientos Seleccionados</h4>
              <div class="space-y-2">
                <div 
                  v-for="asiento in asientosSeleccionados" 
                  :key="asiento.codigo"
                  class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div class="flex items-center space-x-3">
                    <div 
                      :class="{
                        'bg-purple-500': asiento.tipo === 'vip',
                        'bg-green-500': asiento.tipo === 'estandar'
                      }"
                      class="w-4 h-4 rounded-full"
                    ></div>
                    <span class="font-medium">{{ asiento.codigo }}</span>
                    <span class="text-sm text-gray-600 capitalize">{{ asiento.tipo }}</span>
                  </div>
                  <span class="font-semibold text-purple-600">${{ formatPrice(asiento.precio) }}</span>
                </div>
              </div>
            </div>

            <!-- Total -->
            <div class="border-t pt-4">
              <div class="flex justify-between items-center mb-4">
                <span class="text-lg font-semibold text-gray-900">Total</span>
                <span class="text-2xl font-bold text-purple-600">${{ formatPrice(totalCompra) }}</span>
              </div>
              
              <UButton 
                @click="procederCompra"
                :disabled="asientosSeleccionados.length === 0"
                color="purple"
                size="lg"
                class="w-full"
              >
                Proceder a Pagar ({{ asientosSeleccionados.length }} asiento{{ asientosSeleccionados.length !== 1 ? 's' : '' }})
              </UButton>
            </div>

            <!-- Información de la función -->
            <div class="mt-6 pt-6 border-t border-gray-200">
              <h4 class="font-semibold text-gray-900 mb-3">Información de la Función</h4>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600">Fecha:</span>
                  <span class="font-medium">{{ formatDate(funcion?.fecha_hora_inicio) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Hora:</span>
                  <span class="font-medium">{{ formatTime(funcion?.fecha_hora_inicio) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Sala:</span>
                  <span class="font-medium">{{ funcion?.sala?.nombre }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Idioma:</span>
                  <span class="font-medium">{{ funcion?.idioma_audio }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Subtítulos:</span>
                  <span class="font-medium">{{ funcion?.subtitulos ? 'Sí' : 'No' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCineStore } from '~/stores/cine'

const route = useRoute()
const router = useRouter()
const api = useApi()

// Estado
const loading = ref(true)
const error = ref(null)
const funcion = ref(null)
const pelicula = ref(null)
const mapaAsientos = ref({})
const estadisticas = ref(null)
const asientosSeleccionados = ref([])

// Obtener ID de la función
const funcionId = route.params.id

// Cargar asientos
const cargarAsientos = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await api.getAsientosFuncion(funcionId)
    
    if (response.funcion_id) {
      // Cargar información de la función
      await cargarInformacionFuncion()
      
      // Procesar mapa de asientos
      mapaAsientos.value = response.mapa_asientos
      estadisticas.value = response.estadisticas
      
      // Agregar estado de selección a cada asiento
      Object.keys(mapaAsientos.value).forEach(letraFila => {
        mapaAsientos.value[letraFila].forEach(asiento => {
          asiento.seleccionado = false
        })
      })
    } else {
      error.value = 'No se pudo cargar la información de los asientos'
    }
  } catch (err) {
    error.value = 'Error de conexión'
    console.error('Error cargando asientos:', err)
  } finally {
    loading.value = false
  }
}

// Cargar información de la función
const cargarInformacionFuncion = async () => {
  try {
    // Aquí podrías hacer una llamada adicional para obtener la información de la función
    // Por ahora, usaremos datos simulados
    funcion.value = {
      fecha_hora_inicio: '2024-12-20T15:30:00',
      sala: {
        nombre: 'Sala VIP'
      },
      idioma_audio: 'Español',
      subtitulos: false
    }
  } catch (err) {
    console.error('Error cargando información de función:', err)
  }
}

// Seleccionar asiento
const seleccionarAsiento = (asiento) => {
  if (!asiento.disponible) return
  
  if (asiento.seleccionado) {
    // Deseleccionar
    asiento.seleccionado = false
    asientosSeleccionados.value = asientosSeleccionados.value.filter(a => a.codigo !== asiento.codigo)
  } else {
    // Seleccionar
    asiento.seleccionado = true
    asientosSeleccionados.value.push(asiento)
  }
}

// Calcular total de la compra
const totalCompra = computed(() => {
  return asientosSeleccionados.value.reduce((total, asiento) => total + asiento.precio, 0)
})

// Formatear fecha
const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Formatear fecha y hora
const formatDateTime = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Formatear hora
const formatTime = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Formatear precio
const formatPrice = (price) => {
  if (!price) return '0'
  return price.toLocaleString('es-CO')
}

// Proceder a la compra
const procederCompra = () => {
  if (asientosSeleccionados.value.length === 0) return
  
  // Guardar en el store
  const cineStore = useCineStore()
  cineStore.setAsientosSeleccionados(asientosSeleccionados.value)
  cineStore.setFuncionActual(funcion.value)
  cineStore.setTotalCompra(totalCompra.value)
  
  // Navegar a la página de pago
  router.push('/pago')
}

// WebSocket para actualizaciones en tiempo real (deshabilitado temporalmente)
// const ws = useWebSocket()

// Conectar WebSocket al montar el componente
onMounted(async () => {
  await cargarAsientos()
  
  // TODO: Implementar WebSocket cuando esté disponible
  // ws.connect()
  
  // Suscribirse a actualizaciones de asientos
  // if (funcionId) {
  //   ws.subscribeToAsientos(funcionId, (data) => {
  //     console.log('Actualización de asientos recibida:', data)
  //     
  //     // Actualizar el estado de los asientos en tiempo real
  //     if (data.mapa_asientos) {
  //       // Actualizar solo los asientos que cambiaron
  //       Object.keys(data.mapa_asientos).forEach(letraFila => {
  //         if (mapaAsientos.value[letraFila]) {
  //           data.mapa_asientos[letraFila].forEach(asientoActualizado => {
  //             const asientoExistente = mapaAsientos.value[letraFila].find(
  //               a => a.codigo === asientoActualizado.codigo
  //             )
  //             if (asientoExistente) {
  //               // Mantener el estado de selección si el asiento estaba seleccionado
  //               const estabaSeleccionado = asientoExistente.seleccionado
  //               Object.assign(asientoExistente, asientoActualizado)
  //               asientoExistente.seleccionado = estabaSeleccionado
  //             }
  //           })
  //         }
  //       })
  //     }
  //     
  //     // Actualizar estadísticas
  //     if (data.estadisticas) {
  //       estadisticas.value = data.estadisticas
  //     }
  //   })
  // }
})

// Limpiar al desmontar
// onBeforeUnmount(() => {
//   if (funcionId) {
//     ws.unsubscribeFromAsientos(funcionId)
//   }
//   ws.disconnect()
// })
</script> 