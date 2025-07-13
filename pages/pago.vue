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
              <h1 class="text-2xl font-bold text-gray-900">Proceso de Pago</h1>
              <p class="text-gray-600">Completa tu compra</p>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Contenido principal -->
    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Resumen de la compra -->
        <div class="bg-white rounded-xl shadow-lg p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-6">Resumen de la Compra</h2>
          
          <div v-if="asientosSeleccionados.length === 0" class="text-center py-8">
            <UIcon name="heroicons:exclamation-triangle" class="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <p class="text-gray-600">No hay asientos seleccionados</p>
            <UButton to="/peliculas" color="purple" class="mt-4">
              Seleccionar Asientos
            </UButton>
          </div>

          <div v-else>
            <!-- Información de la función -->
            <div class="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 class="font-semibold text-gray-900 mb-3">Información de la Función</h3>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600">Película:</span>
                  <span class="font-medium">{{ funcionActual?.pelicula?.titulo || 'Película' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Fecha:</span>
                  <span class="font-medium">{{ formatDate(funcionActual?.fecha_hora_inicio) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Hora:</span>
                  <span class="font-medium">{{ formatTime(funcionActual?.fecha_hora_inicio) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Sala:</span>
                  <span class="font-medium">{{ funcionActual?.sala?.nombre }}</span>
                </div>
              </div>
            </div>

            <!-- Asientos seleccionados -->
            <div class="mb-6">
              <h3 class="font-semibold text-gray-900 mb-3">Asientos Seleccionados</h3>
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
              <div class="flex justify-between items-center">
                <span class="text-lg font-semibold text-gray-900">Total</span>
                <span class="text-2xl font-bold text-purple-600">${{ formatPrice(totalCompra) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Formulario de pago -->
        <div class="bg-white rounded-xl shadow-lg p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-6">Información de Pago</h2>
          
          <form @submit.prevent="procesarPago" class="space-y-6">
            <!-- Información personal -->
            <div>
              <h3 class="font-semibold text-gray-900 mb-4">Información Personal</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input 
                    v-model="formData.nombre"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                  <input 
                    v-model="formData.apellido"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    v-model="formData.email"
                    type="email"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input 
                    v-model="formData.telefono"
                    type="tel"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <!-- Método de pago -->
            <div>
              <h3 class="font-semibold text-gray-900 mb-4">Método de Pago</h3>
              <div class="space-y-3">
                <label class="flex items-center space-x-3 cursor-pointer">
                  <input 
                    v-model="formData.metodoPago"
                    type="radio"
                    value="tarjeta"
                    class="text-purple-600 focus:ring-purple-500"
                  />
                  <span class="text-gray-700">Tarjeta de Crédito/Débito</span>
                </label>
                <label class="flex items-center space-x-3 cursor-pointer">
                  <input 
                    v-model="formData.metodoPago"
                    type="radio"
                    value="efectivo"
                    class="text-purple-600 focus:ring-purple-500"
                  />
                  <span class="text-gray-700">Efectivo en Taquilla</span>
                </label>
              </div>
            </div>

            <!-- Información de tarjeta (si aplica) -->
            <div v-if="formData.metodoPago === 'tarjeta'" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Número de Tarjeta</label>
                <input 
                  v-model="formData.numeroTarjeta"
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Fecha de Vencimiento</label>
                  <input 
                    v-model="formData.fechaVencimiento"
                    type="text"
                    placeholder="MM/AA"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                  <input 
                    v-model="formData.cvv"
                    type="text"
                    placeholder="123"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <!-- Botón de pago -->
            <UButton 
              type="submit"
              :loading="procesandoPago"
              :disabled="asientosSeleccionados.length === 0 || !formData.metodoPago"
              color="purple"
              size="lg"
              class="w-full"
            >
              {{ procesandoPago ? 'Procesando...' : `Pagar $${formatPrice(totalCompra)}` }}
            </UButton>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const cineStore = useCineStore()
const api = useApi()

// Estado del formulario
const formData = ref({
  nombre: '',
  apellido: '',
  email: '',
  telefono: '',
  metodoPago: '',
  numeroTarjeta: '',
  fechaVencimiento: '',
  cvv: ''
})

const procesandoPago = ref(false)

// Obtener datos del store
const asientosSeleccionados = computed(() => cineStore.asientosSeleccionados || [])
const funcionActual = computed(() => cineStore.funcionActual || {})
const totalCompra = computed(() => cineStore.totalCompra || 0)

// Formatear fecha
const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
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

// Procesar pago
const procesarPago = async () => {
  if (asientosSeleccionados.value.length === 0) return
  
  procesandoPago.value = true
  
  try {
    const datosCompra = {
      funcion_id: funcionActual.value?.id,
      asientos: asientosSeleccionados.value.map(a => a.codigo),
      cliente: {
        nombre: formData.value.nombre,
        apellido: formData.value.apellido,
        email: formData.value.email,
        telefono: formData.value.telefono
      },
      metodo_pago: formData.value.metodoPago,
      total: totalCompra.value
    }
    
    // Simular llamada a la API
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Aquí iría la llamada real a la API
    // const response = await api.comprarEntrada(datosCompra)
    
    // Limpiar el store
    cineStore.limpiarAsientosSeleccionados()
    cineStore.setFuncionActual(null)
    cineStore.setTotalCompra(0)
    
    // Mostrar mensaje de éxito y redirigir
    alert('¡Compra realizada con éxito!')
    navigateTo('/')
    
  } catch (error) {
    console.error('Error procesando pago:', error)
    alert('Error al procesar el pago. Inténtalo de nuevo.')
  } finally {
    procesandoPago.value = false
  }
}
</script> 